// AI Zymurgy Synthesis & Generative Recipe Engine
// Combines non-equilibrium biophysics, Tinseth IBU kinetics, Morey SRM color prediction,
// yeast generational dynamics, and the Tau-Protocol for the 5,450 mL Pinter format.

export const STYLE_DATABASE = {
  'hazy_neipa': {
    name: 'New England Hazy IPA',
    category: 'Hazy / NEIPA',
    abvRange: [6.0, 7.5],
    targetIbu: 38,
    srm: 4.8,
    dmeBaseGrams: 1050,
    maltType: '800g Extra Light DME + 250g Wheat DME',
    adjuncts: '120g Flaked Oats (steeped 15 min at 155°F) for velvety silk mouthfeel',
    hopTea: {
      grams: 18,
      variety: 'Citra & Mosaic',
      waterVolume: '1.0 L',
      steepMinutes: 10,
      temperature: 'Whirlpool 185°F / 85°C (Low Polyphenol)',
      notes: 'Sub-boil extraction limits astringent tannin drag while pulling lush mango and stonefruit bio-flavonoids.'
    },
    hopper: {
      grams: 28,
      variety: 'Galaxy & Citra Cryo Lupulin',
      method: '48h 60mL High-Proof Tincture OR 3.0 mL Quantum Terpene Essence',
      hopOilMl: 3.2,
      notes: 'Unoxidized myrcene, linalool, and geraniol payload locked under 15 PSI containment.'
    },
    yeast: {
      strain: 'Lallemand Verdant IPA',
      brand: 'Lallemand',
      grams: 7,
      cellCountBillions: 70,
      attenuation: 77,
      flocculation: 'Medium-Low (Permanent Velvety Haze)',
      optimumTemp: '68-73°F (20-23°C)'
    },
    baseTau: 68,
    somaTau: 1.15,
    crowdTau: 1.25,
    chillHours: 84,
    scores: { silk: 9.4, dc: 4.0, as: 2.2, aroma: 9.6, drag: 0.8, carb: 7.2, buzz: 9.6 },
    colorHex: '#F6C344',
    story: 'An avalanche of tropical mango, candied peach rings, and passionfruit riding on a cloud of oat-silk with a transcendent, golden fuzzy buzz.'
  },
  'west_coast_ipa': {
    name: 'Pacific Crisp West Coast IPA',
    category: 'West Coast / Pale',
    abvRange: [6.4, 7.2],
    targetIbu: 62,
    srm: 6.5,
    dmeBaseGrams: 1080,
    maltType: '950g Golden Light DME + 130g Munich DME',
    adjuncts: '60g Carapils for brilliant head retention and lacing',
    hopTea: {
      grams: 25,
      variety: 'Simcoe, Centennial & Columbus (CTZ)',
      waterVolume: '1.2 L',
      steepMinutes: 15,
      temperature: 'Simmer 200°F / 93°C',
      notes: 'Sharp alpha-acid isomerization yielding clean resinous pine and assertive grapefruit pith bite.'
    },
    hopper: {
      grams: 25,
      variety: 'Amarillo & Cascade',
      method: '48h 60mL Tincture OR 2.5 mL Terpene Essence',
      hopOilMl: 2.8,
      notes: 'Crisp damp pine needles, floral blossom, and orange zest.'
    },
    yeast: {
      strain: 'SafAle US-05',
      brand: 'Fermentis',
      grams: 8,
      cellCountBillions: 80,
      attenuation: 81,
      flocculation: 'Medium (Bright Clarity)',
      optimumTemp: '65-70°F (18-21°C)'
    },
    baseTau: 64,
    somaTau: 1.20,
    crowdTau: 1.35,
    chillHours: 96,
    scores: { silk: 6.2, dc: 1.5, as: 1.8, aroma: 8.8, drag: 1.4, carb: 8.4, buzz: 8.6 },
    colorHex: '#E59B28',
    story: 'Assertive, clean, and crystal-bright with a spine of dank spruce pine, grapefruit oil, and an appetizingly bone-dry finish.'
  },
  'german_helles': {
    name: 'Bavarian Monastic Helles',
    category: 'Lagers',
    abvRange: [4.8, 5.3],
    targetIbu: 18,
    srm: 3.5,
    dmeBaseGrams: 850,
    maltType: '800g Extra Light Pilsner DME + 50g Carafoam',
    adjuncts: 'None (Pure Reinheitsgebot profile with soft spring water profile)',
    hopTea: {
      grams: 14,
      variety: 'Hallertau Mittelfrüh & Tettnang',
      waterVolume: '1.0 L',
      steepMinutes: 12,
      temperature: 'Simmer 190°F / 88°C',
      notes: 'Subtle noble floral spicy bouquet with zero harshness.'
    },
    hopper: {
      grams: 10,
      variety: 'Hallertau Tradition',
      method: 'Light 24h Noble Botanical Infusion',
      hopOilMl: 1.2,
      notes: 'Delicate herbal meadow blossoms and honeyed cracker notes.'
    },
    yeast: {
      strain: 'Saflager W-34/70',
      brand: 'Fermentis',
      grams: 11,
      cellCountBillions: 110,
      attenuation: 83,
      flocculation: 'High (Brilliant Diamond Polishing)',
      optimumTemp: '62-68°F (17-20°C) Under 15 PSI'
    },
    baseTau: 88,
    somaTau: 1.25,
    crowdTau: 1.40,
    chillHours: 168,
    scores: { silk: 7.8, dc: 1.0, as: 1.2, aroma: 6.5, drag: 0.5, carb: 8.8, buzz: 8.0 },
    colorHex: '#F9DF6D',
    story: 'Freshly baked water crackers and wildflower honey. Ultra-crisp, refreshing, and clean with pure noble hop grace.'
  },
  'imperial_stout': {
    name: 'Velvet Abyss Cacao Imperial Stout',
    category: 'Stouts',
    abvRange: [7.5, 9.2],
    targetIbu: 48,
    srm: 38.0,
    dmeBaseGrams: 1350,
    maltType: '900g Dark DME + 300g Light DME',
    adjuncts: '120g Roasted Barley + 80g Chocolate Malt (steeped 20 min at 160°F) + 20g Cocoa Nibs',
    hopTea: {
      grams: 22,
      variety: 'Northern Brewer & East Kent Goldings',
      waterVolume: '1.2 L',
      steepMinutes: 15,
      temperature: 'Simmer 200°F / 93°C',
      notes: 'Earthy wood smoke and dark molasses bitterness balancing high malt gravity.'
    },
    hopper: {
      grams: 15,
      variety: 'Willamette / Madagascar Vanilla Bean Tincture',
      method: '48h 60mL Bourbon & Vanilla Pod Infusion',
      hopOilMl: 2.0,
      notes: 'Decadent dark baker chocolate, toasted espresso, and smooth charred oak.'
    },
    yeast: {
      strain: 'SafAle S-04',
      brand: 'Fermentis',
      grams: 11,
      cellCountBillions: 110,
      attenuation: 75,
      flocculation: 'High (Dense Velvet Scaffolding)',
      optimumTemp: '66-72°F (19-22°C)'
    },
    baseTau: 92,
    somaTau: 1.20,
    crowdTau: 1.35,
    chillHours: 120,
    scores: { silk: 9.8, dc: 5.2, as: 1.5, aroma: 8.5, drag: 1.1, carb: 5.8, buzz: 9.7 },
    colorHex: '#1C1008',
    story: 'Dark as midnight in Munich. Thick melted baker chocolate, espresso crema, and dark fruit with an immense, coating velvet finish.'
  },
  'philly_sour': {
    name: 'Sunstone Passionfruit Lactic Gose',
    category: 'Sours / Ciders',
    abvRange: [4.6, 5.2],
    targetIbu: 8,
    srm: 3.2,
    dmeBaseGrams: 820,
    maltType: '500g Extra Light DME + 320g Wheat DME',
    adjuncts: '1.5g Himalayan Pink Sea Salt (steeped in final wort) + 150g Natural Passionfruit Puree',
    hopTea: {
      grams: 8,
      variety: 'Saaz',
      waterVolume: '0.8 L',
      steepMinutes: 8,
      temperature: 'Steep 180°F / 82°C',
      notes: 'Extremely delicate hop tea; high IBU inhibits lactic acid generation.'
    },
    hopper: {
      grams: 14,
      variety: 'El Dorado & Citra Cold Terpenes',
      method: 'Aroma-only cryogenic extract post-acidification',
      hopOilMl: 1.8,
      notes: 'Tropical candied melon, ripe passionfruit, and tart lemon peel zest.'
    },
    yeast: {
      strain: 'Lallemand Philly Sour',
      brand: 'Lallemand',
      grams: 11,
      cellCountBillions: 110,
      attenuation: 78,
      flocculation: 'Medium-High',
      optimumTemp: '68-75°F (20-24°C)'
    },
    baseTau: 76,
    somaTau: 1.18,
    crowdTau: 1.30,
    chillHours: 72,
    scores: { silk: 7.2, dc: 1.2, as: 4.8, aroma: 9.2, drag: 0.6, carb: 8.6, buzz: 8.8 },
    colorHex: '#FCE076',
    story: 'Electric, mouthwatering refreshment. Natural biological lactic acid synthesis paired with tropical passionfruit and a mineral sea-salt pop.'
  },
  'belgian_tripel': {
    name: 'Apostle Golden Monastic Tripel',
    category: 'Pale',
    abvRange: [8.2, 9.4],
    targetIbu: 30,
    srm: 5.2,
    dmeBaseGrams: 1250,
    maltType: '1050g Extra Light Pilsner DME + 200g Belgian Candi Sugar (Clear)',
    adjuncts: '2g Sweet Orange Peel + 1g Crushed Coriander in whirlpool',
    hopTea: {
      grams: 20,
      variety: 'Styrian Goldings & Saaz',
      waterVolume: '1.0 L',
      steepMinutes: 15,
      temperature: 'Simmer 195°F / 90°C',
      notes: 'Earthy spice and peppery phenolic backbone.'
    },
    hopper: {
      grams: 12,
      variety: 'Saaz & Hallertau Blanc',
      method: 'Botanical aromatic tincture',
      hopOilMl: 1.6,
      notes: 'White grape, pear ester, and clove blossom.'
    },
    yeast: {
      strain: 'SafBrew BE-256 (Abbey)',
      brand: 'Fermentis',
      grams: 9,
      cellCountBillions: 90,
      attenuation: 85,
      flocculation: 'High (Ester Polish)',
      optimumTemp: '70-78°F (21-25°C)'
    },
    baseTau: 80,
    somaTau: 1.22,
    crowdTau: 1.38,
    chillHours: 120,
    scores: { silk: 8.5, dc: 2.8, as: 2.0, aroma: 8.9, drag: 0.9, carb: 9.4, buzz: 9.8 },
    colorHex: '#ECC039',
    story: 'Spicy clove, ripe Bosc pear, and candied orange peel hiding deceptive imperial strength beneath ethereal champagne bubbles.'
  }
};

