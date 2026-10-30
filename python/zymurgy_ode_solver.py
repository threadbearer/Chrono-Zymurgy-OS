"""
zymurgy_ode_solver.py
=====================
Continuous-Time Biophysics & Fermentation Kinetics ODE Solver
for CHRONO-ZYMURGY OS.

Models the multi-physics of pressurized vessel fermentation (Pinter 5,450 mL):
1. Coupled Monod yeast growth kinetics: dX/dt
2. Substrate (malt extract sugar) consumption: dS/dt
3. Ethanol accumulation: dP/dt
4. Henry's Law continuous CO2 mass transfer & headspace pressure: dP_head/dt
5. Diacetyl formation (alpha-acetolactate decarboxylation) & enzymatic reabsorption: dDC/dt
6. Stokes' Law hydrodynamic cell sedimentation (scarred G0 mothers vs buoyant G4 virgin daughters)
   under conical funnel capture vs missing funnel washback.
"""

from dataclasses import dataclass, asdict
from typing import Dict, Any, List, Optional
import numpy as np
from scipy.integrate import solve_ivp

# Physical Constants
PINTER_FILL_L = 5.450        # 5,450 mL liquid fill
DEFAULT_AIR_POCKET_ML = 1200 # Headspace air pocket volume
ATM_PSI = 14.696             # 1 atm in PSI
R_GAS_CONST = 0.082057       # L*atm/(mol*K)
CO2_MOLAR_MASS_G = 44.01     # g/mol

# Biological & Henry's Constants
HENRY_K_CO2_293K = 0.034     # mol/(L*atm) at 20°C (water)
TEMP_COEFF_HENRY = 2400.0    # Van 't Hoff temperature dependence factor

# Stokes' settling parameters
GRAVITY_M_S2 = 9.81
DENSITY_CELL_KG_M3 = 1100.0   # Yeast cell density ~ 1.10 g/cm^3
DENSITY_WORT_KG_M3 = 1045.0   # Wort density ~ 1.045 g/cm^3
VISCOSITY_WORT_PA_S = 0.0018  # Dynamic viscosity ~ 1.8 mPa*s at 20°C
RADIUS_MOTHER_M = 4.2e-6      # Scarred G0/G1 mother radius ~ 4.2 um
RADIUS_DAUGHTER_M = 2.4e-6    # Virgin G4 daughter radius ~ 2.4 um


@dataclass
class FermentationInput:
    og: float = 1.050                # Original Gravity (e.g. 1.050)
    target_fg: float = 1.010         # Expected Final Gravity
    temp_f: float = 70.0             # Fermentation temperature (°F)
    air_pocket_ml: float = 1200.0    # Headspace air volume (mL)
    aeration_protocol: str = "standard" # "gentle", "standard", "dual_vector"
    shake_90min: bool = True         # 90-minute post-pitch agitation
    conical_installed: bool = True   # Main cap conical funnel presence
    undock_tau: float = 1.25         # Undocking biological time
    fridge_hours: float = 84.0       # Cold lock duration (hours at 38°F)
    total_ferment_hours: float = 168.0 # Warm fermentation phase (hours, e.g. 7 days)


def temp_f_to_k(temp_f: float) -> float:
    return (temp_f - 32.0) * (5.0 / 9.0) + 273.15


def sg_to_plato(sg: float) -> float:
    """Convert specific gravity to degrees Plato (approximate g sugar per 100g wort)."""
    return (-1.0 * 616.868) + (1111.14 * sg) - (630.272 * (sg ** 2)) + (135.997 * (sg ** 3))


def plato_to_sugar_gl(plato: float, sg: float) -> float:
    """Convert °Plato to g/L of fermentable substrate."""
    return plato * sg * 10.0


def calculate_initial_oxygen(air_pocket_ml: float, protocol: str, shake_90min: bool) -> float:
    """Calculate effective dissolved oxygen in mg/L available to yeast."""
    air_density_mg_ml = 1.29
    o2_fraction = 0.2095
    headspace_o2_mg = air_pocket_ml * (air_density_mg_ml * o2_fraction)
    base_dissolved_mg = PINTER_FILL_L * 8.5 # 8.5 mg/L saturation in water

    eff = 0.50
    if protocol == "standard":
        eff = 0.72
    elif protocol == "dual_vector":
        eff = 0.88
    if shake_90min:
        eff = min(0.96, eff + 0.14)

    total_o2_mg = base_dissolved_mg + (headspace_o2_mg * eff)
    return total_o2_mg / PINTER_FILL_L


