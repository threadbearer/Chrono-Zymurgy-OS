import React, { useState } from 'react';
import { useTerminology } from '../context/TerminologyContext';
import { MASTER_KITS, calculateSavings, isVaultUnlocked, unlockVault, lockVault } from '../data/kits';
import RadarProfile from './RadarProfile';
import CustomKitModal from './CustomKitModal';
import { 
  Search, 
  Plus, 
  DollarSign, 
  Flame, 
  Clock, 
  Snowflake, 
  Beaker, 
  Sparkles, 
  Scale, 
  Leaf, 
  Wine,
  Zap,
  ArrowRight,
  ShieldCheck,
  Check,
  Lock,
  Unlock,
  Key
} from 'lucide-react';

export default function MasterCatalog({ onSelectForSimulator, onSelectForTracker, customKits = [], onSaveCustomKit }) {
  const { mode, t } = useTerminology();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedKit, setSelectedKit] = useState(MASTER_KITS[0]); // Flagship Hazy Tau IPA

  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  const [maltUnit, setMaltUnit] = useState('dme_grams'); // 'dme_grams' | 'dme_oz' | 'lme_grams' | 'lme_oz'
  const [vaultKeyInput, setVaultKeyInput] = useState('');
  const [showVaultPrompt, setShowVaultPrompt] = useState(false);
  const [unlockedState, setUnlockedState] = useState(() => isVaultUnlocked());


  const allKits = [...customKits, ...MASTER_KITS];

  const categories = [
    { id: 'All', label: 'ALL' },
    { id: 'Hazy', label: 'HAZY / NEIPA' },
    { id: 'Pale', label: 'WEST COAST / PALE' },
    { id: 'Lager', label: 'LAGERS' },
    { id: 'Sour', label: 'SOURS / CIDERS' },
    { id: 'Stout', label: 'STOUTS' }
  ];

  const filteredKits = allKits.filter((kit) => {
    const matchesCategory = selectedCategory === 'All' || 
      kit.category?.toLowerCase().includes(selectedCategory.toLowerCase()) ||
      kit.style?.toLowerCase().includes(selectedCategory.toLowerCase());

    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || 
      kit.name.toLowerCase().includes(q) ||
      kit.style.toLowerCase().includes(q) ||
      kit.yeast?.strain?.toLowerCase().includes(q) ||
      kit.hopTea?.variety?.toLowerCase().includes(q) ||
      kit.hopper?.variety?.toLowerCase().includes(q);

    return matchesCategory && matchesSearch;
  });

  const savings = calculateSavings(selectedKit.retailPrice, selectedKit.diyCost);

  // Helper for dynamic malt weight string
  const renderMaltWeight = (maltBase) => {
    if (!maltBase) return '';
    if (!maltBase.dmeGrams) return maltBase.maltType || '🔒 [RESTRICTED // PROTOCOL KEY REQUIRED]';
    if (maltBase.dmeGrams === 0) return maltBase.maltType; // Cider

    switch (maltUnit) {
      case 'dme_grams':
        return `${maltBase.dmeGrams}g Dry Malt Extract (DME)`;
      case 'dme_oz':
        return `${maltBase.dmeOunces || (maltBase.dmeGrams / 28.35).toFixed(1)} oz DME`;
      case 'lme_grams':
        return `${maltBase.lmeGrams}g Liquid Malt Extract (LME, ×1.22)`;
      case 'lme_oz':
        return `${maltBase.lmeOunces || (maltBase.lmeGrams / 28.35).toFixed(1)} oz LME (×1.22)`;
      default:
        return `${maltBase.dmeGrams}g DME`;
    }
  };

  const handleUnlockSubmit = (e) => {
    e?.preventDefault();
    if (vaultKeyInput.trim().length > 0) {
      unlockVault(vaultKeyInput.trim());
      setUnlockedState(true);
      setShowVaultPrompt(false);
    }
  };

  const handleRelock = () => {
    lockVault();
    setUnlockedState(false);
  };


  return (
    <div className="space-y-5">
      {/* Top Banner: Decommercialization Engine */}
      <div className="hw-panel p-5 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-gradient-to-l from-cyan-500/10 to-transparent pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-cyan-400 text-xs font-mono-tabular mb-1">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
              <span className="tracking-widest uppercase font-semibold">Open-Source Pinter Decommercialization Engine</span>
              <span className="text-slate-600">|</span>
              <span className="text-slate-400">5,450 mL STANDARDIZATION</span>
            </div>
            <h2 className="text-2xl font-bold font-display text-white tracking-tight">
              23-Kit Master Catalog &amp; DIY Clone Library
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-3xl leading-relaxed">
              Liberate your Pinter from $38 proprietary Fresh Presses. Every recipe is calibrated to the gram for pure DME/LME extract, 10-minute hop teas, and commercial dry yeast.
            </p>
          </div>

          <button
            onClick={() => setIsCustomModalOpen(true)}
            className="hw-btn flex items-center space-x-2 px-4 py-2.5 rounded-lg text-cyan-300 font-mono-tabular text-xs uppercase tracking-wider font-bold shadow-lg transition self-start md:self-center"
          >
            <Plus className="w-4 h-4 text-cyan-400" />
            <span>+ Create Custom DIY Kit</span>
          </button>
        </div>
      </div>

      {/* Command & Control Bar (Search + Category Filter + Unit Switcher Matrix) */}
      <div className="hw-panel p-3 flex flex-col xl:flex-row items-center justify-between gap-3">
        {/* Terminal Search Prompt */}
        <div className="relative w-full xl:w-96">
          <div className="absolute left-3 top-2.5 flex items-center space-x-1.5 text-cyan-400 font-mono-tabular text-xs pointer-events-none">
            <span className="font-bold">&gt;</span>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="FILTER_STRAIN_OR_KIT... (e.g. Verdant, Citra, W-34/70)"
            className="w-full pl-8 pr-3 py-1.5 rounded hw-well border border-white/10 text-white text-xs placeholder-slate-500 focus:border-cyan-400 outline-none font-mono-tabular transition"
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center space-x-1 overflow-x-auto w-full xl:w-auto pb-1 xl:pb-0 text-xs font-mono-tabular">
          {categories.map((cat) => {
            const count = cat.id === 'All' 
              ? allKits.length 
              : allKits.filter(k => k.category?.toLowerCase().includes(cat.id.toLowerCase()) || k.style?.toLowerCase().includes(cat.id.toLowerCase())).length;
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-2.5 py-1.5 rounded whitespace-nowrap transition flex items-center space-x-1.5 ${
                  isSelected
                    ? 'hw-well text-cyan-300 border border-cyan-400/60 font-semibold shadow-[0_0_12px_rgba(0,240,255,0.2)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
                }`}
              >
                <span>{cat.label}</span>
                <span className={`px-1 py-0.2 rounded text-[10px] ${isSelected ? 'bg-cyan-500/20 text-cyan-200' : 'bg-black/40 text-slate-500'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Global Malt Unit Matrix Switcher */}
        <div className="flex items-center space-x-1 hw-well p-1 rounded border border-white/10 text-xs font-mono-tabular">
          <span className="text-[10px] text-slate-500 uppercase px-1.5 hidden sm:inline">Malt Matrix:</span>
          <button
            onClick={() => setMaltUnit('dme_grams')}
            className={`px-2 py-0.5 rounded transition ${maltUnit === 'dme_grams' ? 'bg-amber-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'}`}
          >
            DME [g]
          </button>
          <button
            onClick={() => setMaltUnit('dme_oz')}
            className={`px-2 py-0.5 rounded transition ${maltUnit === 'dme_oz' ? 'bg-amber-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'}`}
          >
            DME [oz]
          </button>
          <button
            onClick={() => setMaltUnit('lme_grams')}
            className={`px-2 py-0.5 rounded transition ${maltUnit === 'lme_grams' ? 'bg-amber-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'}`}
          >
            LME [g]
          </button>
          <button
            onClick={() => setMaltUnit('lme_oz')}
            className={`px-2 py-0.5 rounded transition ${maltUnit === 'lme_oz' ? 'bg-amber-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-white'}`}
          >
            LME [oz]
          </button>
        </div>
      </div>

      {/* Main Grid: Left Spec Slates (5 cols) + Right Selected Dossier (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column: Kit Dossier Cards */}
        <div className="lg:col-span-5 space-y-3">
          {filteredKits.map((kit, index) => {
            const isSelected = selectedKit.id === kit.id;
            const kitSavings = calculateSavings(kit.retailPrice, kit.diyCost);
            const serialNum = String(index + 1).padStart(2, '0');
            const somaScore = kit.scores?.buzz ?? 7.0;

            return (
              <div
                key={kit.id}
                onClick={() => setSelectedKit(kit)}
                className={`hw-panel p-4 cursor-pointer transition-all duration-200 relative group ${
                  isSelected
                    ? 'border-cyan-400/70 shadow-[0_0_20px_rgba(0,240,255,0.25)] bg-[#172030]'
                    : 'hover:border-white/20 hover:bg-[#151C28]'
                }`}
              >
                {/* Header Strip */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-mono-tabular font-bold text-slate-500">
                        KIT // {serialNum}
                      </span>
                      <h3 className="text-sm font-bold text-white font-display tracking-wide">{kit.name}</h3>
                      {kit.isCustom && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-mono-tabular bg-purple-950 text-purple-300 border border-purple-700">
                          CUSTOM_DIY
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-400 block mt-0.5">{kit.subtitle || kit.style}</span>
                  </div>

                  {/* Badges: ABV, KCAL & Golden Fuzzy Buzz (Soma-Index) */}
                  <div className="flex items-center space-x-1.5 shrink-0">
                    <span className="hw-well px-2 py-0.5 rounded text-xs font-mono-tabular font-bold text-amber-300 border border-amber-500/30">
                      {kit.abv}% ABV
                    </span>
                    <span className={`px-2 py-0.5 rounded text-xs font-mono-tabular font-bold border ${
                      somaScore >= 8.5 
                        ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50 shadow-[0_0_8px_rgba(16,185,129,0.3)]' 
                        : 'bg-amber-950/60 text-amber-200 border-amber-500/30'
                    }`}>
                      &Phi; {somaScore}
                    </span>
                  </div>
                </div>

                {/* 5-Axis Horizontal LED Segmented Progress Bars */}
                <div className="mt-3 pt-2.5 border-t border-white/5 space-y-1.5 text-[10px] font-mono-tabular">
                  {/* Axis 1: Silk */}
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 w-28 truncate">{t('axis_1', 'short')}</span>
                    <div className="flex-1 mx-2 h-1.5 hw-well rounded overflow-hidden">
                      <div className="h-full bg-cyan-400 transition-all duration-300" style={{ width: `${(kit.scores?.silk || 5) * 10}%` }}></div>
                    </div>
                    <span className="text-cyan-300 w-6 text-right font-bold">{kit.scores?.silk}</span>
                  </div>

                  {/* Axis 2: Creamsicle / Diacetyl */}
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 w-28 truncate">{t('axis_2a', 'short')}</span>
                    <div className="flex-1 mx-2 h-1.5 hw-well rounded overflow-hidden">
                      <div className="h-full bg-amber-400 transition-all duration-300" style={{ width: `${(kit.scores?.dc || 3) * 10}%` }}></div>
                    </div>
                    <span className="text-amber-300 w-6 text-right font-bold">{kit.scores?.dc}</span>
                  </div>

                  {/* Axis 3: Terpene Aroma */}
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 w-28 truncate">{t('axis_3a', 'short')}</span>
                    <div className="flex-1 mx-2 h-1.5 hw-well rounded overflow-hidden">
                      <div className="h-full bg-purple-400 transition-all duration-300" style={{ width: `${(kit.scores?.aroma || 7) * 10}%` }}></div>
                    </div>
                    <span className="text-purple-300 w-6 text-right font-bold">{kit.scores?.aroma}</span>
                  </div>

                  {/* Axis 4: Carbonic Velocity */}
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 w-28 truncate">{t('axis_4', 'short')}</span>
                    <div className="flex-1 mx-2 h-1.5 hw-well rounded overflow-hidden">
                      <div className="h-full bg-blue-400 transition-all duration-300" style={{ width: `${(kit.scores?.carb || 7.5) * 10}%` }}></div>
                    </div>
                    <span className="text-blue-300 w-6 text-right font-bold">{kit.scores?.carb}</span>
                  </div>

                  {/* Axis 5: Golden Fuzzy Buzz */}
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 w-28 truncate">{t('axis_5', 'short')}</span>
                    <div className="flex-1 mx-2 h-1.5 hw-well rounded overflow-hidden">
                      <div className="h-full bg-yellow-400 transition-all duration-300" style={{ width: `${somaScore * 10}%` }}></div>
                    </div>
                    <span className="text-yellow-300 w-6 text-right font-bold">{somaScore}</span>
                  </div>
                </div>

                {/* Financial Delta Readout Strip */}
                <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[11px] font-mono-tabular">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-slate-500 line-through">${kit.retailPrice.toFixed(2)}</span>
                    <span className="text-slate-600">&rarr;</span>
                    <span className="text-emerald-400 font-bold">${kit.diyCost.toFixed(2)}</span>
                  </div>
                  <span className="hw-well px-2 py-0.5 rounded text-emerald-300 font-bold border border-emerald-500/30">
                    [ -{kitSavings.percent}% COST DELTA ]
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Column: Full Selected Kit Dossier & Multi-Physics Blueprint */}
        <div className="lg:col-span-7 hw-panel p-5 space-y-5">
          {/* Header & Direct Action CTAs */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-2xl font-bold font-display text-white tracking-wide">
                  {selectedKit.name}
                </h3>
                <span className="px-2 py-0.5 rounded font-mono-tabular text-xs hw-well text-cyan-300 border border-cyan-500/30">
                  {selectedKit.style}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-xl leading-relaxed">
                {mode === 'biophysics' ? selectedKit.bioDescription : selectedKit.humanDescription}
              </p>
            </div>

            {/* Direct Action Dispatch Buttons */}
            <div className="flex items-center space-x-2 shrink-0">
              <button
                onClick={() => onSelectForSimulator(selectedKit)}
                className="hw-btn px-3 py-1.5 rounded text-cyan-300 font-mono-tabular text-xs font-semibold flex items-center space-x-1.5 transition"
                title="Load into Unified Multi-Physics Simulator"
              >
                <Beaker className="w-3.5 h-3.5 text-cyan-400" />
                <span>LOAD SIMULATOR &rarr;</span>
              </button>
              <button
                onClick={() => onSelectForTracker(selectedKit)}
                className="px-3.5 py-1.5 rounded bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 active:from-amber-600 text-slate-950 font-bold text-xs font-mono-tabular flex items-center space-x-1.5 shadow-lg transition"
                title="Pitch into Active Multi-Pinter τ-Clock Tracker"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>START &tau;-BATCH &rarr;</span>
              </button>
            </div>
          </div>

          {/* 5-Axis Radar Profile Visualization */}
          <div className="hw-well p-4 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-mono-tabular font-bold text-slate-300 flex items-center space-x-1.5">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span>
                  {mode === 'biophysics' ? '5-Axis Soma-Kinetic Vector Profile' : '5-Point Flavor & Visceral Feel Map'}
                </span>
              </span>
              <span className="text-[10px] font-mono-tabular text-slate-500">
                Mode: {mode === 'biophysics' ? 'Biophysics (SKL)' : 'Human Feel'}
              </span>
            </div>
            <RadarProfile scores={selectedKit.scores} />
          </div>

          {/* Open-Source DIY Clone Ledger (Laboratory Bill of Materials) */}
          <div className="hw-panel p-4 space-y-3 bg-[#0E1420]/90">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-white/5">
              <div className="flex items-center space-x-2 text-emerald-400 font-mono-tabular text-xs font-bold uppercase tracking-wider">
                <Leaf className="w-4 h-4 text-emerald-400" />
                <span>Open-Source Clone Bill of Materials (5,450 mL Fill Line)</span>
              </div>
              <span className="text-[10px] font-mono-tabular text-slate-400">
                Active Malt Unit: <strong className="text-amber-400">{maltUnit.toUpperCase()}</strong>
              </span>
            </div>

            {/* Proprietary Recipe Locked Banner */}
            {selectedKit.isLocked && !unlockedState && (
              <div className="p-3 rounded bg-amber-950/40 border border-amber-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono-tabular">
                <div className="flex items-center space-x-2 text-amber-300">
                  <Lock className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>PROPRIETARY CLONE BOM GATED // MASTER VAULT KEY REQUIRED</span>
                </div>
                <div className="flex items-center space-x-2">
                  {showVaultPrompt ? (
                    <form onSubmit={handleUnlockSubmit} className="flex items-center space-x-1.5">
                      <input
                        type="password"
                        placeholder="Enter vault secret..."
                        value={vaultKeyInput}
                        onChange={(e) => setVaultKeyInput(e.target.value)}
                        className="px-2 py-0.5 rounded bg-black/60 border border-amber-500/50 text-white text-[11px] focus:outline-none focus:border-amber-400"
                        autoFocus
                      />
                      <button
                        type="submit"
                        className="px-2 py-0.5 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[10px] tracking-wider uppercase transition"
                      >
                        UNLOCK
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowVaultPrompt(false)}
                        className="px-1.5 py-0.5 rounded bg-white/10 hover:bg-white/20 text-slate-300 text-[10px]"
                      >
                        ✕
                      </button>
                    </form>
                  ) : (
                    <button
                      onClick={() => setShowVaultPrompt(true)}
                      className="px-2.5 py-1 rounded bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 hover:text-white font-bold text-[10px] tracking-wider uppercase flex items-center space-x-1.5 transition"
                    >
                      <Key className="w-3 h-3 text-amber-400" />
                      <span>DECRYPT WITH VAULT KEY</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Bill of Materials Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono-tabular">
              {/* [MALT BASE] */}
              <div className="hw-well p-3 rounded space-y-1">
                <div className="flex items-center space-x-1.5 text-slate-400 text-[10px] uppercase">
                  <Scale className="w-3.5 h-3.5 text-amber-400" />
                  <span>[MALT BASE] (Dissolve in 2L Warm Water)</span>
                </div>
                <p className="text-white font-bold text-sm tracking-wide">
                  {renderMaltWeight(selectedKit.maltBase)}
                </p>
                <p className="text-[10px] text-slate-400">{selectedKit.maltBase?.adjuncts}</p>
              </div>

              {/* [10m HOP TEA] */}
              <div className="hw-well p-3 rounded space-y-1">
                <div className="flex items-center space-x-1.5 text-slate-400 text-[10px] uppercase">
                  <Flame className="w-3.5 h-3.5 text-emerald-400" />
                  <span>[10m HOP TEA] (1.0 L Simmer)</span>
                </div>
                <p className="text-emerald-300 font-bold text-sm tracking-wide">
                  {selectedKit.isLocked && !unlockedState
                    ? (selectedKit.hopTea?.variety || '🔒 [REDACTED BOTANICAL]')
                    : `${selectedKit.hopTea?.grams}g ${selectedKit.hopTea?.variety}`}
                </p>
                <p className="text-[10px] text-slate-400">
                  {selectedKit.isLocked && !unlockedState
                    ? (selectedKit.hopTea?.notes || 'Classified thermal extraction vector.')
                    : 'Simmer in 1L water 10 min, then strain into Pinter vessel.'}
                </p>
              </div>

              {/* [HOPPER TINCTURE] */}
              <div className="hw-well p-3 rounded space-y-1">
                <div className="flex items-center space-x-1.5 text-slate-400 text-[10px] uppercase">
                  <Wine className="w-3.5 h-3.5 text-purple-400" />
                  <span>[HOPPER TINCTURE] (Aroma Shot)</span>
                </div>
                <p className="text-purple-300 font-bold text-sm tracking-wide">
                  {selectedKit.isLocked && !unlockedState
                    ? (selectedKit.hopper?.variety || '🔒 [REDACTED TERPENE PAYLOAD]')
                    : (selectedKit.hopper?.grams > 0 ? `${selectedKit.hopper?.grams}g ${selectedKit.hopper?.variety}` : 'None Required (Pure Malt Core)')}
                </p>
                <p className="text-[10px] text-slate-400">{selectedKit.hopper?.method}</p>
              </div>

              {/* [YEAST DYNASTY] */}
              <div className="hw-well p-3 rounded space-y-1">
                <div className="flex items-center space-x-1.5 text-slate-400 text-[10px] uppercase">
                  <Beaker className="w-3.5 h-3.5 text-cyan-400" />
                  <span>[YEAST DYNASTY] (Commercial Dry Packet)</span>
                </div>
                <p className="text-cyan-300 font-bold text-sm tracking-wide">
                  {selectedKit.isLocked && !unlockedState
                    ? (selectedKit.yeast?.strain || '🔒 [CLASSIFIED MICROBIAL STRAIN]')
                    : `${selectedKit.yeast?.grams}g ${selectedKit.yeast?.strain} (${selectedKit.yeast?.brand})`}
                </p>
                <p className="text-[10px] text-slate-400">
                  {selectedKit.isLocked && !unlockedState
                    ? 'Proprietary flocculation and attenuation kinetics protected under vault.'
                    : `Attenuation: ${selectedKit.yeast?.attenuation} | Flocculation: ${selectedKit.yeast?.flocculation}`}
                </p>
              </div>
            </div>


            {/* Financial Delta Telemetry Strip */}
            <div className="hw-well p-3 rounded border border-emerald-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono-tabular">
              <div className="flex items-center space-x-2">
                <span className="text-slate-400">PINTER RETAIL:</span>
                <span className="line-through text-slate-500 font-bold">${selectedKit.retailPrice.toFixed(2)}</span>
                <span className="text-slate-600">&rarr;</span>
                <span className="text-slate-400">OPEN-SOURCE DIY:</span>
                <span className="text-emerald-400 font-bold">${selectedKit.diyCost.toFixed(2)}</span>
              </div>
              <span className="px-2.5 py-0.5 rounded bg-emerald-950 text-emerald-300 font-bold border border-emerald-500/50 shadow-[0_0_8px_rgba(16,185,129,0.3)]">
                [ -{savings.percent}% COST DELTA // SAVE ${savings.savedAmount} ]
              </span>
            </div>
          </div>

          {/* τ-Protocol Kinetic Undock Timetable Ribbon */}
          <div className="hw-well p-4 rounded-lg space-y-2.5">
            <span className="font-mono-tabular text-xs font-bold text-cyan-400 flex items-center space-x-1.5">
              <Clock className="w-4 h-4" />
              <span>
                {mode === 'biophysics' ? 'τ-Protocol Kinetic Undock Timetable' : 'Living-Rhythm Brewing Schedule'}
              </span>
            </span>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-xs font-mono-tabular">
              <div className="p-2.5 rounded hw-well border border-white/5">
                <span className="text-slate-400 block text-[10px] uppercase">
                  {mode === 'biophysics' ? '1.00 τ Horizon' : 'The Quiet Breath (1.00 τ)'}
                </span>
                <span className="text-base font-bold text-white mt-0.5 block">
                  ~{selectedKit.baseTau} Hours
                </span>
                <span className="text-[10px] text-slate-500">
                  90% gas quiet threshold
                </span>
              </div>

              <div className="p-2.5 rounded hw-well border border-cyan-500/30">
                <span className="text-cyan-400 block text-[10px] uppercase font-bold">
                  {mode === 'biophysics' ? '1.15 τ Soma-Max' : 'Golden Fuzzy Buzz Track'}
                </span>
                <span className="text-base font-bold text-cyan-300 mt-0.5 block">
                  ~{Math.round(selectedKit.baseTau * 1.15)} Hours
                </span>
                <span className="text-[10px] text-slate-400">
                  Max G4 viability &amp; creamsicle silk
                </span>
              </div>

              <div className="p-2.5 rounded hw-well border border-blue-500/30">
                <span className="text-blue-400 block text-[10px] uppercase font-bold">
                  {mode === 'biophysics' ? 'Stokes Cold Lock' : 'The Big Fridge Chill'}
                </span>
                <span className="text-base font-bold text-blue-300 mt-0.5 block">
                  {selectedKit.chillHours}h ({(selectedKit.chillHours / 24).toFixed(1)}d)
                </span>
                <span className="text-[10px] text-slate-400">
                  Stokes settling at 38°F
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Kit Creator Modal */}
      <CustomKitModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        onSaveKit={onSaveCustomKit}
      />
    </div>
  );
}