/**
 * SRM to HEX Color approximation for photorealistic beer preview
 */
export function srmToHex(srm) {
  if (srm <= 2) return '#F8F753';
  if (srm <= 3) return '#F6F513';
  if (srm <= 4) return '#ECE61A';
  if (srm <= 6) return '#D5BC26';
  if (srm <= 8) return '#BF923B';
  if (srm <= 10) return '#BF813A';
  if (srm <= 13) return '#BC6733';
  if (srm <= 17) return '#8D4C32';
  if (srm <= 20) return '#5D341A';
  if (srm <= 24) return '#4E271C';
  if (srm <= 29) return '#3A1F16';
  if (srm <= 35) return '#261716';
  return '#120D0C'; // 36+ Imperial Black
}

/**
 * Helper to compute SRM, IBU, and Gravity from custom inputs
 */
export function computeBiophysicsMetrics({ dmeGrams, hopTeaGrams, steepMins, attenuation = 78, srmBase = 5 }) {
  const liquidVolL = 5.45; // 5,450 mL standard fill
  // DME extraction: ~1.045 points per pound per gallon -> 0.045 SG per g/L * 8.34
  const gravityPoints = (dmeGrams / liquidVolL) * 0.285;
  const og = 1 + gravityPoints / 1000;
  const fg = 1 + (gravityPoints * (1 - attenuation / 100)) / 1000;
  const abv = Number(((og - fg) * 131.25).toFixed(1));

  // Tinseth IBU approximation
  const bFactor = 1.65 * Math.pow(0.000125, og - 1);
  const tFactor = (1 - Math.exp(-0.04 * steepMins)) / 4.15;
  const utilization = bFactor * tFactor;
  const avgAlpha = 0.12; // 12% AA average modern craft hop
  const ibu = Math.round(((hopTeaGrams * avgAlpha * utilization * 1000) / liquidVolL) * 1.8);

  const calories = Math.round(1884 * (og - 1) + 3550 * (fg - 1) + abv * 22);

  return {
    og: Number(og.toFixed(3)),
    fg: Number(fg.toFixed(3)),
    abv: Math.max(3.0, Math.min(12.0, abv)),
    ibu: Math.max(5, Math.min(110, ibu)),
    srm: srmBase,
    calories: Math.max(120, calories)
  };
}

