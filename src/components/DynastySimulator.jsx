import React, { useState, useMemo } from 'react';
import { useTerminology } from '../context/TerminologyContext';
import { MASTER_KITS } from '../data/kits';
import { simulateFermentation } from '../utils/physicsEngine';
import VesselCrossSection from './VesselCrossSection';
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer
} from 'recharts';
import {
  Sliders,
  Thermometer,
  Wind,
  ShieldCheck,
  AlertOctagon,
  Clock,
  Snowflake,
  Activity,
  Zap,
  Heart,
  Award,
  Layers,
  Sparkles,
  Info,
  Beaker,
  Check,
  ChevronDown,
  ChevronUp,
  Play,
  RotateCcw
} from 'lucide-react';

export default function DynastySimulator({ initialKit, customKits = [], onPitchBatch }) {
  const { mode, t } = useTerminology();

  const allKits = [...customKits, ...MASTER_KITS];

  // 7 Master Controls State
  const [selectedKitId, setSelectedKitId] = useState(initialKit?.id || MASTER_KITS[0].id);
  const [tempF, setTempF] = useState(72);
  const [airPocketMl, setAirPocketMl] = useState(1200);
  const [aerationProtocol, setAerationProtocol] = useState('dual_vector'); // 'gentle' | 'standard' | 'dual_vector'
  const [shake90Min, setShake90Min] = useState(true);
  const [conicalInstalled, setConicalInstalled] = useState(true);
  const [undockTau, setUndockTau] = useState(1.15);
  const [fridgeHours, setFridgeHours] = useState(84);

  // Progressive Disclosure: Toggle for Advanced Biophysics Controls
  const [showAdvancedControls, setShowAdvancedControls] = useState(false);

  // Interactive 4D Biological Timeline Scrubber State (0.0 to 2.6: 0.0-1.6 tau, 1.6-2.6 fridge days)
  const [scrubbedTimeline, setScrubbedTimeline] = useState(1.15);

  // Active Sub-View Tab: 'dynasty' | 'metabolic' | 'vessel' | 'soma'
  const [activeSubView, setActiveSubView] = useState('dynasty');

  const selectedKit = allKits.find((k) => k.id === selectedKitId) || MASTER_KITS[0];

  // Run the Multi-Physics Simulation
  const simulation = useMemo(() => {
    return simulateFermentation({
      kit: selectedKit,
      tempF,
      airPocketMl,
      aerationProtocol,
      shake90Min,
      conicalInstalled,
      undockTau,
      fridgeHours,
    });
  }, [selectedKit, tempF, airPocketMl, aerationProtocol, shake90Min, conicalInstalled, undockTau, fridgeHours]);

  // Compute instantaneous real-time metrics for the scrubbed point along the timeline
  const scrubbedMetrics = useMemo(() => {
    const tau = scrubbedTimeline;
    const isFridge = tau > 1.6;
    const fridgeDay = isFridge ? Math.round((tau - 1.6) / 0.2) : 0;

    // Fermentation attenuation progress (0.0 to 1.0)
    let progress = 0;
    if (tau <= 1.0) {
      progress = Math.pow(tau / 1.0, 1.3) * 0.90; // 90% consumed by 1.0 tau
    } else if (tau <= 1.6) {
      progress = 0.90 + ((tau - 1.0) / 0.6) * 0.10; // finishes secondary
    } else {
      progress = 1.0;
    }

    const maxAbv = selectedKit.abv || 6.2;
    const currentAbv = Number((maxAbv * progress).toFixed(1));
    const currentSg = Number((1.055 - progress * 0.043).toFixed(3));
    const pressurePsi = tau < 0.2 ? Math.round(tau * 40) : 15;
    const activeDaughters = tau <= 0.4
      ? Math.round(tau * 45)
      : Math.round(Math.min(32, 18 + tau * 10));

    let phaseName = '0.0τ Pitch Point';
    if (tau > 0.0 && tau < 0.4) phaseName = 'Early Aerobic Budding';
    else if (tau >= 0.4 && tau < 0.8) phaseName = 'Peak Primary & Krausen Crest';
    else if (tau >= 0.8 && tau < 1.05) phaseName = '1.00τ Metabolic Horizon (Quiet Hiss)';
    else if (tau >= 1.05 && tau <= 1.35) phaseName = 'Daughter Polish Rest Window';
    else if (tau > 1.35 && tau <= 1.6) phaseName = 'Terminal Secondary Conditioning';
    else if (isFridge) phaseName = `Cold Conditioning (Fridge Day ${fridgeDay})`;

    return {
      tau,
      isFridge,
      fridgeDay,
      currentAbv,
      currentSg,
      pressurePsi,
      activeDaughters,
      phaseName
    };
  }, [scrubbedTimeline, selectedKit]);

  // Preset Shortcuts
  const applyPreset = (preset) => {
    if (preset === 'soma_max') {
      setUndockTau(1.15);
      setAerationProtocol('dual_vector');
      setShake90Min(true);
      setConicalInstalled(true);
      setFridgeHours(84);
      setAirPocketMl(1200);
      setScrubbedTimeline(1.15);
    } else if (preset === 'crowd_harmonic') {
      setUndockTau(1.30);
      setAerationProtocol('standard');
      setShake90Min(false);
      setConicalInstalled(true);
      setFridgeHours(120);
      setScrubbedTimeline(1.30);
    } else if (preset === 'accidental_yeast_bomb') {
      setConicalInstalled(false); // Missing funnel
      setAirPocketMl(750); // Low headspace
      setUndockTau(0.90);  // Premature undock
      setFridgeHours(24);   // Barely chilled
      setScrubbedTimeline(0.90);
    }
  };

  // Custom Chart Tooltip
  const CustomChartTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="hw-panel p-2.5 rounded text-xs font-mono-tabular border border-white/20 shadow-2xl backdrop-blur-md">
          <p className="text-slate-300 font-bold mb-1 border-b border-white/10 pb-0.5">{label}</p>
          {payload.map((entry, index) => (
            <div key={`item-${index}`} className="flex items-center justify-between space-x-3 py-0.5">
              <span style={{ color: entry.color }} className="font-medium">
                {entry.name}:
              </span>
              <span className="text-white font-bold">
                {entry.value}
                {entry.unit || ''}
              </span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-5">
      {/* Module Title Banner & Preset Bank */}
      <div className="hw-panel p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 text-xs font-mono-tabular mb-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span className="tracking-widest uppercase font-semibold">CERN-Grade Zymurgy Kinetics Engine</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">NON-EQUILIBRIUM DYNAMICS</span>
          </div>
          <h2 className="text-2xl font-bold font-display text-white tracking-tight">
            {mode === 'biophysics'
              ? 'Multi-Physics Bioreactor Flight Deck & Yeast Dynasty'
              : 'The Living Yeast Civilization & Breath Chamber'}
          </h2>
          <p className="text-xs text-slate-300 mt-0.5 max-w-2xl leading-relaxed">
            Real-time simulation of Henry&apos;s Law oxygen transfer, G₀ mother cell Stokes settling, G₄ daughter viability, and 15 PSI containment.
          </p>
        </div>

        {/* Quick Simulation Presets */}
        <div className="flex items-center space-x-2 shrink-0 font-mono-tabular text-xs">
          <button
            onClick={() => applyPreset('soma_max')}
            className="hw-btn px-2.5 py-1.5 rounded text-cyan-300 border border-cyan-500/40 hover:border-cyan-400 transition"
          >
            Soma-Max (1.15&tau;)
          </button>
          <button
            onClick={() => applyPreset('crowd_harmonic')}
            className="hw-btn px-2.5 py-1.5 rounded text-amber-300 border border-amber-500/40 hover:border-amber-400 transition"
          >
            Crowd-Harmonic (1.30&tau;)
          </button>
          <button
            onClick={() => applyPreset('accidental_yeast_bomb')}
            className="hw-btn px-2.5 py-1.5 rounded text-rose-300 border border-rose-500/40 hover:border-rose-400 transition"
          >
            💥 Yeast Bomb Error
          </button>
        </div>
      </div>

      {/* Split-Screen Flight Deck (12 Cols: 4 Cols Fader Rack + 8 Cols Display) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Column (4 Cols): The Streamlined Fader Rack with Progressive Disclosure */}
        <div className="lg:col-span-4 hw-panel p-4 space-y-4">
          <div className="flex items-center justify-between pb-2.5 border-b border-white/10">
            <span className="font-mono-tabular text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center space-x-1.5">
              <Sliders className="w-4 h-4" />
              <span>Core Telemetry Controls</span>
            </span>
            <span className="text-[10px] font-mono-tabular text-slate-500">
              TEENAGE_ENG_CONSOLE
            </span>
          </div>

          <div className="space-y-3 text-xs font-mono-tabular">
            {/* CH.01 // BASELINE RECIPE */}
            <div className="hw-well p-3 rounded space-y-1.5">
              <div className="flex items-center justify-between text-slate-400 text-[10px] uppercase">
                <span>CH.01 // ACTIVE BASELINE</span>
                <span className="text-cyan-400 font-bold">KIT #{selectedKit.id?.slice(0, 8)}</span>
              </div>
              <select
                value={selectedKitId}
                onChange={(e) => setSelectedKitId(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded hw-well border border-white/10 text-white font-mono-tabular text-xs focus:border-cyan-400 outline-none"
              >
                {allKits.map((k) => (
                  <option key={k.id} value={k.id} className="bg-[#0B0E14] text-white">
                    {k.name} ({k.abv}% ABV)
                  </option>
                ))}
              </select>
              <div className="flex justify-between text-[10px] text-slate-400 pt-0.5">
                <span>Base &tau;: {selectedKit.baseTau}h</span>
                <span className="text-cyan-300 truncate max-w-[140px]">{selectedKit.yeast?.strain}</span>
              </div>
            </div>

            {/* CH.02 // AMBIENT TEMPERATURE */}
            <div className="hw-well p-3 rounded space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-[10px] uppercase flex items-center space-x-1">
                  <Thermometer className="w-3.5 h-3.5 text-amber-400" />
                  <span>CH.02 // {mode === 'biophysics' ? 'AMBIENT TEMP (T_amb)' : 'ROOM WARMTH'}</span>
                </span>
                <span className="px-2 py-0.5 rounded hw-well text-amber-300 font-bold border border-amber-500/30">
                  {tempF}.0 °F
                </span>
              </div>
              <input
                type="range"
                min="60"
                max="82"
                value={tempF}
                onChange={(e) => setTempF(parseInt(e.target.value, 10))}
                className="hw-fader"
              />
              <div className="flex justify-between text-[9px] text-slate-500">
                <span>60°F [SLOW_STOKES]</span>
                <span className="text-amber-400 font-semibold">72°F [OPTIMAL]</span>
                <span>82°F [FUSEL_RISK]</span>
              </div>
            </div>

            {/* CH.03 // UNDOCKING TIMING */}
            <div className="hw-well p-3 rounded space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-[10px] uppercase flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  <span>CH.03 // {mode === 'biophysics' ? 'UNDOCK COORDINATE' : 'DROP THE DOCK'}</span>
                </span>
                <span className="px-2 py-0.5 rounded hw-well text-cyan-300 font-bold border border-cyan-500/30">
                  {undockTau.toFixed(2)} &tau;
                </span>
              </div>
              <input
                type="range"
                min="0.80"
                max="1.60"
                step="0.05"
                value={undockTau}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setUndockTau(val);
                  setScrubbedTimeline(val);
                }}
                className="hw-fader"
              />
              <div className="flex justify-between text-[9px] text-slate-500">
                <span>0.80&tau; [PREMATURE]</span>
                <span className="text-cyan-400 font-semibold">1.15&tau; [SOMA_MAX]</span>
                <span>1.60&tau; [CLEAR]</span>
              </div>
            </div>

            {/* CH.04 // COLD LOCK FRIDGE HOURS */}
            <div className="hw-well p-3 rounded space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 text-[10px] uppercase flex items-center space-x-1">
                  <Snowflake className="w-3.5 h-3.5 text-blue-400" />
                  <span>CH.04 // {mode === 'biophysics' ? 'STOKES-HENRY COLD LOCK' : 'FRIDGE HOURS'}</span>
                </span>
                <span className="px-2 py-0.5 rounded hw-well text-blue-300 font-bold border border-blue-500/30">
                  {fridgeHours}h ({(fridgeHours / 24).toFixed(1)}d)
                </span>
              </div>
              <input
                type="range"
                min="12"
                max="360"
                step="12"
                value={fridgeHours}
                onChange={(e) => setFridgeHours(parseInt(e.target.value, 10))}
                className="hw-fader"
              />
              <div className="flex justify-between text-[9px] text-slate-500">
                <span>12h [CLOUDY]</span>
                <span className="text-blue-400 font-semibold">84h [3.5d STD]</span>
                <span>168h [7d LAGER]</span>
              </div>
            </div>

            {/* PROGRESSIVE DISCLOSURE TOGGLE: ADVANCED BIOPHYSICS PARAMETERS */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setShowAdvancedControls(!showAdvancedControls)}
                className="w-full py-2 px-3 rounded-md hw-well border border-white/10 hover:border-cyan-500/40 text-slate-300 hover:text-white flex items-center justify-between text-[11px] font-mono-tabular transition"
              >
                <span className="flex items-center space-x-2">
                  <Beaker className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Advanced Biophysics Controls (4)</span>
                </span>
                {showAdvancedControls ? (
                  <ChevronUp className="w-4 h-4 text-cyan-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </button>

              {/* Collapsible Advanced Parameters */}
              {showAdvancedControls && (
                <div className="mt-3 space-y-3 pt-1 border-t border-white/10 animate-fade-in">
                  {/* ADV.01 // HEADSPACE AIR POCKET */}
                  <div className="hw-well p-3 rounded space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400 text-[10px] uppercase flex items-center space-x-1">
                        <Wind className="w-3.5 h-3.5 text-cyan-400" />
                        <span>HEADSPACE POCKET (AIR_ML)</span>
                      </span>
                      <span className="px-2 py-0.5 rounded hw-well text-cyan-300 font-bold border border-cyan-500/30">
                        {airPocketMl} mL
                      </span>
                    </div>
                    <input
                      type="range"
                      min="600"
                      max="1600"
                      step="50"
                      value={airPocketMl}
                      onChange={(e) => setAirPocketMl(parseInt(e.target.value, 10))}
                      className="hw-fader"
                    />
                    <div className="flex justify-between text-[9px] text-slate-500">
                      <span className="text-rose-400">600 mL [BLOWOUT]</span>
                      <span className="text-cyan-400 font-semibold">1,200 mL [STD]</span>
                      <span>1,600 mL [HIGH_O2]</span>
                    </div>
                  </div>

                  {/* ADV.02 // AERATION PROTOCOL */}
                  <div className="hw-well p-3 rounded space-y-1.5">
                    <span className="text-slate-400 text-[10px] uppercase block">
                      AERATION AGITATION PROTOCOL
                    </span>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[
                        { id: 'gentle', label: 'Gentle (30s)' },
                        { id: 'standard', label: 'Standard (2m)' },
                        { id: 'dual_vector', label: 'Dual-Vector' }
                      ].map((p) => (
                        <button
                          key={p.id}
                          onClick={() => setAerationProtocol(p.id)}
                          className={`p-1.5 rounded text-[10px] font-mono-tabular border transition ${aerationProtocol === p.id
                              ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/60 font-bold'
                              : 'hw-well text-slate-400 border-white/5 hover:text-white'
                            }`}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* ADV.03 // 90-MIN POST-PITCH SWIRL */}
                  <div className="hw-well p-3 rounded flex items-center justify-between">
                    <div>
                      <span className="text-white font-medium block text-xs">90-Min Post-Pitch Swirl</span>
                      <span className="text-[10px] text-slate-400 block">+14% Replicative Gn Transfer</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShake90Min(!shake90Min)}
                      className={`px-3 py-1 rounded text-xs font-mono-tabular border font-bold transition ${shake90Min
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                          : 'hw-well text-slate-500 border-white/10'
                        }`}
                    >
                      {shake90Min ? 'ACTIVE' : 'OFF'}
                    </button>
                  </div>

                  {/* ADV.04 // CONICAL TRUB FUNNEL */}
                  <div className="hw-well p-3 rounded flex items-center justify-between">
                    <div>
                      <span className="text-white font-medium block text-xs">Conical Funnel Installed</span>
                      <span className="text-[10px] text-slate-400 block">Strips 92% mother trub</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setConicalInstalled(!conicalInstalled)}
                      className={`px-3 py-1 rounded text-xs font-mono-tabular border font-bold transition ${conicalInstalled
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50'
                          : 'bg-rose-950/40 text-rose-300 border-rose-500/60'
                        }`}
                    >
                      {conicalInstalled ? 'LOCKED ✓' : 'MISSING ⚠️'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column (8 Cols): 4D Phase Scrubber, Telemetry & Sub-Views */}
        <div className="lg:col-span-8 space-y-4">
          {/* THE 4D FERMENTATION PHASE SCRUBBER (SOUPED-UP VIZ HUD) */}
          <div className="hw-panel p-4 space-y-3 border-cyan-500/30 shadow-[0_0_20px_rgba(0,240,255,0.12)]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></span>
                <span className="font-mono-tabular text-xs font-bold text-white uppercase tracking-wider flex items-center space-x-1.5">
                  <Zap className="w-4 h-4 text-cyan-400" />
                  <span>4D Biological Time Scrubber</span>
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono-tabular bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {scrubbedMetrics.phaseName}
                </span>
              </div>

              {/* Preset Scrub Points */}
              <div className="flex items-center space-x-1 text-[10px] font-mono-tabular">
                <button
                  onClick={() => setScrubbedTimeline(0.0)}
                  className="px-2 py-0.5 rounded hw-well border border-white/10 hover:border-cyan-400 text-slate-300 transition"
                >
                  0.0τ Pitch
                </button>
                <button
                  onClick={() => setScrubbedTimeline(0.6)}
                  className="px-2 py-0.5 rounded hw-well border border-white/10 hover:border-cyan-400 text-slate-300 transition"
                >
                  0.6τ Krausen
                </button>
                <button
                  onClick={() => setScrubbedTimeline(1.0)}
                  className="px-2 py-0.5 rounded hw-well border border-white/10 hover:border-cyan-400 text-slate-300 transition"
                >
                  1.0τ Horizon
                </button>
                <button
                  onClick={() => setScrubbedTimeline(1.25)}
                  className="px-2 py-0.5 rounded hw-well border border-white/10 hover:border-cyan-400 text-slate-300 transition"
                >
                  1.25τ Polish
                </button>
                <button
                  onClick={() => setScrubbedTimeline(2.3)}
                  className="px-2 py-0.5 rounded hw-well border border-white/10 hover:border-cyan-400 text-slate-300 transition"
                >
                  ❄️ Cold Lock
                </button>
              </div>
            </div>

            {/* Interactive Timeline Fader */}
            <div className="space-y-1">
              <input
                type="range"
                min="0.0"
                max="2.6"
                step="0.05"
                value={scrubbedTimeline}
                onChange={(e) => setScrubbedTimeline(parseFloat(e.target.value))}
                className="hw-fader h-3"
              />
              <div className="flex justify-between text-[9px] font-mono-tabular text-slate-500 pt-0.5">
                <span>0.0τ [Pitch Point]</span>
                <span className="text-amber-400">1.0τ [Horizon]</span>
                <span className="text-cyan-400">1.25τ [Polish Undock]</span>
                <span className="text-blue-400">Fridge D1 &rarr; D5 [Cold Lock]</span>
              </div>
            </div>

            {/* Real-Time Telemetry HUD updating with scrubber */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1 text-xs font-mono-tabular">
              <div className="hw-well p-2 rounded">
                <span className="text-[10px] text-slate-500 block uppercase">Gravity SG</span>
                <span className="font-bold text-white text-sm">{scrubbedMetrics.currentSg}</span>
              </div>
              <div className="hw-well p-2 rounded">
                <span className="text-[10px] text-slate-500 block uppercase">Current ABV</span>
                <span className="font-bold text-cyan-300 text-sm">{scrubbedMetrics.currentAbv}%</span>
              </div>
              <div className="hw-well p-2 rounded">
                <span className="text-[10px] text-slate-500 block uppercase">Headspace PSI</span>
                <span className="font-bold text-amber-300 text-sm">{scrubbedMetrics.pressurePsi} PSI</span>
              </div>
              <div className="hw-well p-2 rounded">
                <span className="text-[10px] text-slate-500 block uppercase">Live G4 Daughters</span>
                <span className="font-bold text-emerald-300 text-sm">{scrubbedMetrics.activeDaughters} B/pint</span>
              </div>
              <div className="hw-well p-2 rounded col-span-2 sm:col-span-1">
                <span className="text-[10px] text-slate-500 block uppercase">Diacetyl Status</span>
                <span className="font-bold text-purple-300 text-sm">
                  {scrubbedTimeline < 0.8 ? 'Accumulating' : scrubbedTimeline <= 1.25 ? 'Clearing (-55%)' : 'Locked & Polished'}
                </span>
              </div>
            </div>
          </div>

          {/* Sub-View Navigation Tabs */}
          <div className="hw-panel p-1.5 flex items-center space-x-1.5 overflow-x-auto text-xs font-mono-tabular">
            <button
              onClick={() => setActiveSubView('dynasty')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded transition ${activeSubView === 'dynasty'
                  ? 'hw-well text-cyan-300 border border-cyan-400/60 font-semibold shadow-[0_0_12px_rgba(0,240,255,0.2)]'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>VIEW A: DYNASTY &amp; SETTLING (G₀ &rarr; G₄)</span>
            </button>

            <button
              onClick={() => setActiveSubView('metabolic')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded transition ${activeSubView === 'metabolic'
                  ? 'hw-well text-cyan-300 border border-cyan-400/60 font-semibold shadow-[0_0_12px_rgba(0,240,255,0.2)]'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>VIEW B: METABOLIC IMPRINT</span>
            </button>

            <button
              onClick={() => setActiveSubView('vessel')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded transition ${activeSubView === 'vessel'
                  ? 'hw-well text-cyan-300 border border-cyan-400/60 font-semibold shadow-[0_0_12px_rgba(0,240,255,0.2)]'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
            >
              <Zap className="w-3.5 h-3.5" />
              <span>VIEW C: CAD PINTER CUTAWAY</span>
            </button>

            <button
              onClick={() => setActiveSubView('soma')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded transition ${activeSubView === 'soma'
                  ? 'hw-well text-cyan-300 border border-cyan-400/60 font-semibold shadow-[0_0_12px_rgba(0,240,255,0.2)]'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
            >
              <Heart className="w-3.5 h-3.5" />
              <span>VIEW D: SOMA-CARD NUTRITION</span>
            </button>
          </div>

          {/* Sub-View Content Display */}
          <div>
            {/* VIEW A: GENERATIONAL DYNASTY & SETTLING CURVE */}
            {activeSubView === 'dynasty' && (
              <div className="hw-panel p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-white/10">
                  <div>
                    <h4 className="font-display text-sm font-bold text-white flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-yellow-400 shadow-[0_0_8px_#FACC15]"></span>
                      <span>
                        {mode === 'biophysics'
                          ? 'Yeast Generational Dynasty & Stokes Settling (G₀ Mothers vs G₄ Daughters)'
                          : 'Living Yeast Family Tree (Old Mothers Falling to Dock vs Youthful Daughters)'}
                      </span>
                    </h4>
                    <p className="text-xs text-slate-400 font-mono-tabular mt-0.5">
                      Gn = <strong className="text-cyan-300">{simulation.physics.Gn}</strong> generations
                      yields ~<strong className="text-yellow-300">{simulation.nutrition.suspendedG4PerPint} Billion</strong> live G₄ daughter cells suspended per pint.
                    </p>
                  </div>

                  <div className="flex items-center space-x-3 text-xs font-mono-tabular">
                    <div className="flex items-center space-x-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-yellow-400"></span>
                      <span className="text-yellow-300">G₄ Daughters (Silk/GSH)</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                      <span className="text-rose-300">G₀ Mothers &amp; Trub</span>
                    </div>
                  </div>
                </div>

                <div className="h-72 w-full hw-well p-2 rounded">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={simulation.charts.timeSeriesDynasty}>
                      <defs>
                        <linearGradient id="g4GradOverhaul" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#F5B041" stopOpacity={0.85} />
                          <stop offset="95%" stopColor="#F5B041" stopOpacity={0.05} />
                        </linearGradient>
                        <linearGradient id="motherGradOverhaul" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#F43F5E" stopOpacity={0.85} />
                          <stop offset="95%" stopColor="#F43F5E" stopOpacity={0.05} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
                      <XAxis dataKey="phase" stroke="#64748B" tick={{ fontSize: 11, fontFamily: 'monospace' }} />
                      <YAxis stroke="#64748B" tick={{ fontSize: 11, fontFamily: 'monospace' }} />
                      <Tooltip content={<CustomChartTooltip />} />
                      <ReferenceLine x="Undock (1.15τ)" stroke="#00F0FF" strokeDasharray="3 3" label={{ value: 'UNDOCK', fill: '#00F0FF', fontSize: 10, fontFamily: 'monospace' }} />
                      <Area
                        type="monotone"
                        dataKey="g4Daughters"
                        name={mode === 'biophysics' ? 'G4 Daughters (% Live)' : 'Youthful Daughters (% Live)'}
                        stroke="#F5B041"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#g4GradOverhaul)"
                      />
                      <Area
                        type="monotone"
                        dataKey="motherCellsTrub"
                        name={mode === 'biophysics' ? 'G0 Mothers & Trub' : 'Old Mothers & Hop Sludge'}
                        stroke="#F43F5E"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#motherGradOverhaul)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                <div className="hw-well p-3 rounded text-xs font-mono-tabular text-slate-300 space-y-1">
                  <span className="text-cyan-400 font-bold block uppercase tracking-wider">Hydrodynamic Principle:</span>
                  <p className="leading-relaxed">
                    {conicalInstalled ? (
                      <>
                        With the <strong>Conical Funnel LOCKED</strong>, dense scarred G₀/G₁ mother cells and heavy hop polyphenols slip down the steep 45° funnel walls into the Brewing Dock during the first 1.0&tau; of primary fermentation. Undocking cleanly eliminates 92% of harsh tannins, leaving vibrant, unscarred G₄   daughters suspended in the beer to reabsorb diacetyl and synthesize bioavailable glutathione.
                      </>
                    ) : (
                      <span className="text-rose-300">
                        ⚠️ <strong>CRITICAL WARNING: Conical Funnel is MISSING!</strong> Without the hydrodynamic funnel barrier, 75% of mother cells and hop sediment wash violently back into the liquid during undocking. This generates severe phenolic trub drag (throat scrape) and bitter astringency.
                      </span>
                    )}
                  </p>
                </div>
              </div>
            )}

            {/* VIEW B: METABOLIC IMPRINT & BOTANICAL VECTOR */}
            {activeSubView === 'metabolic' && (
              <div className="hw-panel p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-white/10">
                  <div>
                    <h4 className="font-display text-sm font-bold text-white flex items-center space-x-2">
                      <span className="w-2 h-2 rounded-full bg-purple-400 shadow-[0_0_8px_#C084FC]"></span>
                      <span>
                        {mode === 'biophysics'
                          ? 'Metabolic Intermediate Decay & 15 PSI Terpene Retention'
                          : 'Butterscotch & Green-Apple Cleanup vs Fresh Aroma Wave'}
                      </span>
                    </h4>
                    <p className="text-xs text-slate-400 font-mono-tabular mt-0.5">
                      Diacetyl Cushion: <strong className="text-amber-400">{simulation.scores.dc}/10</strong> |
                      Acetaldehyde Snap: <strong className="text-emerald-400">{simulation.scores.as}/10</strong> |
                      Terpene Lift: <strong className="text-purple-400">{simulation.scores.aroma}/10</strong>
                    </p>
                  </div>

                  <div className="flex items-center space-x-3 text-[11px] font-mono-tabular">
                    <span className="text-amber-400">&bull; Diacetyl (Dc)</span>
                    <span className="text-emerald-400">&bull; Acetaldehyde (As)</span>
                    <span className="text-purple-400">&bull; Terpene Lift (TL)</span>
                    <span className="text-rose-400">&bull; Trub Drag (PD)</span>
                  </div>
                </div>

                <div className="h-72 w-full hw-well p-2 rounded">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={simulation.charts.timeSeriesMetabolic}>
                      <CartesianGrid stroke="rgba(255,255,255,0.05)" strokeDasharray="3 3" />
                      <XAxis dataKey="phase" stroke="#64748B" tick={{ fontSize: 11, fontFamily: 'monospace' }} />
                      <YAxis domain={[0, 10]} stroke="#64748B" tick={{ fontSize: 11, fontFamily: 'monospace' }} />
                      <Tooltip content={<CustomChartTooltip />} />
                      <Line type="monotone" dataKey="diacetyl" name="Diacetyl (Dc)" stroke="#F5B041" strokeWidth={2.5} dot={{ r: 3 }} />
                      <Line type="monotone" dataKey="acetaldehyde" name="Acetaldehyde (As)" stroke="#10B981" strokeWidth={2.5} dot={{ r: 3 }} />
                      <Line type="monotone" dataKey="terpeneLift" name="Terpene Lift (TL)" stroke="#A855F7" strokeWidth={2.5} dot={{ r: 3 }} />
                      <Line type="monotone" dataKey="phenolicDrag" name="Trub Drag (PD)" stroke="#F43F5E" strokeWidth={2} strokeDasharray="4 4" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono-tabular">
                  <div className="hw-well p-3 rounded border border-amber-500/30">
                    <span className="text-amber-300 font-bold block mb-1">
                      {t('polish_phase')}
                    </span>
                    <p className="text-slate-400 leading-relaxed">
                      Between 1.00&tau; and 1.25&tau;, yeast re-absorbs diacetyl and reduces green-apple acetaldehyde into ethanol. Undocking at 1.15&tau; preserves the ideal &ldquo;Soma-Max&rdquo; creamsicle cushion.
                    </p>
                  </div>

                  <div className="hw-well p-3 rounded border border-purple-500/30">
                    <span className="text-purple-300 font-bold block mb-1">
                      15 PSI Pressure Containment
                    </span>
                    <p className="text-slate-400 leading-relaxed">
                      Unlike traditional open fermenters that blow off aromatic terpenes through airlocks, the Pinter&apos;s 15 PSI pressure cap traps 85-95% of delicate monoterpenes and citrus hop oils.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* VIEW C: INTERACTIVE CAD VESSEL CUTAWAY (WITH TIMELINE SCRUB REACTIVITY) */}
            {activeSubView === 'vessel' && (
              <VesselCrossSection simulationData={simulation} scrubbedTau={scrubbedTimeline} />
            )}

            {/* VIEW D: LIVE 500mL PINT NUTRITION & SOMA-CARD */}
            {activeSubView === 'soma' && (
              <div className="hw-panel p-5 space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
                  <div>
                    <span className="text-xs font-mono-tabular text-cyan-400 uppercase tracking-wider block">
                      Bio-Energetic Nutrition Telemetry
                    </span>
                    <h3 className="text-xl font-bold font-display text-white mt-0.5">
                      Live 500 mL Pint Nutrition &amp; Soma-Card
                    </h3>
                  </div>

                  <div className="hw-well px-3 py-1.5 rounded border border-yellow-500/40 text-yellow-300 font-mono-tabular text-xs font-bold flex items-center space-x-1.5 shadow-[0_0_12px_rgba(250,204,21,0.25)]">
                    <Sparkles className="w-4 h-4 text-yellow-400" />
                    <span>
                      {t('axis_5', 'short')}: {simulation.scores.buzz} / 10
                    </span>
                  </div>
                </div>

                {/* Nutrition Telemetry Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono-tabular">
                  {/* Total Pint Calories */}
                  <div className="hw-well p-3.5 rounded space-y-1">
                    <span className="text-slate-400 text-[10px] uppercase block">Total Pint Calories</span>
                    <span className="text-2xl font-bold text-white block">
                      {simulation.nutrition.totalPintCalories} kcal
                    </span>
                    <div className="text-[10px] text-slate-500 pt-1 border-t border-white/5 space-y-0.5">
                      <div className="flex justify-between">
                        <span>Base Wort &amp; EtOH:</span>
                        <span className="text-slate-300 font-semibold">{simulation.nutrition.baseWortKcalPerPint} kcal</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Suspended Live Yeast:</span>
                        <span className="text-yellow-400 font-semibold">+{simulation.nutrition.yeastKcalPerPint} kcal</span>
                      </div>
                    </div>
                  </div>

                  {/* Suspended Live G4 Cells */}
                  <div className="hw-well p-3.5 rounded space-y-1">
                    <span className="text-slate-400 text-[10px] uppercase block">Suspended Live G₄ Cells</span>
                    <span className="text-2xl font-bold text-yellow-300 block">
                      {simulation.nutrition.suspendedG4PerPint} B
                    </span>
                    <p className="text-[10px] text-slate-500 pt-1 border-t border-white/5">
                      Billions of unscarred   daughter cells with smooth, unoxidized lipid membranes.
                    </p>
                  </div>

                  {/* Bioavailable B-Complex */}
                  <div className="hw-well p-3.5 rounded space-y-1">
                    <span className="text-slate-400 text-[10px] uppercase block">Bioavailable B-Complex</span>
                    <span className="text-2xl font-bold text-cyan-300 block">
                      {simulation.nutrition.bComplexPctDv}% DV
                    </span>
                    <p className="text-[10px] text-slate-500 pt-1 border-t border-white/5">
                      Synthesized Thiamine (B₁), Riboflavin (B₂), Niacin (B₃), Pyridoxine (B₆), and Folate (B₉).
                    </p>
                  </div>

                  {/* Active Glutathione (GSH) */}
                  <div className="hw-well p-3.5 rounded space-y-1">
                    <span className="text-slate-400 text-[10px] uppercase block">Active Glutathione (GSH)</span>
                    <span className="text-2xl font-bold text-emerald-300 block">
                      {simulation.nutrition.gshMgPerPint} mg
                    </span>
                    <p className="text-[10px] text-slate-500 pt-1 border-t border-white/5">
                      Tripeptide master antioxidant buffering acetaldehyde metabolism and protecting hepatocytes.
                    </p>
                  </div>
                </div>

                {/* Dynamic Tasting Summary */}
                <div className="hw-well p-4 rounded space-y-2">
                  <span className="font-mono-tabular text-xs font-bold text-slate-300 flex items-center space-x-1.5">
                    <Award className="w-4 h-4 text-cyan-400" />
                    <span>
                      {mode === 'biophysics' ? 'Dynamic Soma-Kinetic Tasting Report' : 'The Living-Rhythm Experience Report'}
                    </span>
                  </span>

                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {mode === 'biophysics' ? (
                      <>
                        At <strong>{tempF}&deg;F</strong> ambient temperature and an undock biological coordinate of <strong>{undockTau.toFixed(2)}&tau;</strong>, this batch achieves a <strong>Gn replicative factor of {simulation.physics.Gn}</strong>.
                        {conicalInstalled ? (
                          ` The conical filter effectively sequesters 92% of chitin-scarred mother cells into the dock. Suspended   daughter cells yield a low diacetyl cushion (Dc ${simulation.scores.dc}/10) with elevated glutathione (${simulation.nutrition.gshMgPerPint} mg GSH) buffering ethanol toxicity. Carbonic velocity is rated at ${simulation.scores.carb}/10 with negligible phenolic drag.`
                        ) : (
                          ` CAUTION: With the conical funnel absent, backward shear carries 75% of trub back into the liquid, driving phenolic trub drag (PD ${simulation.scores.drag}/10) and masking hop terpenes.`
                        )}
                      </>
                    ) : (
                      <>
                        Brewing this batch at a comfortable <strong>{tempF}&deg;F</strong> and letting the yeast breathe until <strong>{undockTau.toFixed(2)} breaths</strong> creates a remarkably vibrant pour.
                        {conicalInstalled ? (
                          ` Because your sludge guard funnel was in place, all the harsh hop grit stayed trapped in the dock. You get a heavenly velvet smoothie mouthfeel, soft butterscotch warmth without any throat burn, and a glowing, happy buzz with ${simulation.nutrition.bComplexPctDv}% of your daily B-vitamins.`
                        ) : (
                          ` Watch out: you forgot the sludge guard funnel! The bottom sludge washed back into the beer, giving it a rough throat scrape and masking all the juicy fruit aromas.`
                        )}
                      </>
                    )}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
