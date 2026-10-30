import React, { useState, useMemo } from 'react';
import { useTerminology } from '../context/TerminologyContext';
import { 
  generateCustomBeer, 
  BREW_GUIDE_STAGES, 
  answerBrewQuestion, 
  srmToHex,
  STYLE_DATABASE 
} from '../utils/aiBrewEngine';
import RadarProfile from './RadarProfile';
import { MASTER_KITS } from '../data/kits';
import { 
  Sparkles, 
  Bot, 
  Sliders, 
  Flame, 
  Wind, 
  ShieldCheck, 
  Clock, 
  Layers, 
  Snowflake, 
  Zap, 
  CheckCircle2, 
  Circle, 
  ArrowRight, 
  Send, 
  Copy, 
  Check, 
  Beaker, 
  BookOpen, 
  HelpCircle, 
  Droplets,
  Scale,
  RefreshCw,
  Plus
} from 'lucide-react';

export default function AIBrewmaster({ onSelectForSimulator, onSelectForTracker, onSaveCustomKit, customKits = [] }) {
  const { mode, t } = useTerminology();

  // Active Main Sub-Tab: 'architect' | 'guide'
  const [activeSubTab, setActiveSubTab] = useState('architect');

  // --- ARCHITECT STATE ---
  const [prompt, setPrompt] = useState('Velvety tropical hazy IPA with passionfruit, peach, and low bitterness');
  const [selectedCategory, setSelectedCategory] = useState('Hazy / NEIPA');
  const [targetAbv, setTargetAbv] = useState(6.4);
  const [targetIbu, setTargetIbu] = useState(38);
  const [mouthfeelSilk, setMouthfeelSilk] = useState(9.2);
  const [aromaIntensity, setAromaIntensity] = useState(9.4);
  const [srmColor, setSrmColor] = useState(4.8);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedRecipe, setCopiedRecipe] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Active Generated Beer (initialized with initial synthesis)
  const [generatedBeer, setGeneratedBeer] = useState(() => {
    return generateCustomBeer({
      prompt: 'Velvety tropical hazy IPA with passionfruit, peach, and low bitterness',
      preferredCategory: 'Hazy / NEIPA',
      targetAbv: 6.4,
      targetIbu: 38,
      mouthfeelSilk: 9.2,
      aromaIntensity: 9.4,
      srmPreference: 4.8
    });
  });

  // --- BREW GUIDE STATE ---
  const [activeStageIndex, setActiveStageIndex] = useState(0);
  const [completedSteps, setCompletedSteps] = useState({});
  const [chatInput, setChatInput] = useState('');
  const [chatMessages, setChatMessages] = useState([
    {
      role: 'assistant',
      text: "Greetings, Brewer! I am your AI Zymurgy Copilot. I'm trained on non-equilibrium biophysics, 15 PSI containment dynamics, and the Tau-Protocol. How can I assist your brew today?",
      title: 'AI Brewmaster Initialized'
    }
  ]);

  // Handle Recipe Synthesis
  const handleSynthesize = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const result = generateCustomBeer({
        prompt,
        preferredCategory: selectedCategory,
        targetAbv,
        targetIbu,
        mouthfeelSilk,
        aromaIntensity,
        srmPreference: srmColor
      });
      setGeneratedBeer(result);
      setIsGenerating(false);
    }, 450);
  };

  // Quick prompt presets
  const applyPromptPreset = (presetText, category, abv, ibu, silk, aroma, srm) => {
    setPrompt(presetText);
    setSelectedCategory(category);
    setTargetAbv(abv);
    setTargetIbu(ibu);
    setMouthfeelSilk(silk);
    setAromaIntensity(aroma);
    setSrmColor(srm);

    const result = generateCustomBeer({
      prompt: presetText,
      preferredCategory: category,
      targetAbv: abv,
      targetIbu: ibu,
      mouthfeelSilk: silk,
      aromaIntensity: aroma,
      srmPreference: srm
    });
    setGeneratedBeer(result);
  };

  // Toggle step checklist
  const handleToggleStep = (stepId) => {
    setCompletedSteps(prev => ({
      ...prev,
      [stepId]: !prev[stepId]
    }));
  };

  // Chat message submit
  const handleSendChat = (e) => {
    e?.preventDefault();
    if (!chatInput.trim()) return;

    const userText = chatInput.trim();
    setChatInput('');

    // Append user message
    const updated = [...chatMessages, { role: 'user', text: userText }];
    setChatMessages(updated);

    // AI response
    setTimeout(() => {
      const response = answerBrewQuestion(userText);
      setChatMessages(prev => [
        ...prev,
        {
          role: 'assistant',
          title: response.title,
          text: response.answer
        }
      ]);
    }, 350);
  };

  // Copy Markdown Brew Sheet to Clipboard
  const handleCopyBrewSheet = () => {
    if (!generatedBeer) return;
    const sheet = `# CHRONO-ZYMURGY OS // BREW SHEET: ${generatedBeer.name}
Style: ${generatedBeer.style} (${generatedBeer.category})
Target Metrics: ${generatedBeer.abv}% ABV | ${generatedBeer.ibu} IBU | ${generatedBeer.srm} SRM | ${generatedBeer.calories} kcal/pint
5,450 mL Fill Line | 15 PSI Containment

## BILL OF MATERIALS
- Malt Base: ${generatedBeer.maltBase.dmeGrams}g DME (${generatedBeer.maltBase.dmeOunces} oz) - ${generatedBeer.maltBase.maltType}
- Adjuncts: ${generatedBeer.maltBase.adjuncts}
- Hop Tea: ${generatedBeer.hopTea.grams}g ${generatedBeer.hopTea.variety} (Whirlpool ${generatedBeer.hopTea.temperature}, ${generatedBeer.hopTea.steepMinutes} min)
- Hopper Aroma: ${generatedBeer.hopper.grams}g ${generatedBeer.hopper.variety} (${generatedBeer.hopper.method})
- Yeast: ${generatedBeer.yeast.strain} (${generatedBeer.yeast.optimumTemp})

## FERMENTATION PROTOCOL (τ-PROTOCOL)
- 1.00τ Horizon: ~${generatedBeer.baseTau} hours
- Undock Window: ${generatedBeer.somaTau}τ (Soma-Max) to ${generatedBeer.crowdTau}τ (Crowd-Harmonic)
- Cold Lock: ${generatedBeer.chillHours} hours at 38°F

DIY Cost: $${generatedBeer.diyCost.toFixed(2)} (Savings vs Retail: $${(generatedBeer.retailPrice - generatedBeer.diyCost).toFixed(2)})
Generated by CHRONO-ZYMURGY OS AI Brewmaster`;

    navigator.clipboard?.writeText(sheet);
    setCopiedRecipe(true);
    setTimeout(() => setCopiedRecipe(false), 2000);
  };

  // Save to Custom DIY Kits in Master Catalog
  const handleSaveToCatalog = () => {
    if (!generatedBeer) return;
    onSaveCustomKit(generatedBeer);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const activeStage = BREW_GUIDE_STAGES[activeStageIndex];
  const stageSteps = activeStage?.steps || [];
  const completedInStage = stageSteps.filter(s => completedSteps[s.id]).length;
  const stageProgressPct = stageSteps.length > 0 ? Math.round((completedInStage / stageSteps.length) * 100) : 0;

  return (
    <div className="space-y-5">
      {/* Top Banner & Mode Toggle */}
      <div className="hw-panel p-5 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-gradient-to-l from-cyan-500/10 via-amber-500/5 to-transparent pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 text-cyan-400 text-xs font-mono-tabular mb-1">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              <span className="tracking-widest uppercase font-semibold">AI Zymurgy Intelligence Engine</span>
              <span className="text-slate-600">|</span>
              <span className="text-amber-400 font-medium">15 PSI BIOREACTOR MODEL</span>
            </div>
            <h2 className="text-2xl font-bold font-display text-white tracking-tight flex items-center space-x-2.5">
              <span>AI Brewmaster &amp; Sensory Architect</span>
              <span className="px-2 py-0.5 rounded text-[11px] font-mono-tabular bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold">
                NEURAL_ZYMO // v4.5
              </span>
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Design your bespoke formulation with biophysical Tinseth IBU kinetics and Morey SRM prediction, then execute with real-time interactive brewing guidance.
            </p>
          </div>

          {/* Sub-Tab Navigation Toggle */}
          <div className="hw-well p-1 flex items-center gap-1 rounded-lg border border-white/10 shrink-0">
            <button
              onClick={() => setActiveSubTab('architect')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-md text-xs font-mono-tabular transition-all duration-200 ${
                activeSubTab === 'architect'
                  ? 'bg-gradient-to-r from-cyan-950/80 to-[#0A2633] text-cyan-200 border border-cyan-400/70 font-semibold shadow-[0_0_12px_rgba(0,240,255,0.25)]'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>AI RECIPE ARCHITECT</span>
            </button>

            <button
              onClick={() => setActiveSubTab('guide')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-md text-xs font-mono-tabular transition-all duration-200 ${
                activeSubTab === 'guide'
                  ? 'bg-gradient-to-r from-amber-950/80 to-[#33200A] text-amber-200 border border-amber-400/70 font-semibold shadow-[0_0_12px_rgba(245,176,65,0.25)]'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Bot className="w-3.5 h-3.5 text-amber-400" />
              <span>INTERACTIVE BREW COPILOT</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SUB-TAB 1: AI RECIPE ARCHITECT                                            */}
      {/* ========================================================================= */}
      {activeSubTab === 'architect' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Column (5 Cols): Prompt Input & Vector Faders */}
          <div className="lg:col-span-5 space-y-4">
            <div className="hw-panel p-4 space-y-4">
              <div className="flex items-center justify-between pb-2.5 border-b border-white/10">
                <span className="font-mono-tabular text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center space-x-1.5">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>Generative Taste Parameters</span>
                </span>
                <span className="text-[10px] font-mono-tabular text-slate-500">
                  NATURAL_LANG_SYNTHESIZER
                </span>
              </div>

              {/* Natural Language Prompt Input */}
              <div className="space-y-2">
                <label className="text-[11px] font-mono-tabular text-slate-300 font-semibold uppercase block">
                  Describe Your Dream Beer
                </label>
                <div className="relative">
                  <textarea
                    rows={3}
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g. Crisp clean Munich lager with notes of wildflower honey, low bitterness, and champagne bubbles..."
                    className="w-full px-3 py-2 rounded-md hw-well border border-white/10 text-white font-sans text-xs focus:border-cyan-400 outline-none resize-none placeholder:text-slate-600"
                  />
                </div>

                {/* Quick Inspiration Pills */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[10px] font-mono-tabular text-slate-500 self-center mr-1">Presets:</span>
                  <button
                    onClick={() => applyPromptPreset('Lush juicy Hazy Double IPA with mango, stonefruit, and oat velvet', 'Hazy / NEIPA', 7.2, 42, 9.6, 9.8, 5.0)}
                    className="px-2 py-0.5 rounded text-[10px] font-mono-tabular hw-well border border-cyan-500/30 text-cyan-300 hover:border-cyan-400 transition"
                  >
                    🥭 Hazy NEIPA
                  </button>
                  <button
                    onClick={() => applyPromptPreset('Ultra-crisp Bavarian Helles with water cracker malt and noble floral finish', 'Lagers', 4.9, 18, 7.5, 6.4, 3.2)}
                    className="px-2 py-0.5 rounded text-[10px] font-mono-tabular hw-well border border-amber-500/30 text-amber-300 hover:border-amber-400 transition"
                  >
                    🥨 Bavarian Helles
                  </button>
                  <button
                    onClick={() => applyPromptPreset('Dank resinous Pacific Northwest IPA with pine needles and grapefruit pith', 'West Coast / Pale', 6.8, 65, 6.4, 9.0, 6.8)}
                    className="px-2 py-0.5 rounded text-[10px] font-mono-tabular hw-well border border-emerald-500/30 text-emerald-300 hover:border-emerald-400 transition"
                  >
                    🌲 West Coast Pine
                  </button>
                  <button
                    onClick={() => applyPromptPreset('Decadent Imperial Stout with dark baker chocolate, espresso crema, and vanilla oak', 'Stouts', 8.4, 52, 9.8, 8.6, 38.0)}
                    className="px-2 py-0.5 rounded text-[10px] font-mono-tabular hw-well border border-purple-500/30 text-purple-300 hover:border-purple-400 transition"
                  >
                    🍫 Cacao Stout
                  </button>
                  <button
                    onClick={() => applyPromptPreset('Mouthwatering passionfruit sea-salt gose with crisp natural lactic tartness', 'Sours / Ciders', 4.8, 8, 7.2, 9.4, 3.4)}
                    className="px-2 py-0.5 rounded text-[10px] font-mono-tabular hw-well border border-yellow-500/30 text-yellow-300 hover:border-yellow-400 transition"
                  >
                    🍋 Passionfruit Gose
                  </button>
                </div>
              </div>

              {/* Vector Faders */}
              <div className="space-y-3 pt-2 text-xs font-mono-tabular">
                {/* Target ABV */}
                <div className="hw-well p-2.5 rounded space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-[10px] uppercase">Target Potency (ABV %)</span>
                    <span className="text-cyan-300 font-bold">{targetAbv}% ABV</span>
                  </div>
                  <input
                    type="range"
                    min="3.8"
                    max="9.5"
                    step="0.1"
                    value={targetAbv}
                    onChange={(e) => setTargetAbv(parseFloat(e.target.value))}
                    className="hw-fader"
                  />
                  <div className="flex justify-between text-[9px] text-slate-500">
                    <span>3.8% [Session]</span>
                    <span>6.0% [Standard]</span>
                    <span>9.5% [Imperial]</span>
                  </div>
                </div>

                {/* Target Bitterness (IBU) */}
                <div className="hw-well p-2.5 rounded space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-[10px] uppercase">Bitterness (Tinseth IBU)</span>
                    <span className="text-amber-300 font-bold">{targetIbu} IBU</span>
                  </div>
                  <input
                    type="range"
                    min="8"
                    max="80"
                    step="2"
                    value={targetIbu}
                    onChange={(e) => setTargetIbu(parseInt(e.target.value, 10))}
                    className="hw-fader"
                  />
                  <div className="flex justify-between text-[9px] text-slate-500">
                    <span>8 IBU [Smooth]</span>
                    <span>35 IBU [Balanced]</span>
                    <span>80 IBU [Bold]</span>
                  </div>
                </div>

                {/* Silk & Mouthfeel */}
                <div className="hw-well p-2.5 rounded space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-[10px] uppercase">Suspension Silk (Mouthfeel)</span>
                    <span className="text-emerald-300 font-bold">{mouthfeelSilk}/10</span>
                  </div>
                  <input
                    type="range"
                    min="4.0"
                    max="9.9"
                    step="0.1"
                    value={mouthfeelSilk}
                    onChange={(e) => setMouthfeelSilk(parseFloat(e.target.value))}
                    className="hw-fader"
                  />
                  <div className="flex justify-between text-[9px] text-slate-500">
                    <span>Water-Light</span>
                    <span>Creamy Pillowy</span>
                    <span>Velvet Nectar</span>
                  </div>
                </div>

                {/* Aroma Terpene Lift */}
                <div className="hw-well p-2.5 rounded space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-[10px] uppercase">Hop Terpene Wave (Aroma)</span>
                    <span className="text-purple-300 font-bold">{aromaIntensity}/10</span>
                  </div>
                  <input
                    type="range"
                    min="4.0"
                    max="9.9"
                    step="0.1"
                    value={aromaIntensity}
                    onChange={(e) => setAromaIntensity(parseFloat(e.target.value))}
                    className="hw-fader"
                  />
                </div>

                {/* SRM Color / Roast */}
                <div className="hw-well p-2.5 rounded space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 text-[10px] uppercase">Malt Roast &amp; Color (SRM)</span>
                    <span className="font-bold flex items-center space-x-1.5">
                      <span 
                        className="w-3 h-3 rounded-full border border-white/20 inline-block" 
                        style={{ backgroundColor: srmToHex(srmColor) }}
                      />
                      <span className="text-white">{srmColor} SRM</span>
                    </span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="40"
                    step="1"
                    value={srmColor}
                    onChange={(e) => setSrmColor(parseInt(e.target.value, 10))}
                    className="hw-fader"
                  />
                  <div className="flex justify-between text-[9px] text-slate-500">
                    <span>2 [Straw]</span>
                    <span>8 [Amber]</span>
                    <span>20 [Brown]</span>
                    <span>40 [Black]</span>
                  </div>
                </div>
              </div>

              {/* Synthesize Button */}
              <button
                onClick={handleSynthesize}
                disabled={isGenerating}
                className="w-full py-2.5 px-4 rounded-md font-mono-tabular font-bold text-xs uppercase tracking-wider bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 flex items-center justify-center space-x-2 shadow-[0_0_20px_rgba(0,240,255,0.3)] transition active:scale-[0.99] disabled:opacity-50"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Synthesizing ODE Kinetics...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 fill-slate-950" />
                    <span>Synthesize Custom Formulation</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Right Column (7 Cols): The Synthesized Beer Dossier & Live Glass */}
          <div className="lg:col-span-7 space-y-4">
            {generatedBeer && (
              <div className="hw-panel p-5 space-y-5">
                {/* Header Dossier */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-white/10">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono-tabular bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold uppercase">
                        AI SYNTHESIS
                      </span>
                      <span className="text-slate-500 text-xs font-mono-tabular">•</span>
                      <span className="text-xs font-mono-tabular text-slate-300">{generatedBeer.category}</span>
                    </div>
                    <h3 className="text-2xl font-bold font-display text-white tracking-tight">
                      {generatedBeer.name}
                    </h3>
                    <p className="text-xs text-slate-400 font-sans italic">
                      &quot;{generatedBeer.humanDescription}&quot;
                    </p>
                  </div>

                  {/* Photorealistic Beer Glass Preview & SRM Color Swatch */}
                  <div className="flex items-center space-x-3 shrink-0 hw-well p-2.5 rounded-lg border border-white/10">
                    {/* Rendered Pint Glass */}
                    <div className="relative w-12 h-24 rounded-b-lg border-2 border-white/30 overflow-hidden bg-slate-950/60 shadow-inner flex flex-col justify-end">
                      {/* Foam Head */}
                      <div className="h-4 w-full bg-amber-50/90 border-b border-white/30 shrink-0 shadow-sm relative overflow-hidden">
                        <div className="absolute inset-0 bg-white/40 animate-pulse"></div>
                      </div>
                      {/* Liquid Body */}
                      <div 
                        className="w-full flex-1 relative transition-colors duration-500"
                        style={{ backgroundColor: generatedBeer.colorHex }}
                      >
                        {/* Micro-Carbonation Bubble Simulation */}
                        <div className="absolute bottom-1 left-2 w-1 h-1 rounded-full bg-white/70 animate-ping"></div>
                        <div className="absolute bottom-4 right-2 w-1 h-1 rounded-full bg-white/50 animate-pulse"></div>
                        <div className="absolute bottom-8 left-3 w-1 h-1 rounded-full bg-white/60"></div>
                      </div>
                    </div>

                    {/* Quick Specs */}
                    <div className="text-[11px] font-mono-tabular space-y-0.5">
                      <div className="text-slate-400">SRM: <strong className="text-white">{generatedBeer.srm}</strong></div>
                      <div className="text-slate-400">ABV: <strong className="text-cyan-300">{generatedBeer.abv}%</strong></div>
                      <div className="text-slate-400">IBU: <strong className="text-amber-300">{generatedBeer.ibu}</strong></div>
                      <div className="text-slate-400">Pint: <strong className="text-emerald-300">{generatedBeer.calories} kcal</strong></div>
                    </div>
                  </div>
                </div>

                {/* 4 Telemetry Spec Badges */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono-tabular">
                  <div className="hw-well p-2.5 rounded border border-white/5">
                    <span className="text-slate-500 text-[10px] block uppercase">Standard Volume</span>
                    <span className="text-sm font-bold text-cyan-300">5,450 mL</span>
                    <span className="text-[9px] text-slate-500 block">Pinter Fill Mark</span>
                  </div>
                  <div className="hw-well p-2.5 rounded border border-white/5">
                    <span className="text-slate-500 text-[10px] block uppercase">1.00τ Horizon</span>
                    <span className="text-sm font-bold text-white">~{generatedBeer.baseTau} hrs</span>
                    <span className="text-[9px] text-slate-500 block">Metabolic Peak</span>
                  </div>
                  <div className="hw-well p-2.5 rounded border border-white/5">
                    <span className="text-slate-500 text-[10px] block uppercase">Estimated DIY Cost</span>
                    <span className="text-sm font-bold text-emerald-400">${generatedBeer.diyCost.toFixed(2)}</span>
                    <span className="text-[9px] text-slate-500 block">vs ${generatedBeer.retailPrice.toFixed(2)} Retail</span>
                  </div>
                  <div className="hw-well p-2.5 rounded border border-white/5">
                    <span className="text-slate-500 text-[10px] block uppercase">Cold Lock</span>
                    <span className="text-sm font-bold text-blue-300">{generatedBeer.chillHours} hrs</span>
                    <span className="text-[9px] text-slate-500 block">@ 38°F Stokes Settling</span>
                  </div>
                </div>

                {/* 2-Column Specs: Bill of Materials & Sensory Radar */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  {/* Bill of Materials (7 Cols) */}
                  <div className="md:col-span-7 hw-well p-3.5 rounded-lg space-y-3 text-xs font-mono-tabular">
                    <div className="flex items-center justify-between pb-1.5 border-b border-white/10 text-slate-300 font-bold">
                      <span className="flex items-center space-x-1.5">
                        <Scale className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Bill of Materials (5,450 mL Liquid)</span>
                      </span>
                      <span className="text-[10px] text-emerald-400 font-mono-tabular">
                        Save ${(generatedBeer.retailPrice - generatedBeer.diyCost).toFixed(2)}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <span className="text-[10px] text-slate-500 block uppercase">1. Malt Extract Base</span>
                        <div className="text-white font-medium">
                          {generatedBeer.maltBase.dmeGrams}g DME ({generatedBeer.maltBase.dmeOunces} oz)
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {generatedBeer.maltBase.maltType}
                        </div>
                        {generatedBeer.maltBase.adjuncts && (
                          <div className="text-[10px] text-amber-400/90 mt-0.5">
                            + {generatedBeer.maltBase.adjuncts}
                          </div>
                        )}
                      </div>

                      <div className="pt-1 border-t border-white/5">
                        <span className="text-[10px] text-slate-500 block uppercase">2. Low-Polyphenol Hop Tea</span>
                        <div className="text-white font-medium">
                          {generatedBeer.hopTea.grams}g {generatedBeer.hopTea.variety}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {generatedBeer.hopTea.temperature} for {generatedBeer.hopTea.steepMinutes} min ({generatedBeer.hopTea.waterVolume})
                        </div>
                      </div>

                      <div className="pt-1 border-t border-white/5">
                        <span className="text-[10px] text-slate-500 block uppercase">3. Cold Hopper Terpene Payload</span>
                        <div className="text-white font-medium">
                          {generatedBeer.hopper.grams}g {generatedBeer.hopper.variety}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {generatedBeer.hopper.method}
                        </div>
                      </div>

                      <div className="pt-1 border-t border-white/5">
                        <span className="text-[10px] text-slate-500 block uppercase">4. Yeast &amp; Attenuation</span>
                        <div className="text-white font-medium flex items-center justify-between">
                          <span>{generatedBeer.yeast.strain}</span>
                          <span className="text-cyan-400 text-[10px]">{generatedBeer.yeast.flocculation}</span>
                        </div>
                        <div className="text-[10px] text-slate-400">
                          Pitch at {generatedBeer.yeast.optimumTemp} under 15 PSI
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sensory Profile Radar (5 Cols) */}
                  <div className="md:col-span-5 hw-well p-3.5 rounded-lg flex flex-col justify-between">
                    <div>
                      <div className="text-xs font-mono-tabular font-bold text-slate-300 pb-1 border-b border-white/10 flex items-center space-x-1.5">
                        <Droplets className="w-3.5 h-3.5 text-amber-400" />
                        <span>Sensory Radar Profile</span>
                      </div>
                      <RadarProfile scores={generatedBeer.scores} size="compact" />
                    </div>
                    <div className="text-[10px] font-mono-tabular text-slate-500 text-center pt-2">
                      Non-Equilibrium 6-Axis Taste Scaffolding
                    </div>
                  </div>
                </div>

                {/* Biophysical ODE Trajectory Description */}
                <div className="p-3 rounded hw-well border border-cyan-500/20 text-xs font-mono-tabular text-slate-300 leading-relaxed">
                  <strong className="text-cyan-300 uppercase block text-[10px] mb-0.5">Biophysical Engine Model</strong>
                  {generatedBeer.bioDescription}
                </div>

                {/* Action Button Row */}
                <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-white/10">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleCopyBrewSheet}
                      className="hw-btn px-3 py-1.5 rounded text-xs font-mono-tabular text-slate-300 hover:text-white flex items-center space-x-1.5 transition"
                    >
                      {copiedRecipe ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-300">Copied Sheet!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Copy Brew Sheet</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={handleSaveToCatalog}
                      className="hw-btn px-3 py-1.5 rounded text-xs font-mono-tabular text-slate-300 hover:text-white flex items-center space-x-1.5 transition"
                    >
                      {savedSuccess ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-300">Saved to Catalog!</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5 text-amber-400" />
                          <span>Save to My DIY Kits</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onSelectForSimulator(generatedBeer)}
                      className="px-3.5 py-1.5 rounded bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400/50 text-cyan-200 text-xs font-mono-tabular font-bold flex items-center space-x-1.5 transition shadow-[0_0_12px_rgba(0,240,255,0.2)]"
                    >
                      <Zap className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Pitch to Simulator</span>
                    </button>

                    <button
                      onClick={() => onSelectForTracker(generatedBeer)}
                      className="px-3.5 py-1.5 rounded bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/50 text-amber-200 text-xs font-mono-tabular font-bold flex items-center space-x-1.5 transition shadow-[0_0_12px_rgba(245,176,65,0.2)]"
                    >
                      <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                      <span>Start in Tracker</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 2: INTERACTIVE BREWING PROCESS GUIDE & COPILOT                     */}
      {/* ========================================================================= */}
      {activeSubTab === 'guide' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Column (5 Cols): 7-Stage Stepper & Checklist */}
          <div className="lg:col-span-5 space-y-4">
            <div className="hw-panel p-4 space-y-4">
              <div className="flex items-center justify-between pb-2.5 border-b border-white/10">
                <span className="font-mono-tabular text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center space-x-1.5">
                  <Bot className="w-4 h-4 text-amber-400" />
                  <span>7-Phase Interactive Timeline</span>
                </span>
                <span className="text-[10px] font-mono-tabular text-slate-500">
                  {stageProgressPct}% STAGE COMPLETE
                </span>
              </div>

              {/* Progress Stepper Pills */}
              <div className="space-y-1.5">
                {BREW_GUIDE_STAGES.map((s, idx) => {
                  const isCurrent = idx === activeStageIndex;
                  const stepsForThisStage = s.steps.map(st => st.id);
                  const isAllDone = stepsForThisStage.every(id => completedSteps[id]);

                  return (
                    <button
                      key={s.stage}
                      onClick={() => setActiveStageIndex(idx)}
                      className={`w-full p-2.5 rounded-lg flex items-center justify-between text-left transition font-mono-tabular text-xs ${
                        isCurrent
                          ? 'hw-well border border-amber-400/60 bg-amber-500/10 text-white shadow-[0_0_10px_rgba(245,176,65,0.15)] font-bold'
                          : 'hover:bg-white/5 text-slate-400 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5 truncate">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                          isAllDone 
                            ? 'bg-emerald-500 text-slate-950' 
                            : isCurrent 
                              ? 'bg-amber-400 text-slate-950' 
                              : 'bg-slate-800 text-slate-400'
                        }`}>
                          {isAllDone ? '✓' : s.stage}
                        </span>
                        <span className="truncate">{s.title}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 shrink-0 ml-2">{s.duration}</span>
                    </button>
                  );
                })}
              </div>

              {/* Active Stage Checklist */}
              {activeStage && (
                <div className="hw-well p-3.5 rounded-lg space-y-3 pt-3 border border-white/10">
                  <div className="flex items-center justify-between text-xs font-mono-tabular">
                    <span className="text-white font-bold uppercase tracking-wide">
                      Phase {activeStage.stage}: Checklist
                    </span>
                    <span className="text-cyan-400 text-[11px]">
                      {completedInStage} of {stageSteps.length} Checked
                    </span>
                  </div>

                  <div className="space-y-2 text-xs font-sans">
                    {stageSteps.map((step) => {
                      const isDone = !!completedSteps[step.id];
                      return (
                        <div
                          key={step.id}
                          onClick={() => handleToggleStep(step.id)}
                          className={`p-2 rounded cursor-pointer transition flex items-start space-x-2.5 border ${
                            isDone
                              ? 'bg-emerald-950/20 border-emerald-500/30 text-slate-300'
                              : 'bg-white/5 border-white/5 text-slate-200 hover:border-white/15'
                          }`}
                        >
                          <div className="mt-0.5 shrink-0">
                            {isDone ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            ) : (
                              <Circle className="w-4 h-4 text-slate-500" />
                            )}
                          </div>
                          <span className={`text-[11px] leading-relaxed select-none ${isDone ? 'line-through text-slate-400' : ''}`}>
                            {step.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Stage navigation buttons */}
                  <div className="flex justify-between pt-2 text-xs font-mono-tabular border-t border-white/5">
                    <button
                      onClick={() => setActiveStageIndex(Math.max(0, activeStageIndex - 1))}
                      disabled={activeStageIndex === 0}
                      className="px-2.5 py-1 rounded hw-btn text-slate-400 hover:text-white disabled:opacity-30"
                    >
                      ← Previous
                    </button>
                    <button
                      onClick={() => setActiveStageIndex(Math.min(BREW_GUIDE_STAGES.length - 1, activeStageIndex + 1))}
                      disabled={activeStageIndex === BREW_GUIDE_STAGES.length - 1}
                      className="px-2.5 py-1 rounded hw-btn text-amber-300 hover:text-amber-200 disabled:opacity-30"
                    >
                      Next Phase →
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column (7 Cols): Biophysics Insights & Real-Time AI Chat Assistant */}
          <div className="lg:col-span-7 space-y-4">
            {/* Biophysics Rationale for Active Stage */}
            {activeStage && (
              <div className="hw-panel p-5 space-y-3">
                <div className="flex items-center space-x-2 text-amber-400 text-xs font-mono-tabular">
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span className="uppercase font-semibold tracking-wider">
                    Phase {activeStage.stage} Biophysical Mechanics
                  </span>
                </div>
                <h4 className="text-lg font-bold font-display text-white">
                  {activeStage.title}
                </h4>
                <div className="p-3.5 rounded hw-well border border-amber-500/20 text-xs text-amber-200/90 leading-relaxed font-sans">
                  <strong className="text-white block font-mono-tabular uppercase text-[10px] mb-1">
                    🔬 Non-Equilibrium Zymurgy Rationale:
                  </strong>
                  {activeStage.biophysicsWhy}
                </div>

                {/* Common Troubleshooting Chips */}
                {activeStage.troubleshootTips && activeStage.troubleshootTips.length > 0 && (
                  <div className="space-y-2 pt-1">
                    <span className="text-[10px] font-mono-tabular text-slate-400 block uppercase">
                      Common Phase Troubleshooting:
                    </span>
                    <div className="space-y-1.5">
                      {activeStage.troubleshootTips.map((tip, i) => (
                        <div key={i} className="p-2.5 rounded hw-well border border-white/5 text-xs font-sans">
                          <strong className="text-cyan-300 block font-semibold mb-0.5">
                            Q: {tip.q}
                          </strong>
                          <p className="text-slate-300 text-[11px] leading-relaxed">
                            {tip.a}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Real-Time AI Copilot Chat Interface */}
            <div className="hw-panel p-4 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <div className="flex items-center space-x-2 text-xs font-mono-tabular text-cyan-400">
                  <Bot className="w-4 h-4 text-cyan-400" />
                  <span className="font-bold tracking-wider uppercase">Live Zymurgy AI Assistant</span>
                </div>
                <span className="text-[10px] font-mono-tabular text-emerald-400 flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>ONLINE // REASONING CORE</span>
                </span>
              </div>

              {/* Chat Messages Feed */}
              <div className="hw-well p-3 rounded-lg max-h-60 overflow-y-auto space-y-2.5 text-xs">
                {chatMessages.map((msg, i) => (
                  <div
                    key={i}
                    className={`p-2.5 rounded-lg font-sans leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-cyan-950/60 border border-cyan-500/30 text-cyan-100 ml-6'
                        : 'bg-white/5 border border-white/10 text-slate-200 mr-6'
                    }`}
                  >
                    {msg.title && (
                      <div className="text-[10px] font-mono-tabular font-bold text-amber-400 uppercase mb-1">
                        {msg.title}
                      </div>
                    )}
                    <div className="text-[11px]">{msg.text}</div>
                  </div>
                ))}
              </div>

              {/* Quick Prompt Pills */}
              <div className="flex flex-wrap gap-1.5 text-[10px] font-mono-tabular text-slate-400">
                <span>Quick questions:</span>
                <button
                  onClick={() => {
                    setChatInput('Why did my valve hiss quiet down so early?');
                  }}
                  className="px-2 py-0.5 rounded hw-well border border-white/10 hover:border-cyan-400 text-slate-300 transition"
                >
                  💨 Valve hiss quiet?
                </button>
                <button
                  onClick={() => {
                    setChatInput('What happens if my room is 76°F during fermentation?');
                  }}
                  className="px-2 py-0.5 rounded hw-well border border-white/10 hover:border-cyan-400 text-slate-300 transition"
                >
                  🌡️ Room is 76°F?
                </button>
                <button
                  onClick={() => {
                    setChatInput('How does the conical trub funnel work?');
                  }}
                  className="px-2 py-0.5 rounded hw-well border border-white/10 hover:border-cyan-400 text-slate-300 transition"
                >
                  🌪️ Conical funnel trub?
                </button>
              </div>

              {/* Chat Input Bar */}
              <form onSubmit={handleSendChat} className="flex items-center space-x-2 pt-1">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask the AI Brewmaster any zymurgy, physics, or troubleshooting question..."
                  className="flex-1 px-3 py-2 rounded hw-well border border-white/10 text-xs font-sans text-white focus:border-cyan-400 outline-none placeholder:text-slate-600"
                />
                <button
                  type="submit"
                  className="p-2 rounded bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition shrink-0"
                  title="Send Question"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
