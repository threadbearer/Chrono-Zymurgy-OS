// Unified Multi-Physics & Yeast Dynasty Simulation Engine
// Incorporating Henry's Law Headspace Gas Transfer, Replicative Yeast Generations,
// Stokes' Law Hydrodynamic Settling, and Conical Funnel Separation.

export const AIR_DENSITY_MG_ML = 1.29; // mg/mL air at 20°C
export const O2_FRACTION = 0.2095;    // 20.95% O2 in atmosphere
export const WATER_O2_SAT_MG_L = 8.5; // mg/L dissolved O2 at 20°C in water
export const PINTER_FILL_ML = 5450;    // Standard liquid fill line: 5,450 mL

/**
 * Run the unified biophysics simulation
 */
export function simulateFermentation({
  kit,
  tempF = 72,
  airPocketMl = 1200,
  aerationProtocol = 'standard', // 'gentle' | 'standard' | 'dual_vector'
  shake90Min = false,
  conicalInstalled = true,
  undockTau = 1.25,
  fridgeHours = 84,
}) {
  // 1. Headspace Henry's Law Gas & Mass Transfer
  // Headspace air contains 0.27 mg O2 per mL
  const headspaceO2Mg = airPocketMl * (AIR_DENSITY_MG_ML * O2_FRACTION);
  const dissolvedBaseO2Mg = (PINTER_FILL_ML / 1000) * WATER_O2_SAT_MG_L; // ~46.3 mg

  // Transfer efficiency k_L*a driven by agitation protocol
  let transferEff = 0.50; // gentle 30s
  if (aerationProtocol === 'standard') transferEff = 0.72; // 2-min shake
  if (aerationProtocol === 'dual_vector') transferEff = 0.88; // 2-min shake + figure-8

  if (shake90Min) {
    transferEff = Math.min(0.96, transferEff + 0.14);
  }

  // Dissolved O2 mass available to yeast
  const effectiveO2TransferredMg = headspaceO2Mg * transferEff;
  const totalEffectiveO2Mg = Math.round(dissolvedBaseO2Mg + effectiveO2TransferredMg);

  // 2. Yeast Dynasty Replicative Generations Formula:
  // Gn = 1.8 + 3.1 * (1 - e^(-O2 / 135))
  const Gn = Number((1.8 + 3.1 * (1 - Math.exp(-totalEffectiveO2Mg / 135))).toFixed(2));
  const daughterFraction = Math.min(0.95, Math.max(0.40, (Gn - 1.8) / 3.1));

  // 3. Krausen Foam Expansion vs Air Pocket Ceiling
  // Higher temp and higher ABV increase foam vigor
  const tempFactor = 1 + (tempF - 68) * 0.035;
  const isWheatOrOats = kit?.style?.toLowerCase().includes('hazy') ||
                        kit?.style?.toLowerCase().includes('wit') ||
                        kit?.style?.toLowerCase().includes('wheat');
  const styleMultiplier = isWheatOrOats ? 1.35 : 1.10;
  const krausenVolumeMl = Math.round(520 * tempFactor * (kit?.abv ? kit.abv / 5.0 : 1.0) * styleMultiplier);
  const krausenClearanceMl = airPocketMl - krausenVolumeMl;
  const isBlowoutRisk = airPocketMl < 820 || krausenClearanceMl < 180;

  // 4. Conical Funnel Hydrodynamics & Stokes' Settling
  // Stokes Settling velocity: v = 2r^2(rho_p - rho_f)g / 9eta
  // Cold lock at 38°F dramatically cleanses dense cells and trub
  const coldSettlingProgress = Math.min(1.0, Math.pow(fridgeHours / 168, 0.75));

  // Mother cell settling rate vs Virgin Daughter settling rate
  // G0/G1 mothers (scarred, dense) settle 3.5x faster than small smooth G4 daughters
  let motherRetained = 0;
  let trubDragScore = 1.0;

  if (conicalInstalled) {
    // 92% of mothers and early trub fall through conical funnel into dock before 1.0 tau
    // Undocking cleanly eliminates them!
    motherRetained = Math.max(0.04, 0.08 * (1 - coldSettlingProgress * 0.7));
    trubDragScore = Number((0.8 + (1 - undockTau > 0 ? (1.0 - undockTau) * 2.5 : 0) + (1 - coldSettlingProgress) * 0.6).toFixed(1));
  } else {
    // MISSING FUNNEL: 75% of trub and scarred mothers wash back into liquid at undocking
    motherRetained = Math.max(0.45, 0.75 * (1 - coldSettlingProgress * 0.4));
    trubDragScore = Number((6.8 + (1 - coldSettlingProgress) * 2.2).toFixed(1));
  }

  // Virgin G4 daughter cell count per 500 mL pint
  // Optimum is 20 - 32 billion cells for rich silk without chalk
  const baseDaughterCellsBillion = 38 * daughterFraction;
  const daughterColdSettling = coldSettlingProgress * 0.42; // daughters remain buoyantly suspended
  const suspendedG4PerPint = Number((baseDaughterCellsBillion * (1 - daughterColdSettling)).toFixed(1));

  // 5. Metabolic Intermediates (Diacetyl, Acetaldehyde, Terpenes)
  // Polish phase multiplier based on undock biological time
  let diacetyl = kit?.scores?.dc ?? 2.5;
  let acetaldehyde = kit?.scores?.as ?? 2.5;

  if (undockTau < 1.00) {
    // Undocked before horizon: high diacetyl & green apple acetaldehyde
    diacetyl += (1.00 - undockTau) * 8.0;
    acetaldehyde += (1.00 - undockTau) * 6.5;
  } else if (undockTau <= 1.25) {
    // Daughter polish rest window: smooth reduction
    const polishProgress = (undockTau - 1.00) / 0.25;
    diacetyl = diacetyl * (1 - polishProgress * 0.45);
    acetaldehyde = acetaldehyde * (1 - polishProgress * 0.55);
  } else {
    // Extended crowd polish
    const extra = (undockTau - 1.25) / 0.35;
    diacetyl = Math.max(0.8, diacetyl * 0.55 * (1 - extra * 0.3));
    acetaldehyde = Math.max(0.8, acetaldehyde * 0.45 * (1 - extra * 0.4));
  }

  diacetyl = Number(Math.min(10, Math.max(0.8, diacetyl)).toFixed(1));
  acetaldehyde = Number(Math.min(10, Math.max(0.8, acetaldehyde)).toFixed(1));

  // Terpene lift under 15 PSI
  let terpeneLift = kit?.scores?.aroma ?? 7.5;
  if (!conicalInstalled) terpeneLift = Math.max(1, terpeneLift - 2.0); // masked by trub
  terpeneLift = Number(terpeneLift.toFixed(1));

  // Silk / Suspension Architecture score
  let silkScore = kit?.scores?.silk ?? 6.0;
  if (conicalInstalled) {
    silkScore = Math.min(10, silkScore * (0.85 + daughterFraction * 0.25));
  } else {
    silkScore = Math.min(10, silkScore + 1.5); // artificial muddy thickness from trub
  }
  silkScore = Number(silkScore.toFixed(1));

  // Carbonic velocity
  const carbScore = Number(Math.min(10, (kit?.scores?.carb ?? 8.0) * (0.75 + coldSettlingProgress * 0.25)).toFixed(1));

  // Soma-Index (Phi) calculation
  // Function of live G4 cell suspension, active glutathione, and B-complex buffer
  let somaIndex = (suspendedG4PerPint / 30) * 8.5;
  if (!conicalInstalled) somaIndex *= 0.65; // scarred mothers degrade somatic comfort
  if (undockTau < 1.05) somaIndex *= 0.8;
  somaIndex = Number(Math.min(9.9, Math.max(3.0, somaIndex)).toFixed(1));

  // 6. Live 500 mL Pint Nutrition
  const yeastKcalPerPint = Number((suspendedG4PerPint * 0.28).toFixed(1)); // 0.28 kcal / billion cells
  const baseWortKcalPerPint = kit?.calories ?? 180;
  const totalPintCalories = Math.round(baseWortKcalPerPint + yeastKcalPerPint);

  // Bioavailable B-Complex % Daily Value
  const bComplexPctDv = Math.round(Math.min(95, suspendedG4PerPint * 2.6));

  // Active Reduced Glutathione (GSH) mg per pint
  const gshMgPerPint = Number((suspendedG4PerPint * 0.85 * (conicalInstalled ? 1.0 : 0.4)).toFixed(1));

  // 7. Time-series data generation for Recharts charts
  // View A: Generational Dynasty & Settling Time-Series
  const timeSeriesDynasty = [];
  // Biological tau phases: 0.0 to 1.6 tau
  const tauSteps = [0.0, 0.2, 0.4, 0.6, 0.8, 1.0, 1.15, 1.25, 1.4, 1.6];
  tauSteps.forEach((tau) => {
    // Mothers peak early, then settle
    const motherPct = tau <= 0.6 ? 70 - tau * 30 : Math.max(10, 52 - tau * 28);
    // Virgin daughters flourish from 0.4 tau onwards
    const daughterGrowth = tau <= 0.4 ? tau * 45 : Math.min(85, 18 + tau * 42 * (Gn / 4));
    timeSeriesDynasty.push({
      phase: `${tau.toFixed(2)} τ`,
      tauVal: tau,
      g4Daughters: Math.round(daughterGrowth),
      motherCellsTrub: conicalInstalled && tau >= 1.0 ? Math.round(motherPct * 0.15) : Math.round(motherPct),
      label: tau === 1.0 ? '1.0τ Horizon' : tau === 1.25 ? 'Undock' : ''
    });
  });

  // Fridge lock days: 0h to fridgeHours
  const fridgeDaysCount = Math.max(1, Math.round(fridgeHours / 24));
  for (let day = 1; day <= fridgeDaysCount; day++) {
    const settleProgress = Math.pow(day / (fridgeHours / 24), 0.7);
    const retainedG4 = Math.round(85 * (1 - settleProgress * 0.38));
    const retainedMothers = conicalInstalled ? Math.round(8 * (1 - settleProgress * 0.85)) : Math.round(48 * (1 - settleProgress * 0.4));
    timeSeriesDynasty.push({
      phase: `Fridge D${day}`,
      tauVal: 1.6 + day * 0.2,
      g4Daughters: retainedG4,
      motherCellsTrub: retainedMothers,
      label: day === fridgeDaysCount ? 'Tap Ready' : ''
    });
  }

  // View B: Metabolic Imprint & Botanical Vector Curves
  const timeSeriesMetabolic = [];
  tauSteps.forEach((tau) => {
    let dVal = 1.5;
    let aVal = 1.0;
    if (tau <= 0.8) {
      dVal = 1.5 + (tau / 0.8) * 6.5;
      aVal = 1.0 + (tau / 0.8) * 7.0;
    } else if (tau <= 1.25) {
      const p = (tau - 0.8) / 0.45;
      dVal = 8.0 - p * 5.2;
      aVal = 8.0 - p * 5.8;
    } else {
      const p = (tau - 1.25) / 0.35;
      dVal = Math.max(1.2, 2.8 - p * 1.4);
      aVal = Math.max(1.0, 2.2 - p * 1.1);
    }

    // Terpene retention is high under 15 PSI
    const terpVal = Math.max(4.0, (kit?.scores?.aroma ?? 8.0) * (0.95 - tau * 0.05));
    // Phenolic drag drops when trub falls
    const dragVal = conicalInstalled
      ? (tau < 1.0 ? 4.5 - tau * 2.0 : 1.2)
      : (tau < 1.0 ? 5.5 : 7.5);

    timeSeriesMetabolic.push({
      phase: `${tau.toFixed(2)} τ`,
      diacetyl: Number(dVal.toFixed(1)),
      acetaldehyde: Number(aVal.toFixed(1)),
      terpeneLift: Number(terpVal.toFixed(1)),
      phenolicDrag: Number(dragVal.toFixed(1)),
    });
  });

  return {
    inputs: {
      kit,
      tempF,
      airPocketMl,
      aerationProtocol,
      shake90Min,
      conicalInstalled,
      undockTau,
      fridgeHours,
    },
    physics: {
      headspaceO2Mg: Math.round(headspaceO2Mg),
      dissolvedBaseO2Mg: Math.round(dissolvedBaseO2Mg),
      effectiveO2TransferredMg: Math.round(effectiveO2TransferredMg),
      totalEffectiveO2Mg,
      Gn,
      daughterFraction,
      krausenVolumeMl,
      krausenClearanceMl,
      isBlowoutRisk,
      coldSettlingProgress: Number(coldSettlingProgress.toFixed(2)),
    },
    scores: {
      silk: silkScore,
      dc: diacetyl,
      as: acetaldehyde,
      aroma: terpeneLift,
      drag: trubDragScore,
      carb: carbScore,
      buzz: somaIndex,
    },
    nutrition: {
      baseWortKcalPerPint,
      yeastKcalPerPint,
      totalPintCalories,
      suspendedG4PerPint,
      bComplexPctDv,
      gshMgPerPint,
    },
    charts: {
      timeSeriesDynasty,
      timeSeriesMetabolic,
    }
  };
}