/**
 * Generative AI Recipe Architect
 * Synthesizes a completely custom, biophysically balanced recipe from user prompts & preference vectors
 */
export function generateCustomBeer({
  prompt = '',
  preferredCategory = 'Hazy / NEIPA',
  targetAbv = 6.0,
  targetIbu = 35,
  mouthfeelSilk = 8.5,
  aromaIntensity = 9.0,
  srmPreference = 5.0,
}) {
  const p = prompt.toLowerCase();

  // 1. Detect Style archetype from prompt or preference
  let archetype = 'hazy_neipa';
  if (p.includes('lager') || p.includes('pils') || p.includes('helles') || p.includes('clean') || p.includes('crisp')) {
    archetype = 'german_helles';
  } else if (p.includes('stout') || p.includes('dark') || p.includes('porter') || p.includes('roast') || p.includes('chocolate') || p.includes('coffee')) {
    archetype = 'imperial_stout';
  } else if (p.includes('west coast') || p.includes('pine') || p.includes('bitter') || p.includes('resin') || p.includes('clear') || p.includes('grapefruit')) {
    archetype = 'west_coast_ipa';
  } else if (p.includes('sour') || p.includes('tart') || p.includes('philly') || p.includes('lactic') || p.includes('gose') || p.includes('fruit')) {
    archetype = 'philly_sour';
  } else if (p.includes('belgian') || p.includes('tripel') || p.includes('dubbel') || p.includes('monk') || p.includes('abbey') || p.includes('spicy')) {
    archetype = 'belgian_tripel';
  } else if (preferredCategory.includes('Lager')) {
    archetype = 'german_helles';
  } else if (preferredCategory.includes('Stout')) {
    archetype = 'imperial_stout';
  } else if (preferredCategory.includes('West Coast') || preferredCategory.includes('Pale')) {
    archetype = 'west_coast_ipa';
  } else if (preferredCategory.includes('Sour')) {
    archetype = 'philly_sour';
  }

  const baseTemplate = STYLE_DATABASE[archetype];

  // 2. Adjust DME malt mass based on target ABV
  // Nominal: 1000g DME gives ~5.8% ABV in 5.45 L
  const dmeGrams = Math.round((targetAbv / 5.8) * 1000);
  const dmeOunces = Number((dmeGrams / 28.3495).toFixed(1));
  const lmeGrams = Math.round(dmeGrams * 1.22);
  const lmeOunces = Number((lmeGrams / 28.3495).toFixed(1));

  // 3. Adjust Hop Mass for Target IBU
  const hopTeaGrams = Math.max(8, Math.min(35, Math.round((targetIbu / baseTemplate.targetIbu) * baseTemplate.hopTea.grams)));
  const hopperGrams = Math.max(10, Math.min(35, Math.round((aromaIntensity / 10) * 26)));

  // 4. Generate dynamic name and bio
  let generatedName = baseTemplate.name;
  let subtitle = `AI Synthesized ${baseTemplate.category} for 15 PSI Containment`;

  if (p.trim().length > 3) {
    // Generate custom creative name from keywords
    const keywords = prompt.replace(/[^\w\s]/gi, '').split(' ').filter(w => w.length > 2);
    if (keywords.length > 0) {
      const cap = (w) => w.charAt(0).toUpperCase() + w.slice(1);
      const k1 = cap(keywords[0]);
      const k2 = keywords[1] ? cap(keywords[1]) : 'Aura';
      generatedName = `${k1} ${k2} ${baseTemplate.name.split(' ').slice(-1)[0]}`;
      subtitle = `Custom Generative Formulation // ${targetAbv}% ABV • ${targetIbu} IBU • 5,450 mL`;
    }
  }

  // 5. Compute biophysical radar profile
  const scores = {
    silk: Number(Math.min(9.9, Math.max(4.0, mouthfeelSilk)).toFixed(1)),
    dc: baseTemplate.scores.dc,
    as: baseTemplate.scores.as,
    aroma: Number(Math.min(9.9, Math.max(4.0, aromaIntensity)).toFixed(1)),
    drag: baseTemplate.scores.drag,
    carb: Number((7.0 + (targetIbu > 40 ? 1.0 : 0.4)).toFixed(1)),
    buzz: Number(Math.min(9.9, Math.max(6.0, 7.5 + (targetAbv - 5.0) * 0.5 + (mouthfeelSilk > 8 ? 0.8 : 0))).toFixed(1))
  };

  const calculated = computeBiophysicsMetrics({
    dmeGrams,
    hopTeaGrams,
    steepMins: baseTemplate.hopTea.steepMinutes,
    attenuation: baseTemplate.yeast.attenuation,
    srmBase: srmPreference || baseTemplate.srm
  });

  const costDiy = Number((6.5 + (dmeGrams / 1000) * 4.2 + (hopTeaGrams + hopperGrams) * 0.12).toFixed(2));
  const retailPrice = Number((costDiy * 3.4).toFixed(2));

  return {
    id: `ai-gen-${Date.now()}`,
    name: generatedName,
    subtitle,
    style: baseTemplate.name,
    category: baseTemplate.category,
    isCustom: true,
    isAiGenerated: true,
    abv: targetAbv,
    ibu: targetIbu,
    srm: calculated.srm,
    calories: calculated.calories,
    colorHex: srmToHex(calculated.srm),
    baseTau: baseTemplate.baseTau,
    somaTau: baseTemplate.somaTau,
    crowdTau: baseTemplate.crowdTau,
    defaultUndockTau: baseTemplate.somaTau,
    chillHours: baseTemplate.chillHours,
    retailPrice,
    diyCost: costDiy,
    maltBase: {
      dmeGrams,
      dmeOunces,
      lmeGrams,
      lmeOunces,
      maltType: baseTemplate.maltType,
      adjuncts: baseTemplate.adjuncts
    },
    hopTea: {
      ...baseTemplate.hopTea,
      grams: hopTeaGrams
    },
    hopper: {
      ...baseTemplate.hopper,
      grams: hopperGrams
    },
    yeast: {
      ...baseTemplate.yeast
    },
    scores,
    bioDescription: `Calculated ODE trajectory for 5,450 mL liquid with ${dmeGrams}g reconstituted extract. Expected peak primary at ${(baseTemplate.baseTau * 0.4).toFixed(0)}h, reaching 1.00τ horizon at ~${baseTemplate.baseTau}h. 15 PSI containment locks ${scores.aroma}/10 terpene volatiles with Stokes trub drag reduced to ${scores.drag}/10 via conical funnel.`,
    humanDescription: baseTemplate.story,
    sourcePrompt: prompt
  };
}

