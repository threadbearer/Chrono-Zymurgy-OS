import React, { createContext, useContext, useState, useEffect } from 'react';

export const TERMINOLOGY_DICTIONARY = {
  method_name: {
    biophysics: 'Chrono-Metabolic Zymurgy (τ-Protocol)',
    human: 'Living-Rhythm Brewing (The Breath Clock)',
    bioDescription: 'Rigorous non-equilibrium biophysics modeling yeast generational kinetics and Henry-Stokes transport.',
    humanDescription: 'Brewing with the natural heartbeat of your living yeast instead of rigid calendar dates.'
  },
  tau_unit: {
    biophysics: '1.00 τ (Metabolic Horizon / 90% CO₂ Drop)',
    human: '1 Full Breath (When the Valve Hiss Quiets by 90%)',
    bioDescription: 'Biological time unit normalized to the point when fermentation gas velocity drops by 90%.',
    humanDescription: 'The moment your Pinter goes from energetic hissing to a gentle, quiet murmur.'
  },
  polish_phase: {
    biophysics: '+0.25 τ Daughter Polish Window',
    human: 'The Warm Rest & Sweetening Window',
    bioDescription: 'Post-horizon metabolic window where virgin daughter cells reabsorb diacetyl and finish secondary conditioning.',
    humanDescription: 'A gentle rest at room temp where the yeast cleans up rough edges and turns the brew silky smooth.'
  },
  cold_phase: {
    biophysics: 'Δt_phys Stokes-Henry Cold Lock',
    human: 'The Deep Chill & Bubble Lock (Fridge Hours)',
    bioDescription: 'Physical phase: Stokes law gravitational settling coupled with Henry law CO₂ dissolution at 38°F.',
    humanDescription: 'Cold days in the fridge where bitter sludge drops to the bottom and tight champagne bubbles lock in.'
  },
  axis_1: {
    biophysics: 'Suspension Architecture (Ballistic → Nectarous)',
    human: 'Sip Weight & Silk (Water-Light → Velvet Smoothie)',
    shortBio: 'Suspension Architecture',
    shortHuman: 'Sip Weight & Silk',
    bioDescription: 'Colloidal fluid density, yeast cell suspension titer, and unfermented polysaccharide scaffolding.',
    humanDescription: 'How heavy, creamy, and velvety the beer feels rolling across your tongue.'
  },
  axis_2a: {
    biophysics: 'Diacetyl Cushion (Dc)',
    human: 'Warm Butterscotch & Creamsicle Glow',
    shortBio: 'Diacetyl Cushion (Dc)',
    shortHuman: 'Butterscotch & Creamsicle',
    bioDescription: 'Vicinal diketone retention buffering ethanol burn and elevating creamy mouthfeel.',
    humanDescription: 'A comforting, creamy vanilla-butterscotch warmth that hugs your throat.'
  },
  axis_2b: {
    biophysics: 'Acetaldehyde Spark (As)',
    human: 'Fresh Green-Apple Orchard Snap',
    shortBio: 'Acetaldehyde Spark (As)',
    shortHuman: 'Green-Apple Orchard Snap',
    bioDescription: 'Ethanol reduction intermediate yielding crisp organic brightness and carbonic tension.',
    humanDescription: 'A crisp, tart bite like snapping into a freshly picked Granny Smith apple.'
  },
  axis_3a: {
    biophysics: 'Terpene Lift (TL)',
    human: 'Fruit & Forest Aroma Wave',
    shortBio: 'Terpene Lift (TL)',
    shortHuman: 'Fruit & Forest Aroma',
    bioDescription: 'Volatile monoterpene and sesquiterpene pressure containment (myrcene, humulene, linalool).',
    humanDescription: 'The explosive hit of juicy tropical fruit, citrus zest, and wild pine needles when you open the glass.'
  },
  axis_3b: {
    biophysics: 'Phenolic Trub Drag (PD)',
    human: 'Throat Scrape & Hop-Sludge Chalk',
    shortBio: 'Phenolic Trub Drag (PD)',
    shortHuman: 'Throat Scrape & Chalk',
    bioDescription: 'Astringent polyphenol tannin backwash caused by conical funnel bypass or incomplete settling.',
    humanDescription: 'That nasty, chalky hop burn in the back of your throat if you drink before the sludge drops.'
  },
  axis_4: {
    biophysics: 'Carbonic Velocity (Eruptive → Micro-Laminar)',
    human: 'Bubble Tingle (Soda-Burp → Champagne Cream)',
    shortBio: 'Carbonic Velocity',
    shortHuman: 'Bubble Tingle',
    bioDescription: 'Henry law CO₂ dissolution state, bubble nucleation radius, and dissolved gas kinetics.',
    humanDescription: 'Whether the fizz hits like sharp soda pop or melts like a soft, creamy champagne mousse.'
  },
  axis_5: {
    biophysics: 'Soma-Index (Φ) (GSH / B-Complex Buffer)',
    human: 'The Golden Fuzzy Buzz (Mellow Euphoria & Nutrition)',
    shortBio: 'Soma-Index (Φ)',
    shortHuman: 'Golden Fuzzy Buzz',
    bioDescription: 'Nutritional matrix of bioavailable G4 virgin daughter yeast, active glutathione (GSH), and B-complex vitamins.',
    humanDescription: 'The gentle, cheerful, head-to-toe warm buzz that leaves you feeling great tomorrow morning.'
  },
  // Additional UI labels
  aeration: {
    biophysics: 'Headspace Henry-Law Dissolved O₂ Transfer Protocol',
    human: 'The Vital Breath Agitation Shake',
  },
  dock: {
    biophysics: 'Dual-Chamber Conical Sedimentation Dock',
    human: 'The Yeast Trap / Brewing Dock',
  },
  conical_funnel: {
    biophysics: 'Conical Trub Separation Funnel (Hydrodynamic Barrier)',
    human: 'The Sludge Guard Funnel (Keep Trub Out)',
  },
  yeast_generations: {
    biophysics: 'Generational Dynasty (G₀ Mother Cells → G₄ Virgin Daughters)',
    human: 'The Living Yeast Family Tree (Old Mothers → Youthful Daughters)',
  },
  undock_event: {
    biophysics: 'Metabolic Undocking Operation (Dock Separation)',
    human: 'Dropping the Dock (Saying Goodbye to the Sludge)',
  },
  fridge_lock: {
    biophysics: 'Stokes Settling & Henry Carbonic Lock',
    human: 'Fridge Time (The Big Chill)',
  }
};

