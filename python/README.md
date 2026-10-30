# CHRONO-ZYMURGY OS — Continuous-Time Biophysics & Recipe Engine

A high-performance Python package providing mathematical simulation and optimization for the CHRONO-ZYMURGY OS desktop app.

## Capabilities

1. **Continuous-Time Biophysics ODE Solver (`zymurgy_ode_solver.py`):**
   - Solves coupled non-linear differential equations via `scipy.integrate.solve_ivp` (Radau / RK45).
   - Models Monod biomass kinetics, substrate depletion, ethanol production, and Henry's Law continuous $CO_2$ mass transfer.
   - Calculates diacetyl formation ($\alpha$-acetolactate decarboxylation) and enzymatic yeast reabsorption window.
   - Simulates Stokes' Law hydrodynamic sedimentation for scarred $G_0$ mother cells vs buoyant $G_4$   daughter cells under conical funnel separation vs missing funnel washback.

2. **AI Recipe Clone & Formulation Optimizer (`recipe_optimizer.py`):**
   - Calculates exact Dry/Liquid Malt Extract (DME/LME) mass for target Original Gravity and ABV for the 5,450 mL Pinter volume.
   - Tinseth hop utilization formula adapted for 10-minute concentrated 1L simmer teas and aroma tinctures.
   - Morey's equation for color (SRM).
   - Pitching cell count formulas and cost savings breakdown (70–75% savings vs commercial packs).
   - Validated via strict Pydantic v2 schemas.

3. **Unified CLI & Electron IPC Bridge (`cli.py`):**
   - Exposes `simulate-ode` and `optimize-recipe` subcommands with JSON I/O for headless use and Electron integration.

## Testing

```bash
uv run --with numpy --with scipy --with pydantic --with pytest pytest test_zymurgy.py -v
```