/**
 * 7 Interactive Phases for the AI Step-by-Step Brew Guide
 */
export const BREW_GUIDE_STAGES = [
  {
    stage: 1,
    title: 'Cleanliness & Reactor Preparation',
    shortTitle: 'Sanitation',
    duration: '15 min',
    icon: 'ShieldCheck',
    biophysicsWhy: 'Non-equilibrium biophysics requires establishing biological supremacy for the selected yeast strain. Sterilization reduces competing wild microflora from 10^5 CFU to <10 CFU, ensuring 100% nutrient allocation to G0 mother cells.',
    steps: [
      { id: 's1_1', label: 'Rinse Pinter vessel, conical dock, and tap assembly with hot water.' },
      { id: 's1_2', label: 'Inspect the Conical Trub Funnel — verify silicone gasket is seated evenly in the neck.' },
      { id: 's1_3', label: 'Spray 70% Isopropyl Alcohol or Star San on all internal surfaces and contact points.' },
      { id: 's1_4', label: 'Lock conical dock firmly onto vessel base until tactile clicks engage.' }
    ],
    troubleshootTips: [
      { q: 'Is chlorine tap water safe?', a: 'High chlorine can form chlorophenols (plastic/band-aid taste). Use charcoal-filtered or bottled spring water for pristine results.' },
      { q: 'What happens if the conical funnel is forgotten?', a: 'Stokes settling is compromised! Without the funnel, 75% of bitter mother trub will wash back into your beer at undocking, causing harsh throat burn.' }
    ]
  },
  {
    stage: 2,
    title: 'Wort Synthesis & Low-Polyphenol Hop Tea',
    shortTitle: 'Wort & Hop Tea',
    duration: '25 min',
    icon: 'Flame',
    biophysicsWhy: 'Boiling hops above 205°F extracts harsh astringent plant polyphenols. CHRONO-ZYMURGY OS uses a sub-boil whirlpool steep (185-195°F) to isomerize alpha-acids cleanly while keeping phenolic trub drag under 1.0.',
    steps: [
      { id: 's2_1', label: 'Heat 1.0 Litre of water to 190°F (88°C) — remove from direct flame.' },
      { id: 's2_2', label: 'Add Hop Tea pellets; steep for 10 minutes gently swirling occasionally.' },
      { id: 's2_3', label: 'In Pinter vessel, add 1.5 Litres of cold water first (prevents extract scorching at base).' },
      { id: 's2_4', label: 'Pour in Dry Malt Extract (DME) slowly while swirling vessel to eliminate clumping.' },
      { id: 's2_5', label: 'Strain hop tea liquid into vessel; top off with cold water to exact 5,450 mL fill line.' }
    ],
    troubleshootTips: [
      { q: 'Why is the 5,450 mL fill line critical?', a: 'Filling below 5,450 mL leaves too much headspace O2 and dilutes gravity; filling above 5,450 mL reduces krausen ceiling, risking valve blowout at 15 PSI.' },
      { q: 'Can I use Liquid Malt Extract (LME)?', a: 'Yes! Multiply the DME grams by 1.22 to account for water content in syrup extract.' }
    ]
  },
  {
    stage: 3,
    title: 'Henry-Law Agitation & Yeast Pitch',
    shortTitle: 'Aeration & Pitch',
    duration: '5 min',
    icon: 'Wind',
    biophysicsWhy: "Henry's Law states dissolved gas is proportional to partial pressure. A vigorous 2-minute figure-8 shake transfers 80+ mg of O2 from the 1,200 mL headspace air pocket into the wort, powering 4.0+ yeast replicative generations (Gn).",
    steps: [
      { id: 's3_1', label: 'Seal Pinter with solid cap and shake vigorously for 2 full minutes (dual-vector agitation).' },
      { id: 's3_2', label: 'Verify wort temperature is between 68°F and 74°F (never pitch into warm wort >80°F).' },
      { id: 's3_3', label: 'Cut open yeast packet and sprinkle evenly across the aerated foam surface.' },
      { id: 's3_4', label: 'Tighten 15 PSI pressure relief valve cap firmly. Dock is now pressurized.' }
    ],
    troubleshootTips: [
      { q: 'What is the 90-Minute Post-Pitch Swirl?', a: 'Swirling the vessel 90 minutes after pitching redistributes settling yeast right as cell bud emergence begins, increasing active daughter generation count by 14%!' },
      { q: 'My room is 76°F, is that too warm?', a: 'Verdant and Kveik yeast thrive at 76°F; for clean lagers (W-34/70), aim for 64-68°F under pressure to prevent solvent esters.' }
    ]
  },
  {
    stage: 4,
    title: 'Primary Fermentation & The 1.00τ Horizon',
    shortTitle: '1.00τ Horizon',
    duration: '3 - 5 days',
    icon: 'Clock',
    biophysicsWhy: 'Do not follow calendar dogma! In CHRONO-ZYMURGY OS, 1.00τ occurs when acoustic valve hiss velocity drops by 90% from peak vigor. This marks the transition from active sugar consumption to diacetyl reabsorption.',
    steps: [
      { id: 's4_1', label: 'Place Pinter in a dark, temperature-stable location (68-72°F optimal).' },
      { id: 's4_2', label: 'Listen for pneumatic hiss at 24-48 hours (indicates healthy 15 PSI equilibrium).' },
      { id: 's4_3', label: 'At ~68 hours, observe the acoustic drop: when hiss slows from steady to faint, log 1.00τ.' },
      { id: 's4_4', label: 'Allow 0.15 to 0.25τ Polish Window: let live G4 daughters reabsorb butterscotch diacetyl at room temp.' }
    ],
    troubleshootTips: [
      { q: 'Why did the hiss stop after 36 hours?', a: 'Warm ambient temps accelerate yeast metabolism. If gravity has dropped to ~1.012, your primary fermentation reached 1.00τ rapidly.' },
      { q: 'Why must I wait for the +0.25τ Polish Window?', a: 'Daughter cells need 12-24 hours after sugar depletion to clean up vicinal diketones (diacetyl) and green-apple acetaldehyde before cold crashing.' }
    ]
  },
  {
    stage: 5,
    title: 'Conical Dock Undocking Operation',
    shortTitle: 'Undocking Trub',
    duration: '10 min',
    icon: 'Layers',
    biophysicsWhy: "The conical funnel separates 92% of dense, scarred G0 mother cells and hop sediment into the dock. Detaching the dock eliminates heavy polyphenols while keeping buoyant   G4 daughters suspended in the upper beer chamber.",
    steps: [
      { id: 's5_1', label: 'Verify +0.15τ to +0.25τ elapsed since the acoustic horizon.' },
      { id: 's5_2', label: 'Rotate the undock release collar clockwise until the safety lock clicks.' },
      { id: 's5_3', label: 'Pull the conical dock straight downward — vessel valve self-seals cleanly.' },
      { id: 's5_4', label: 'Install the flat transport/docking base plate onto the bottom of the vessel.' }
    ],
    troubleshootTips: [
      { q: 'Is any beer lost during undocking?', a: 'Only ~250 mL of dense sediment/yeast paste in the trap is removed; 5,200 mL of pristine liquid remains sealed inside under pressure.' }
    ]
  },
  {
    stage: 6,
    title: 'Stokes Cold Lock & Carbonic Dissolution',
    shortTitle: 'Cold Conditioning',
    duration: '3.5 - 7 days',
    icon: 'Snowflake',
    biophysicsWhy: "Lowering temperature to 38°F increases liquid CO2 solubility under Henry's Law while Stokes' hydrodynamics causes remaining haze trub to drop out. This locks in dense micro-laminar champagne carbonation mousse.",
    steps: [
      { id: 's6_1', label: 'Transfer undocked Pinter directly into refrigerator set to 36°F - 39°F (2°C - 4°C).' },
      { id: 's6_2', label: 'Allow minimum 84 hours (3.5 days) for ales, or 168 hours (7 days) for crisp lagers.' },
      { id: 's6_3', label: 'Do not agitate or shake vessel during cold lock — let gravity Stokes settling work undisturbed.' }
    ],
    troubleshootTips: [
      { q: 'Can I tap after 24 hours in the fridge?', a: 'Tapping at 24h results in coarse, burpy carbonation and suspended mother trub. 84 hours is required for tight champagne bubble dissolution!' }
    ]
  },
  {
    stage: 7,
    title: 'The Perfect Pour & Sensory Evaluation',
    shortTitle: 'Tapping & Sensory',
    duration: 'Indefinite',
    icon: 'Sparkles',
    biophysicsWhy: 'Your beer is alive! A 15 PSI micro-laminar pour at 45° preserves the volatile terpene bouquet, creates an ultra-creamy 2-finger mousse head, and delivers bioavailable glutathione and B-complex vitamins.',
    steps: [
      { id: 's7_1', label: 'Position clean pint glass at 45° angle directly under tap nozzle.' },
      { id: 's7_2', label: 'Pull tap handle forward decisively — allow laminar stream to roll down glass wall.' },
      { id: 's7_3', label: 'Straighten glass for final 1 inch to build a dense, velvety white foam head.' },
      { id: 's7_4', label: 'Inhale deeply to evaluate Terpene Lift (TL); take first sip to evaluate Silk (Axis 1).' }
    ],
    troubleshootTips: [
      { q: 'First pour is a bit cloudy?', a: 'Normal! The first 2 ounces clears the dip tube. Subsequent pours will be velvety and luminous.' }
    ]
  }
];