class BiophysicsODESolver:
    """Solves continuous-time biophysics differential equations for brewing kinetics."""

    def __init__(self, config: FermentationInput):
        self.config = config
        self.temp_k = temp_f_to_k(config.temp_f)

        # Kinetic parameters calibrated for brewing yeast
        # Arrhenius temperature scaling: k(T) = k_ref * exp(-Ea/R * (1/T - 1/T_ref))
        t_ref_k = 293.15 # 20°C (68°F)
        temp_scale = np.exp(-4500.0 * ((1.0 / self.temp_k) - (1.0 / t_ref_k)))

        self.mu_max = 0.11 * temp_scale    # Max yeast growth rate (1/h)
        self.ks_sugar = 4.0                # Monod saturation constant (g/L)
        self.yield_x_s = 0.08              # Biomass yield on sugar (g cells / g sugar)
        self.yield_p_s = 0.48              # Ethanol yield on sugar (g EtOH / g sugar)
        self.co2_yield_p = 0.95            # g CO2 generated per g EtOH produced
        self.decay_rate = 0.002            # Natural yeast death/dormancy rate (1/h)

        # Diacetyl kinetics (ppm/h)
        self.k_diacetyl_form = 0.045 * temp_scale  # Alpha-acetolactate -> Diacetyl
        self.k_diacetyl_reduct = 0.075 * temp_scale # Enzymatic reduction by active yeast

        # Headspace volume in Liters
        self.v_headspace_l = max(0.200, self.config.air_pocket_ml / 1000.0)

    def derivatives(self, t: float, y: np.ndarray) -> np.ndarray:
        """
        State vector y:
        y[0] = S  : Substrate sugar (g/L)
        y[1] = X  : Active yeast biomass (g/L)
        y[2] = P  : Ethanol (g/L)
        y[3] = CO2_mol : Accumulated CO2 in headspace (moles)
        y[4] = DC : Diacetyl (ppm)
        y[5] = O2 : Dissolved Oxygen (mg/L)
        """
        S, X, P, co2_mol, DC, O2 = y

        # Ensure non-negative biological concentrations
        S = max(0.0, S)
        X = max(0.001, X)
        P = max(0.0, P)
        DC = max(0.0, DC)
        O2 = max(0.0, O2)

        # 1. Monod growth with ethanol inhibition factor: (1 - P/P_max)
        p_max = 85.0 # ~10.5% ABV ethanol ceiling for typical ale strains
        inhibition = max(0.05, 1.0 - (P / p_max) ** 1.5)
        mu = self.mu_max * (S / (self.ks_sugar + S)) * inhibition

        # Oxygen uptake during lag/early exponential phase
        dO2_dt = -0.35 * mu * X * (O2 / (0.5 + O2)) if O2 > 0.01 else 0.0

        # Biomass growth
        dX_dt = (mu - self.decay_rate) * X

        # Substrate consumption
        maintenance = 0.0015 * X
        dS_dt = - (1.0 / self.yield_x_s) * mu * X - maintenance
        if S <= 0.1:
            dS_dt = 0.0

        # Ethanol production
        dP_dt = self.yield_p_s * (-dS_dt)

        # CO2 generation into gas phase
        # 1 g EtOH produces ~ 0.95 g CO2 (molecular ratio 44/46)
        co2_mass_rate_g = (-dS_dt) * self.yield_p_s * self.co2_yield_p * PINTER_FILL_L
        dCO2_dt = co2_mass_rate_g / CO2_MOLAR_MASS_G # moles/hour into headspace

        # Diacetyl kinetics:
        # Formed alongside valine/leucine synthesis while yeast actively grows (mu * X)
        # Reabsorbed and reduced enzymatically by yeast in late fermentation (when S drops)
        sugar_starvation_boost = 1.0 + (10.0 / (1.0 + S))
        dDC_dt = (self.k_diacetyl_form * mu * X) - (self.k_diacetyl_reduct * (X / (1.0 + X)) * DC * sugar_starvation_boost)

        return np.array([dS_dt, dX_dt, dP_dt, dCO2_dt, dDC_dt, dO2_dt])

    def solve(self, num_points: int = 100) -> Dict[str, Any]:
        """Integrate the system from t=0 to total_ferment_hours and model cold crash."""
        s0_plato = sg_to_plato(self.config.og)
        s0_gl = plato_to_sugar_gl(s0_plato, self.config.og)
        x0_gl = 0.45 # ~11 billion cells pitched initially into 5.45L wort
        p0_gl = 0.0
        co2_mol0 = 0.0
        dc0_ppm = 0.15
        o2_0_mgl = calculate_initial_oxygen(
            self.config.air_pocket_ml,
            self.config.aeration_protocol,
            self.config.shake_90min
        )

        y0 = np.array([s0_gl, x0_gl, p0_gl, co2_mol0, dc0_ppm, o2_0_mgl])
        t_span = (0.0, self.config.total_ferment_hours)
        t_eval = np.linspace(0.0, self.config.total_ferment_hours, num_points)

        sol = solve_ivp(
            self.derivatives,
            t_span,
            y0,
            t_eval=t_eval,
            method="Radau", # Stiff ODE solver for biochemical kinetics
            rtol=1e-5,
            atol=1e-7,
        )

        if not sol.success:
            # Fallback to RK45 if Radau encounters numerical difficulty
            sol = solve_ivp(self.derivatives, t_span, y0, t_eval=t_eval, method="RK45")

        times = sol.t
        S = sol.y[0]
        X = sol.y[1]
        P = sol.y[2]
        co2_moles = sol.y[3]
        DC = sol.y[4]
        O2 = sol.y[5]

        # Calculate Derived Physical Trajectories
        # ABV % (v/v): (g EtOH / L) / (0.789 g/mL * 10)
        abv_pct = P / 7.89

        # Current Specific Gravity: OG - (S0 - S)/1000 * factor
        # Standard brewing approximation:
        consumed_sugar_ratio = np.clip(1.0 - (S / s0_gl), 0.0, 1.0)
        sg_curve = self.config.og - consumed_sugar_ratio * (self.config.og - self.config.target_fg)

        # Headspace Pressure via Ideal Gas Law + Vessel PRV relief at 15 PSI
        # P = n*R*T / V
        ideal_pressure_atm = (co2_moles * R_GAS_CONST * self.temp_k) / self.v_headspace_l
        psi_unrelieved = ideal_pressure_atm * ATM_PSI
        # Pinter PRV regulates and vents excess pressure beyond 15.0 - 16.5 PSI
        psi_gauge = np.minimum(15.5, psi_unrelieved)

        # Yeast Dynasty Replications Formula: Gn = 1.8 + 3.1 * (1 - exp(-O2_mg / 135))
        total_o2_mass_mg = o2_0_mgl * PINTER_FILL_L
        Gn = 1.8 + 3.1 * (1.0 - np.exp(-total_o2_mass_mg / 135.0))
        daughter_fraction = min(0.95, max(0.40, (Gn - 1.8) / 3.1))

        # Stokes' Hydrodynamic Settling Model
        # v = 2 * r^2 * (rho_cell - rho_fluid) * g / (9 * eta)
        # Cold crash at 38°F (3.3°C): wort viscosity rises to ~ 2.8 mPa*s, density ~ 1045
        v_mother_m_s = (2.0 * (RADIUS_MOTHER_M ** 2) * (DENSITY_CELL_KG_M3 - DENSITY_WORT_KG_M3) * GRAVITY_M_S2) / (9.0 * VISCOSITY_WORT_PA_S)
        v_daughter_m_s = (2.0 * (RADIUS_DAUGHTER_M ** 2) * (DENSITY_CELL_KG_M3 - DENSITY_WORT_KG_M3) * GRAVITY_M_S2) / (9.0 * VISCOSITY_WORT_PA_S)

        # Mother cells settle ~ 3.06x faster than daughter cells
        # Funnel efficiency: conical funnel prevents washback into active 500 mL pint
        cold_progress = min(1.0, (self.config.fridge_hours / 168.0) ** 0.75)
        if self.config.conical_installed:
            mother_retention = max(0.03, 0.07 * (1.0 - cold_progress * 0.75))
            trub_drag = round(float(0.8 + max(0.0, (1.0 - self.config.undock_tau) * 2.5) + (1.0 - cold_progress) * 0.5), 1)
        else:
            mother_retention = max(0.40, 0.75 * (1.0 - cold_progress * 0.40))
            trub_drag = round(float(6.5 + (1.0 - cold_progress) * 2.2), 1)

        # Suspended Virgin G4 Daughters per 500mL pint
        base_g4_billions = 36.0 * daughter_fraction
        g4_pint_billions = round(float(base_g4_billions * (1.0 - cold_progress * 0.40)), 1)

        # Diacetyl & Acetaldehyde sensory scores (1.0 - 10.0 scale)
        final_dc_ppm = float(DC[-1])
        if self.config.undock_tau < 1.0:
            final_dc_score = min(10.0, final_dc_ppm * 8.0 + (1.0 - self.config.undock_tau) * 6.0)
        elif self.config.undock_tau <= 1.25:
            polish = (self.config.undock_tau - 1.0) / 0.25
            final_dc_score = max(0.8, final_dc_ppm * 4.0 * (1.0 - polish * 0.50))
        else:
            final_dc_score = max(0.7, final_dc_ppm * 2.0)

        # Krausen Foam Clearance Check
        foam_vol_ml = 380.0 + (self.config.temp_f - 65.0) * 18.0 + (abv_pct[-1] * 25.0)
        krausen_clearance_ml = self.config.air_pocket_ml - foam_vol_ml
        is_blowout_risk = bool(self.config.air_pocket_ml < 820.0 or krausen_clearance_ml < 150.0)

        # Assemble Time-Series Curve Records
        time_series = []
        for i in range(len(times)):
            t_hr = float(times[i])
            tau = float(t_hr / (self.config.total_ferment_hours * 0.65)) # 1.0 tau corresponds to ~65% mark
            time_series.append({
                "hour": round(t_hr, 1),
                "tau": round(tau, 2),
                "sg": round(float(sg_curve[i]), 4),
                "abv": round(float(abv_pct[i]), 2),
                "psi": round(float(psi_gauge[i]), 1),
                "sugar_gl": round(float(S[i]), 1),
                "biomass_gl": round(float(X[i]), 2),
                "diacetyl_ppm": round(float(DC[i]), 3),
            })

        return {
            "summary": {
                "initial_gravity": round(self.config.og, 4),
                "final_gravity": round(float(sg_curve[-1]), 4),
                "final_abv_pct": round(float(abv_pct[-1]), 2),
                "peak_headspace_psi": round(float(np.max(psi_gauge)), 1),
                "yeast_dynasty_Gn": round(float(Gn), 2),
                "daughter_fraction": round(float(daughter_fraction), 2),
                "suspended_g4_daughters_per_pint": g4_pint_billions,
                "mother_retention_ratio": round(float(mother_retention), 3),
                "trub_drag_score": trub_drag,
                "diacetyl_sensory_score": round(final_dc_score, 1),
                "is_blowout_risk": is_blowout_risk,
                "krausen_clearance_ml": round(float(krausen_clearance_ml), 1),
            },
            "biophysics": {
                "stokes_settling_ratio_mother_vs_daughter": round(float(v_mother_m_s / v_daughter_m_s), 2),
                "dissolved_o2_initial_mg": round(float(total_o2_mass_mg), 1),
                "wort_temp_k": round(self.temp_k, 2),
            },
            "time_series": time_series,
        }