const TerminologyContext = createContext({
  mode: 'biophysics', // 'biophysics' | 'human'
  toggleMode: () => {},
  setMode: () => {},
  t: (key) => '',
  getTerm: (key) => ({}),
});

export function TerminologyProvider({ children }) {
  const [mode, setMode] = useState(() => {
    try {
      const saved = localStorage.getItem('chrono_zymo_mode');
      return saved === 'human' ? 'human' : 'biophysics';
    } catch {
      return 'biophysics';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('chrono_zymo_mode', mode);
    } catch (e) {
      console.warn('Could not persist terminology mode:', e);
    }
  }, [mode]);

  const toggleMode = () => {
    setMode((prev) => (prev === 'biophysics' ? 'human' : 'biophysics'));
  };

  const t = (key, format = 'label') => {
    const entry = TERMINOLOGY_DICTIONARY[key];
    if (!entry) return key;
    if (format === 'short') {
      return mode === 'biophysics' ? (entry.shortBio || entry.biophysics) : (entry.shortHuman || entry.human);
    }
    if (format === 'description') {
      return mode === 'biophysics' ? (entry.bioDescription || '') : (entry.humanDescription || '');
    }
    return mode === 'biophysics' ? entry.biophysics : entry.human;
  };

  const getTerm = (key) => TERMINOLOGY_DICTIONARY[key] || {};

  return (
    <TerminologyContext.Provider value={{ mode, setMode, toggleMode, t, getTerm }}>
      {children}
    </TerminologyContext.Provider>
  );
}

export function useTerminology() {
  return useContext(TerminologyContext);
}