/**
 * Intelligent Q&A Knowledge Base for real-time brewing assistance
 */
export function answerBrewQuestion(query) {
  const q = query.toLowerCase();

  if (q.includes('hiss') || q.includes('sound') || q.includes('noise') || q.includes('valve') || q.includes('quiet')) {
    return {
      title: 'Acoustic Valve Kinetics & The 1.00τ Horizon',
      answer: "The 15 PSI pneumatic relief valve is your biological heartbeat sensor. During peak fermentation (0.3τ - 0.7τ), yeast produces CO2 at maximum velocity, causing frequent or continuous hissing. When the hissing frequency drops by ~90%, you have reached the 1.00τ Metabolic Horizon. Do not undock immediately! Allow a 12-24 hour Polish Window (+0.15τ) at room temperature so live daughter cells can clean up diacetyl before cold crashing."
    };
  }

  if (q.includes('temp') || q.includes('warm') || q.includes('cold') || q.includes('heat') || q.includes('degree')) {
    return {
      title: 'Arrhenius Temperature Dynamics',
      answer: "Temperature alters metabolic rates exponentially. At 76°F, primary fermentation occurs ~30% faster than at 68°F. However, higher temps increase fusel alcohol risk. Under 15 PSI pressure containment, ester formation is suppressed by ~40%, allowing clean, safe fermentation even at warmer room temperatures (70-74°F). For crisp German lagers with W-34/70, keep ambient temperature near 64-68°F."
    };
  }

  if (q.includes('funnel') || q.includes('conical') || q.includes('trub') || q.includes('dock') || q.includes('sediment')) {
    return {
      title: 'Conical Funnel Hydrodynamics & Stokes Settling',
      answer: "The patented Conical Funnel creates a one-way hydrodynamic settling valve. Dense, scarred G0 mother cells and hop trub possess higher Stokes settling velocity, sliding down the funnel into the lower dock. Without this funnel, 75% of bitter trub resuspends into the liquid at undocking, causing harsh polyphenol throat scratch (Phenolic Drag score > 6.0)."
    };
  }

  if (q.includes('silk') || q.includes('mouthfeel') || q.includes('oat') || q.includes('body') || q.includes('smooth')) {
    return {
      title: 'Suspension Architecture & Silk Synthesis',
      answer: "Velvety beer mouthfeel is driven by colloidal protein-polyphenol complexes and suspended G4   daughter yeast cells (20-30 billion cells/pint). Adding 100-120g of flaked oats (beta-glucans) to your steep along with Lallemand Verdant IPA yeast provides the structural scaffold that gives Hazy Tau its signature nectarous velvet texture."
    };
  }

  if (q.includes('cost') || q.includes('save') || q.includes('price') || q.includes('cheap') || q.includes('diy')) {
    return {
      title: 'DIY Decommercialization Economics',
      answer: "Commercial proprietary brewing kits retail for $38 - $46 each. By purchasing bulk Dry Malt Extract (DME), commercial hop pellets (Citra, Mosaic, Galaxy), and standard brewing yeast (Lallemand, Fermentis), an identical or superior 5,450 mL batch costs just $10.50 - $12.50 to brew — saving you over 70% per batch ($30+ savings every time)!"
    };
  }

  if (q.includes('o2') || q.includes('oxygen') || q.includes('shake') || q.includes('aerate')) {
    return {
      title: "Henry's Law Headspace Oxygen Transfer",
      answer: "Yeast needs dissolved oxygen to synthesize ergosterol and unsaturated fatty acids for daughter cell membrane elasticity. With 1,200 mL of atmospheric headspace air pocket in the Pinter, shaking vigorously for 2 full minutes dissolves ~80-100 mg of pure O2 directly into the wort. This enables 4.0+ healthy replicative generations (Gn), ensuring rich flavor synthesis without yeast stalling."
    };
  }

  return {
    title: 'Zymurgy Biophysics AI Recommendation',
    answer: "For optimal results in the 5,450 mL Pinter format: Always ensure the conical trub funnel is seated with its gasket, fill exactly to the 5,450 mL fill line, shake vigorously for 2 full minutes post-pitch to dissolve headspace O2, and monitor the pneumatic valve acoustic hiss for the 1.00τ horizon before undocking. Cold crash at 38°F for 84+ hours to achieve micro-laminar champagne carbonation."
  };
}