def run_simulation(inputs: Dict[str, Any]) -> Dict[str, Any]:
    """Convenience wrapper for dictionary/JSON input."""
    cfg = FermentationInput(
        og=float(inputs.get("og", 1.050)),
        target_fg=float(inputs.get("target_fg", 1.010)),
        temp_f=float(inputs.get("temp_f", 70.0)),
        air_pocket_ml=float(inputs.get("air_pocket_ml", 1200.0)),
        aeration_protocol=str(inputs.get("aeration_protocol", "standard")),
        shake_90min=bool(inputs.get("shake_90min", True)),
        conical_installed=bool(inputs.get("conical_installed", True)),
        undock_tau=float(inputs.get("undock_tau", 1.25)),
        fridge_hours=float(inputs.get("fridge_hours", 84.0)),
        total_ferment_hours=float(inputs.get("total_ferment_hours", 168.0)),
    )
    solver = BiophysicsODESolver(cfg)
    return solver.solve()


if __name__ == "__main__":
    test_result = run_simulation({"og": 1.052, "temp_f": 72.0, "air_pocket_ml": 1200.0})
    print("ODE Simulation Success:")
    print(f"Final ABV: {test_result['summary']['final_abv_pct']}%")
    print(f"Gn: {test_result['summary']['yeast_dynasty_Gn']}")
    print(f"Headspace Peak PSI: {test_result['summary']['peak_headspace_psi']} PSI")
