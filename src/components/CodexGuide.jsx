import React, { useState } from 'react';
import { useTerminology } from '../context/TerminologyContext';
import { BookOpen, ShieldCheck, Flame, Scale, Zap, Search, Info, Check } from 'lucide-react';

export default function CodexGuide() {
  const { mode, t } = useTerminology();
  const [searchTerm, setSearchTerm] = useState('');

  const LEXICON_ENTRIES = [
    {
      parameter: 'Primary Methodology',
      biophysics: 'Chrono-Metabolic Zymurgy (τ-Protocol)',
      human: 'Living-Rhythm Brewing (The Breath Clock)',
      desc: 'Normalized biological time scaling versus rigid calendar date dogma.'
    },
    {
      parameter: '1.00 τ Unit',
      biophysics: '1.00 τ (Metabolic Horizon / 90% CO₂ Drop)',
      human: '1 Full Breath (When the Valve Hiss Quiets by 90%)',
      desc: 'Point when gas emission velocity plummets by 90% from peak primary.'
    },
    {
      parameter: 'Polish Rest Window',
      biophysics: '+0.25 τ Daughter Polish Window',
      human: 'The Warm Rest & Sweetening Window',
      desc: 'Window where live G4 daughters reabsorb vicinal diketones and clean acetaldehyde.'
    },
    {
      parameter: 'Cold Conditioning',
      biophysics: 'Δt_phys Stokes-Henry Cold Lock (38°F)',
      human: 'The Deep Chill & Bubble Lock (Fridge Hours)',
      desc: 'Viscous Stoke settling of mother cells combined with Henry CO2 dissolution.'
    },
    {
      parameter: 'Axis 1 (Mouthfeel)',
      biophysics: 'Suspension Architecture (Ballistic → Nectarous)',
      human: 'Sip Weight & Silk (Water-Light → Velvet Smoothie)',
      desc: 'Colloidal fluid density, yeast titer, and unfermented polysaccharide scaffolding.'
    },
    {
      parameter: 'Axis 2a (Diacetyl)',
      biophysics: 'Diacetyl Cushion (Dc)',
      human: 'Warm Butterscotch & Creamsicle Glow',
      desc: 'Vicinal diketone retention buffering ethanol burn and elevating creamy mouthfeel.'
    },
    {
      parameter: 'Axis 2b (Acetaldehyde)',
      biophysics: 'Acetaldehyde Spark (As)',
      human: 'Fresh Green-Apple Orchard Snap',
      desc: 'Ethanol reduction intermediate yielding crisp organic brightness.'
    },
    {
      parameter: 'Axis 3a (Hop Aromatics)',
      biophysics: 'Terpene Lift (TL)',
      human: 'Fruit & Forest Aroma Wave',
      desc: 'Volatile monoterpenes and sesquiterpenes locked under 15 PSI pressure.'
    },
    {
      parameter: 'Axis 3b (Tannins/Trub)',
      biophysics: 'Phenolic Trub Drag (PD)',
      human: 'Throat Scrape & Hop-Sludge Chalk',
      desc: 'Astringent polyphenol tannin backwash caused by funnel omission or incomplete settling.'
    },
    {
      parameter: 'Axis 4 (Carbonation)',
      biophysics: 'Carbonic Velocity (Eruptive → Micro-Laminar)',
      human: 'Bubble Tingle (Soda-Burp → Champagne Cream)',
      desc: 'Henry law dissolved state, bubble nucleation radius, and carbonic mousse.'
    },
    {
      parameter: 'Axis 5 (Nutrition)',
      biophysics: 'Soma-Index (Φ) (GSH / B-Complex Buffer)',
      human: 'The Golden Fuzzy Buzz (Mellow Euphoria & Nutrition)',
      desc: 'Nutritional matrix of bioavailable G4 yeast, active GSH, and B-complex vitamins.'
    }
  ];

  const filteredEntries = LEXICON_ENTRIES.filter(entry => 
    !searchTerm ||
    entry.parameter.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.biophysics.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.human.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.desc.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-5 max-w-5xl mx-auto">
      {/* Banner */}
      <div className="hw-panel p-5 relative overflow-hidden">
        <div className="flex items-center space-x-2 text-cyan-400 text-xs font-mono-tabular mb-1">
          <BookOpen className="w-4 h-4 text-cyan-400" />
          <span className="uppercase tracking-widest font-semibold">CHRONO-ZYMURGY OS // SCIENTIFIC COMPENDIUM &amp; LEXICON</span>
        </div>
        <h2 className="text-2xl font-bold font-display text-white tracking-tight">
          The &tau;-Protocol Codex: Biophysics &amp; Living-Rhythm Brewing
        </h2>
        <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed font-sans">
          Unmasking proprietary commercial brewing kits and transcending 19th-century British brewing dogma with non-equilibrium thermodynamics, Henry&apos;s law gas transport, and yeast dynasty kinetics.
        </p>
      </div>

      {/* Rosetta Stone Terminology Matrix */}
      <div className="hw-panel p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
          <div>
            <h3 className="font-display text-base font-bold text-white flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#00F0FF]"></span>
              <span>The Dual-Mode Lexicon Rosetta Stone</span>
            </h3>
            <p className="text-xs text-slate-400 font-mono-tabular mt-0.5">
              Live translation table between Mode A (Biophysics Lab) and Mode B (Human Experience).
            </p>
          </div>

          {/* Search Filter Prompt */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="SEARCH_LEXICON..."
              className="w-full pl-8 pr-3 py-1.5 rounded hw-well border border-white/10 text-white text-xs font-mono-tabular focus:border-cyan-400 outline-none"
            />
          </div>
        </div>

        <div className="overflow-x-auto hw-well rounded-lg border border-white/5">
          <table className="w-full text-xs font-mono-tabular border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-[#0B0E14] text-slate-400">
                <th className="text-left py-2.5 px-3.5 font-bold uppercase text-[10px]">Parameter / Concept</th>
                <th className="text-left py-2.5 px-3.5 text-cyan-300 font-bold uppercase text-[10px]">Mode A: Biophysics (SKL / &tau;)</th>
                <th className="text-left py-2.5 px-3.5 text-amber-300 font-bold uppercase text-[10px]">Mode B: Human Experience</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredEntries.map((row, idx) => (
                <tr key={idx} className="hover:bg-white/5 transition">
                  <td className="py-2.5 px-3.5 text-slate-200 font-bold">
                    <span>{row.parameter}</span>
                    <span className="text-[10px] text-slate-500 block font-normal">{row.desc}</span>
                  </td>
                  <td className="py-2.5 px-3.5 text-cyan-300 font-medium">
                    {row.biophysics}
                  </td>
                  <td className="py-2.5 px-3.5 text-amber-300 font-medium">
                    {row.human}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4 Core Mathematical Laws */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs font-mono-tabular">
        {/* Law 1: Henry's Law */}
        <div className="hw-panel p-5 space-y-3">
          <div className="flex items-center space-x-2 text-cyan-400 font-bold">
            <Zap className="w-4 h-4 text-cyan-400" />
            <span>1. Henry&apos;s Law Headspace Gas Transport</span>
          </div>
          <p className="text-slate-300 leading-relaxed font-sans text-xs">
            A standard docked Pinter contains 5,450 mL of liquid wort and a 1,200 mL air pocket (750 mL in main vessel + 450 mL in dock). Ambient air contains 20.95% oxygen, providing an initial reservoir of ~330 mg O₂ in the headspace.
          </p>
          <div className="hw-well p-3 rounded text-[11px] text-cyan-300 border border-cyan-500/20">
            <code>C = k_H &times; P_gas &bull; dm/dt = k_L a &times; (C* - C)</code>
          </div>
          <p className="text-slate-400 leading-relaxed font-sans text-xs">
            By executing a 2-minute agitation shake followed by a 90-minute post-pitch figure-eight swirl, the brewer accelerates dissolved O₂ into the wort before active yeast replication purges the headspace with CO₂.
          </p>
        </div>

        {/* Law 2: Stokes' Law Settling */}
        <div className="hw-panel p-5 space-y-3">
          <div className="flex items-center space-x-2 text-blue-400 font-bold">
            <Scale className="w-4 h-4 text-blue-400" />
            <span>2. Stokes&apos; Hydrodynamic Settling</span>
          </div>
          <p className="text-slate-300 leading-relaxed font-sans text-xs">
            In cold liquid at 38&deg;F, fluid viscosity (&eta;) increases and gravitational sedimentation separates dense particles according to Stokes&apos; Law:
          </p>
          <div className="hw-well p-3 rounded text-[11px] text-blue-300 border border-blue-500/20">
            <code>v = 2 &bull; r&sup2; &bull; (&rho;_p - &rho;_f) &bull; g / (9 &bull; &eta;)</code>
          </div>
          <p className="text-slate-400 leading-relaxed font-sans text-xs">
            Dense, scarred G₀/G₁ mother cells and bitter hop polyphenols settle 3.5&times; faster than tiny, unscarred G₄ virgin daughters. This allows the brewer to cleanly decant mothers into the dock while keeping daughters in suspension.
          </p>
        </div>

        {/* Law 3: Conical Hydrodynamic Funnel */}
        <div className="hw-panel p-5 space-y-3">
          <div className="flex items-center space-x-2 text-emerald-400 font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>3. Conical Funnel Hydrodynamic Barrier</span>
          </div>
          <p className="text-slate-300 leading-relaxed font-sans text-xs">
            The main cap&apos;s conical funnel acts as a one-way hydrodynamic trap. During the initial 1.0&tau; phase, sediment slips down the 45° conical slope into the dock.
          </p>
          <div className="hw-well p-3 rounded text-[11px] text-emerald-300 border border-emerald-500/20">
            <code>&Delta;P_undock &gt; 0 &rarr; Backwash Shearing Index &lt; 0.08</code>
          </div>
          <p className="text-slate-400 leading-relaxed font-sans text-xs">
            If the funnel is accidentally omitted, undocking pressure differentials induce violent backward vortex suction, dumping 75% of bitter hop sludge back into the beer (&ldquo;The Accidental Yeast Bomb&rdquo;).
          </p>
        </div>

        {/* Law 4: Soma-Index & Glutathione */}
        <div className="hw-panel p-5 space-y-3">
          <div className="flex items-center space-x-2 text-yellow-400 font-bold">
            <Flame className="w-4 h-4 text-yellow-400" />
            <span>4. Soma-Index (&Phi;) &amp; Live Yeast Glutathione</span>
          </div>
          <p className="text-slate-300 leading-relaxed font-sans text-xs">
            Unlike sterile commercial beers filtered to zero biology, living &tau;-protocol beer retains 20&ndash;35 billion live G₄ daughter cells per 500 mL pint.
          </p>
          <div className="hw-well p-3 rounded text-[11px] text-yellow-300 border border-yellow-500/20">
            <code>Yeast Kcal = 0.28 &times; (Billions G₄) &bull; GSH = 0.58 &times; (Billions G₄)</code>
          </div>
          <p className="text-slate-400 leading-relaxed font-sans text-xs">
            These smooth-walled cells contain over 20 mg of active reduced glutathione (GSH) and bioavailable B-complex vitamins, buffering acetaldehyde toxicity and promoting an invigorating, clear social buzz.
          </p>
        </div>
      </div>
    </div>
  );
}