/**
 * Asynchronous deep ODE simulation using the native Python SciPy engine if available,
 * falling back to the instant synchronous JS model.
 */
export async function simulateFermentationAsync(inputs) {
  if (typeof window !== "undefined" && window.electronAPI?.simulateBiophysicsODE) {
    try {
      const response = await window.electronAPI.simulateBiophysicsODE({
        og: inputs.kit?.og || 1.050,
        target_fg: inputs.kit?.fg || 1.010,
        temp_f: inputs.tempF || 72,
        air_pocket_ml: inputs.airPocketMl || 1200,
        aeration_protocol: inputs.aerationProtocol || "standard",
        shake_90min: !!inputs.shake90Min,
        conical_installed: inputs.conicalInstalled !== false,
        undock_tau: inputs.undockTau || 1.25,
        fridge_hours: inputs.fridgeHours || 84,
      });
      if (response && response.success && response.data) {
        return {
          ...simulateFermentation(inputs),
          odeSimulation: response.data,
          isDeepODESolved: true,
        };
      }
    } catch (err) {
      console.warn("Falling back to synchronous JS biophysics engine:", err);
    }
  }
  return simulateFermentation(inputs);
}

/**
 * AI-assisted recipe optimization using the Python Pydantic engine
 */
export async function optimizeRecipeAsync(targetParams) {
  if (typeof window !== "undefined" && window.electronAPI?.optimizeRecipe) {
    const res = await window.electronAPI.optimizeRecipe(targetParams);
    if (res && res.success && res.data) {
      return res.data;
    }
    throw new Error(res?.error || "Recipe optimization failed");
  }
  throw new Error("Python recipe optimization engine is only available in Electron desktop mode");
}
