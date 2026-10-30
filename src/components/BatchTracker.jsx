import React, { useState, useEffect } from 'react';
import { useTerminology } from '../context/TerminologyContext';
import { MASTER_KITS } from '../data/kits';
import { sounds } from '../utils/audioEffects';
import confetti from 'canvas-confetti';
import { 
  Timer, 
  Plus, 
  Trash2, 
  Clock, 
  Snowflake, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Calendar, 
  Share2, 
  Printer, 
  Wind,
  Check,
  Edit2,
  Activity,
  Flame,
  Droplets
} from 'lucide-react';

export default function BatchTracker({ customKits = [], onSelectForSimulator }) {
  const { mode, t } = useTerminology();
  const allKits = [...customKits, ...MASTER_KITS];

  // Batches state persisted in localStorage
  const [batches, setBatches] = useState(() => {
    try {
      const saved = localStorage.getItem('chrono_zymo_batches');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Could not load batches from localStorage:', e);
    }
    const now = new Date();
    const pitchDate = new Date(now.getTime() - 24 * 3600 * 1000);
    const targetTap = new Date(now.getTime() + 5 * 24 * 3600 * 1000);

    return [
      {
        id: 'pinter-1',
        pinterName: 'PINTER // 01 (CARBON ONYX)',
        kitId: MASTER_KITS[0].id, // Flagship Hazy Tau IPA

        pitchTimestamp: pitchDate.toISOString().slice(0, 16),
        ambientTempF: 72,
        determinationMode: 'auto',
        observedTauTimestamp: '',
        targetTrack: 'soma_max',
        customUndockMultiplier: 1.15,
        targetTapTimestamp: targetTap.toISOString().slice(0, 16),
        notes: 'Dual-vector aeration complete. 90-min post-pitch swirl executed.',
        isUndocked: false,
        isChilled: false,
      },
      {
        id: 'pinter-2',
        pinterName: 'PINTER // 02 (FROST WHITE)',
        kitId: MASTER_KITS[7].id, // En Casa Mexican Lager
        pitchTimestamp: new Date(now.getTime() - 48 * 3600 * 1000).toISOString().slice(0, 16),
        ambientTempF: 68,
        determinationMode: 'auto',
        observedTauTimestamp: '',
        targetTrack: 'crowd_harmonic',
        customUndockMultiplier: 1.40,
        targetTapTimestamp: new Date(now.getTime() + 9 * 24 * 3600 * 1000).toISOString().slice(0, 16),
        notes: 'W-34/70 clean lager fermentation under 15 PSI.',
        isUndocked: false,
        isChilled: false,
      }
    ];
  });

  const [activeBatchId, setActiveBatchId] = useState(batches[0]?.id || 'pinter-1');
  const [copiedBatchId, setCopiedBatchId] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Real-time clock update every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Save to localStorage whenever batches update
  useEffect(() => {
    try {
      localStorage.setItem('chrono_zymo_batches', JSON.stringify(batches));
      if (window.electronAPI?.saveConfig) {
        window.electronAPI.saveConfig({ batches });
      }
    } catch (e) {
      console.warn('Could not save batches:', e);
    }
  }, [batches]);

  const activeBatch = batches.find((b) => b.id === activeBatchId) || batches[0];
  const kit = allKits.find((k) => k.id === activeBatch?.kitId) || MASTER_KITS[0];

  // Calculation of batch timeline milestones
  const calculateTimeline = (batch, batchKit) => {
    if (!batch || !batchKit) return null;

    const pitchTime = new Date(batch.pitchTimestamp).getTime();
    if (isNaN(pitchTime)) return null;

    // 1. 90-Min Post Pitch Agitation
    const agitationDate = new Date(pitchTime + 90 * 60 * 1000);

    // 2. Base Tau Hours (Metabolic Horizon)
    const tempDelta = (batch.ambientTempF || 72) - 68;
    const tempMultiplier = Math.max(0.7, Math.min(1.3, 1 - tempDelta * 0.025));
    const estimatedTauHours = batchKit.baseTau * tempMultiplier;

    let horizonTimestamp;
    let effectiveTauHours;

    if (batch.determinationMode === 'observed' && batch.observedTauTimestamp) {
      horizonTimestamp = new Date(batch.observedTauTimestamp).getTime();
      effectiveTauHours = (horizonTimestamp - pitchTime) / (3600 * 1000);
    } else {
      horizonTimestamp = pitchTime + estimatedTauHours * 3600 * 1000;
      effectiveTauHours = estimatedTauHours;
    }

    const horizonDate = new Date(horizonTimestamp);

    // 3. Undock Multipliers
    const somaHours = effectiveTauHours * 1.15;
    const crowdHours = effectiveTauHours * 1.25;

    const somaDate = new Date(pitchTime + somaHours * 3600 * 1000);
    const crowdDate = new Date(pitchTime + crowdHours * 3600 * 1000);

    // Active chosen undock target
    const chosenMultiplier = batch.targetTrack === 'soma_max' ? 1.15 : (batch.targetTrack === 'crowd_harmonic' ? 1.25 : batch.customUndockMultiplier);
    const chosenUndockDate = new Date(pitchTime + effectiveTauHours * chosenMultiplier * 3600 * 1000);

    // 4. Fridge Cold Lock Completion
    const chillHours = batchKit.chillHours || 84;
    const readyDate = new Date(chosenUndockDate.getTime() + chillHours * 3600 * 1000);

    // Target Tap Date
    const targetTapDate = batch.targetTapTimestamp ? new Date(batch.targetTapTimestamp) : readyDate;
    const hoursToTap = (targetTapDate.getTime() - currentTime.getTime()) / (3600 * 1000);

    // Current Progress
    const elapsedHours = (currentTime.getTime() - pitchTime) / (3600 * 1000);
    const currentTau = effectiveTauHours > 0 ? (elapsedHours / effectiveTauHours) : 0;

    // Status Determination
    let phase = 'primary';
    let phaseCode = 'PHASE 01: LOG FERMENTATION';
    let phaseLabel = 'Active Primary Fermentation';
    if (elapsedHours < 1.5) {
      phase = 'aeration';
      phaseCode = 'PHASE 00: O2 DISSOLUTION';
      phaseLabel = 'Post-Pitch Aeration / Lag Phase';
    } else if (currentTau < 1.0) {
      phase = 'primary';
      phaseCode = 'PHASE 01: LOG FERMENTATION';
      phaseLabel = mode === 'biophysics' ? 'Primary Kinetic Conversion' : 'The Vigorous Hiss';
    } else if (currentTau < chosenMultiplier) {
      phase = 'polish';
      phaseCode = 'PHASE 02: DAUGHTER POLISH';
      phaseLabel = mode === 'biophysics' ? 'Daughter Polish Rest (+0.25τ)' : 'The Warm Rest & Sweetening';
    } else if (!batch.isChilled) {
      phase = 'undock_ready';
      phaseCode = 'PHASE 02.5: READY TO UNDOCK';
      phaseLabel = 'Ready to Undock & Chill!';
    } else if (currentTime < readyDate) {
      phase = 'fridge';
      phaseCode = 'PHASE 03: STOKES COLD LOCK';
      phaseLabel = mode === 'biophysics' ? 'Stokes-Henry Cold Lock (38°F)' : 'The Deep Chill & Bubble Lock';
    } else {
      phase = 'ready';
      phaseCode = 'PHASE 04: READY TO TAP';
      phaseLabel = 'Conditioning Complete // Ready to Tap!';
    }

    return {
      pitchDate: new Date(pitchTime),
      agitationDate,
      horizonDate,
      somaDate,
      crowdDate,
      chosenUndockDate,
      readyDate,
      targetTapDate,
      hoursToTap: Number(hoursToTap.toFixed(1)),
      effectiveTauHours: Number(effectiveTauHours.toFixed(1)),
      elapsedHours: Number(elapsedHours.toFixed(1)),
      currentTau: Number(currentTau.toFixed(2)),
      phase,
      phaseCode,
      phaseLabel,
    };
  };

  const timeline = calculateTimeline(activeBatch, kit);

  const handleAddBatch = () => {
    const newId = `pinter-${Date.now()}`;
    const newBatch = {
      id: newId,
      pinterName: `PINTER // 0${batches.length + 1} (STATION BAY)`,
      kitId: MASTER_KITS[0].id,
      pitchTimestamp: new Date().toISOString().slice(0, 16),
      ambientTempF: 72,
      determinationMode: 'auto',
      observedTauTimestamp: '',
      targetTrack: 'soma_max',
      customUndockMultiplier: 1.15,
      targetTapTimestamp: new Date(Date.now() + 6 * 24 * 3600 * 1000).toISOString().slice(0, 16),
      notes: 'Freshly pitched batch.',
      isUndocked: false,
      isChilled: false,
    };
    setBatches([...batches, newBatch]);
    setActiveBatchId(newId);
  };

  const handleDeleteBatch = (id) => {
    if (batches.length <= 1) return;
    const remaining = batches.filter((b) => b.id !== id);
    setBatches(remaining);
    setActiveBatchId(remaining[0].id);
  };

  const updateActiveBatch = (field, value) => {
    setBatches(
      batches.map((b) => (b.id === activeBatchId ? { ...b, [field]: value } : b))
    );
  };

  const handleObservedNow = () => {
    sounds.playValveHiss(0.7);
    const nowStr = new Date().toISOString().slice(0, 16);
    updateActiveBatch('observedTauTimestamp', nowStr);
    updateActiveBatch('determinationMode', 'observed');
  };

  const handleCelebratePour = () => {
    sounds.playChime();
    confetti({
      particleCount: 110,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#F5B041', '#E67E22', '#00F0FF', '#10B981', '#FFFFFF']
    });
  };

  const handleCopySchedule = () => {
    if (!timeline) return;
    const text = `
╔════════════════════════════════════════════════════════════╗
║   CHRONO-ZYMURGY OS // BREWERY BATCH TRAVELER TAG          ║
╠════════════════════════════════════════════════════════════╣
║ VESSEL:      ${activeBatch.pinterName.padEnd(43)} ║
║ KIT RECIPE:  ${(kit.name + ' (' + kit.style + ')').padEnd(43)} ║
║ PITCH DATE:  ${timeline.pitchDate.toLocaleString().padEnd(43)} ║
║ AMBIENT:     ${(activeBatch.ambientTempF + '°F (Arrhenius tau scaling)').padEnd(43)} ║
║ PROGRESS:    ${(timeline.currentTau + ' τ [' + timeline.elapsedHours + 'h elapsed]').padEnd(43)} ║
║ STATUS:      ${timeline.phaseCode.padEnd(43)} ║
╠════════════════════════════════════════════════════════════╣
║ KINETIC MILESTONES:                                        ║
║ 1. +90m AGITATION:      ${timeline.agitationDate.toLocaleString().padEnd(34)} ║
║ 2. 1.00 τ QUIET HORIZON: ${timeline.horizonDate.toLocaleString().padEnd(34)} ║
║ 3. 1.15 τ SOMA UNDOCK:   ${timeline.somaDate.toLocaleString().padEnd(34)} ║
║ 4. 1.25 τ CROWD UNDOCK:  ${timeline.crowdDate.toLocaleString().padEnd(34)} ║
║ 5. TAP COLD LOCK (38°F): ${timeline.readyDate.toLocaleString().padEnd(34)} ║
║ TARGET TAP EVENT:        ${timeline.targetTapDate.toLocaleString().padEnd(34)} ║
╚════════════════════════════════════════════════════════════╝
    `.trim();

    navigator.clipboard.writeText(text);
    setCopiedBatchId(activeBatch.id);
    setTimeout(() => setCopiedBatchId(null), 2500);
  };

  const formatCountdown = (targetDate) => {
    const diff = targetDate.getTime() - currentTime.getTime();
    if (diff <= 0) return 'Passed / Active';
    const totalSecs = Math.floor(diff / 1000);
    const days = Math.floor(totalSecs / 86400);
    const hours = Math.floor((totalSecs % 86400) / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    return `${days}d ${hours}h ${mins}m ${secs}s`;
  };

  return (
    <div className="space-y-5">
      {/* Top Banner: Multi-Bay Mission Control */}
      <div className="hw-panel p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-amber-400 text-xs font-mono-tabular mb-1">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
            <span className="tracking-widest uppercase font-semibold">Multi-Vessel τ-Clock Mission Control</span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">POPOS_STORAGE_PERSISTENT</span>
          </div>
          <h2 className="text-2xl font-bold font-display text-white tracking-tight">
            Active Multi-Pinter Batch Chronometer
          </h2>
          <p className="text-xs text-slate-300 mt-0.5 max-w-2xl leading-relaxed">
            Track and synchronize multiple Pinter vessels in real time with high-precision countdowns for agitation, 1.00&tau; gas drop, 1.15&tau; Soma-Max undocking, and Stokes cold lock.
          </p>
        </div>

        <button
          onClick={handleAddBatch}
          className="hw-btn flex items-center space-x-2 px-4 py-2.5 rounded-lg text-cyan-300 font-mono-tabular text-xs uppercase tracking-wider font-bold shadow-lg transition self-start md:self-center"
        >
          <Plus className="w-4 h-4 text-cyan-400" />
          <span>+ Add Vessel Bay</span>
        </button>
      </div>

      {/* Armored Vessel Bays Selector Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs font-mono-tabular">
        {batches.map((batch) => {
          const isSelected = batch.id === activeBatchId;
          const bKit = allKits.find((k) => k.id === batch.kitId);
          return (
            <button
              key={batch.id}
              onClick={() => setActiveBatchId(batch.id)}
              className={`flex items-center space-x-2.5 px-4 py-2.5 rounded-lg transition whitespace-nowrap ${
                isSelected
                  ? 'hw-well text-white border border-amber-500/60 font-semibold shadow-[0_0_16px_rgba(245,176,65,0.25)]'
                  : 'hw-panel text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-white/5'
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${isSelected ? 'bg-amber-400 shadow-[0_0_8px_#F5B041] animate-pulse' : 'bg-slate-600'}`} />
              <span className="font-bold tracking-wider">{batch.pinterName}</span>
              <span className="text-[10px] text-cyan-400">[{bKit?.name?.split(' ')[0]}]</span>
            </button>
          );
        })}
      </div>

      {/* 5-Node Horizontal Illuminated Stepper Pipeline */}
      {timeline && (
        <div className="hw-panel p-4 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono-tabular pb-2 border-b border-white/5">
            <span className="text-slate-400 uppercase tracking-wider text-[10px] font-bold">
              Biological Milestones Conduit
            </span>
            <span className="px-2 py-0.5 rounded hw-well text-amber-300 font-bold border border-amber-500/40">
              {timeline.phaseCode}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-2 pt-2">
            {/* Step 1: Pitch */}
            <div className={`p-2.5 rounded hw-well border transition ${timeline.elapsedHours >= 0 ? 'border-emerald-500/50 bg-emerald-950/20' : 'border-white/5'}`}>
              <div className="flex items-center space-x-1.5 mb-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_#10B981]"></span>
                <span className="font-bold text-[10px] text-emerald-300 font-mono-tabular">01 // PITCH &amp; SWIRL</span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono-tabular">0.00 τ Started</p>
              <p className="text-[11px] text-white font-bold font-mono-tabular truncate mt-0.5">
                {timeline.pitchDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>

            {/* Step 2: Agitation */}
            <div className={`p-2.5 rounded hw-well border transition ${timeline.elapsedHours >= 1.5 ? 'border-emerald-500/50 bg-emerald-950/20' : (timeline.elapsedHours < 1.5 ? 'border-amber-500/60 shadow-[0_0_12px_rgba(245,176,65,0.25)]' : 'border-white/5')}`}>
              <div className="flex items-center space-x-1.5 mb-1">
                <span className={`w-2 h-2 rounded-full ${timeline.elapsedHours >= 1.5 ? 'bg-emerald-400' : 'bg-amber-400 animate-pulse'}`}></span>
                <span className="font-bold text-[10px] text-amber-300 font-mono-tabular">02 // +90m AGITATION</span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono-tabular">+18% O₂ Dissolution</p>
              <p className="text-[11px] text-white font-bold font-mono-tabular truncate mt-0.5">
                {timeline.agitationDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>

            {/* Step 3: 1.00 Tau Horizon */}
            <div className={`p-2.5 rounded hw-well border transition ${timeline.currentTau >= 1.0 ? 'border-emerald-500/50 bg-emerald-950/20' : (timeline.currentTau >= 0.5 ? 'border-cyan-500/60 shadow-[0_0_12px_rgba(0,240,255,0.25)]' : 'border-white/5')}`}>
              <div className="flex items-center space-x-1.5 mb-1">
                <span className={`w-2 h-2 rounded-full ${timeline.currentTau >= 1.0 ? 'bg-emerald-400' : 'bg-cyan-400 animate-pulse'}`}></span>
                <span className="font-bold text-[10px] text-cyan-300 font-mono-tabular">03 // 1.00 τ QUIET</span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono-tabular">90% Gas Drop</p>
              <p className="text-[11px] text-white font-bold font-mono-tabular truncate mt-0.5">
                {timeline.horizonDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>

            {/* Step 4: Undock Target */}
            <div className={`p-2.5 rounded hw-well border transition ${activeBatch.isUndocked ? 'border-emerald-500/50 bg-emerald-950/20' : (timeline.currentTau >= 1.0 ? 'border-amber-500/60 shadow-[0_0_12px_rgba(245,176,65,0.25)]' : 'border-white/5')}`}>
              <div className="flex items-center space-x-1.5 mb-1">
                <span className={`w-2 h-2 rounded-full ${activeBatch.isUndocked ? 'bg-emerald-400' : 'bg-amber-400'}`}></span>
                <span className="font-bold text-[10px] text-amber-300 font-mono-tabular">04 // UNDOCK DOCK</span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono-tabular">{activeBatch.targetTrack === 'soma_max' ? '1.15τ Soma-Max' : '1.25τ Crowd'}</p>
              <p className="text-[11px] text-white font-bold font-mono-tabular truncate mt-0.5">
                {timeline.chosenUndockDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>

            {/* Step 5: Cold Lock & Tap */}
            <div className={`p-2.5 rounded hw-well border transition ${activeBatch.isChilled ? 'border-blue-500/50 bg-blue-950/20' : 'border-white/5'}`}>
              <div className="flex items-center space-x-1.5 mb-1">
                <span className={`w-2 h-2 rounded-full ${activeBatch.isChilled ? 'bg-blue-400 shadow-[0_0_6px_#60A5FA]' : 'bg-slate-600'}`}></span>
                <span className="font-bold text-[10px] text-blue-300 font-mono-tabular">05 // COLD LOCK &amp; TAP</span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono-tabular">38°F Stokes Lock</p>
              <p className="text-[11px] text-white font-bold font-mono-tabular truncate mt-0.5">
                {timeline.readyDate.toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Active Batch Control Bay & Traveler Tag */}
      {activeBatch && timeline && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Column (5 Cols): Telemetry Inputs */}
          <div className="lg:col-span-5 hw-panel p-4 space-y-4">
            <div className="flex items-center justify-between pb-2.5 border-b border-white/10">
              <input
                type="text"
                value={activeBatch.pinterName}
                onChange={(e) => updateActiveBatch('pinterName', e.target.value)}
                className="font-display text-sm font-bold text-white bg-transparent border-b border-dashed border-white/20 focus:border-cyan-400 outline-none pb-0.5 uppercase tracking-wide"
              />
              {batches.length > 1 && (
                <button
                  onClick={() => handleDeleteBatch(activeBatch.id)}
                  className="p-1 text-slate-500 hover:text-rose-400 rounded transition"
                  title="Decommission this Pinter bay"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Recipe Kit Selection */}
            <div className="hw-well p-3 rounded space-y-1">
              <label className="text-[10px] font-mono-tabular text-slate-400 uppercase block">Active Recipe Dossier</label>
              <select
                value={activeBatch.kitId}
                onChange={(e) => updateActiveBatch('kitId', e.target.value)}
                className="w-full px-2.5 py-1.5 rounded hw-well border border-white/10 text-white font-mono-tabular text-xs focus:border-cyan-400 outline-none"
              >
                {allKits.map((k) => (
                  <option key={k.id} value={k.id} className="bg-[#0B0E14] text-white">
                    {k.name} ({k.abv}% ABV | &tau; ~{k.baseTau}h)
                  </option>
                ))}
              </select>
            </div>

            {/* Pitch Timestamp */}
            <div className="hw-well p-3 rounded space-y-1">
              <label className="text-[10px] font-mono-tabular text-slate-400 uppercase block">Pitch Date &amp; Time</label>
              <input
                type="datetime-local"
                value={activeBatch.pitchTimestamp}
                onChange={(e) => updateActiveBatch('pitchTimestamp', e.target.value)}
                className="w-full px-2.5 py-1.5 rounded hw-well border border-white/10 text-white font-mono-tabular text-xs focus:border-cyan-400 outline-none"
              />
            </div>

            {/* Ambient Room Temperature Slider */}
            <div className="hw-well p-3 rounded space-y-2">
              <div className="flex justify-between text-xs font-mono-tabular">
                <span className="text-slate-400 text-[10px] uppercase">Ambient Temperature (Arrhenius Scaling)</span>
                <span className="text-amber-300 font-bold">{activeBatch.ambientTempF}°F</span>
              </div>
              <input
                type="range"
                min="60"
                max="82"
                value={activeBatch.ambientTempF}
                onChange={(e) => updateActiveBatch('ambientTempF', parseInt(e.target.value, 10))}
                className="hw-fader"
              />
            </div>

            {/* 1.00 Tau Horizon Mode */}
            <div className="hw-well p-3 rounded space-y-2">
              <div className="flex items-center justify-between text-xs font-mono-tabular">
                <span className="text-slate-300 font-bold uppercase text-[10px]">1.00 τ Horizon Determination</span>
                <span className="text-[10px] text-cyan-400">90% Gas Drop</span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs font-mono-tabular">
                <button
                  onClick={() => updateActiveBatch('determinationMode', 'auto')}
                  className={`py-1.5 rounded transition ${
                    activeBatch.determinationMode === 'auto'
                      ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-400/60 font-semibold'
                      : 'hw-well text-slate-400 hover:text-white'
                  }`}
                >
                  Auto ({timeline.effectiveTauHours}h)
                </button>
                <button
                  onClick={() => updateActiveBatch('determinationMode', 'observed')}
                  className={`py-1.5 rounded transition ${
                    activeBatch.determinationMode === 'observed'
                      ? 'bg-amber-500/20 text-amber-200 border border-amber-400/60 font-semibold'
                      : 'hw-well text-slate-400 hover:text-white'
                  }`}
                >
                  User Observed
                </button>
              </div>

              {activeBatch.determinationMode === 'observed' && (
                <div className="pt-2 space-y-2">
                  <input
                    type="datetime-local"
                    value={activeBatch.observedTauTimestamp}
                    onChange={(e) => updateActiveBatch('observedTauTimestamp', e.target.value)}
                    className="w-full px-2.5 py-1.5 rounded hw-well border border-white/10 text-white font-mono-tabular text-xs outline-none"
                  />
                  <button
                    onClick={handleObservedNow}
                    className="w-full py-1.5 rounded hw-btn text-cyan-300 text-xs font-mono-tabular transition flex items-center justify-center space-x-1"
                  >
                    <Wind className="w-3.5 h-3.5" />
                    <span>&ldquo;Heard 15 PSI Valve Quiet Just Now&rdquo;</span>
                  </button>
                </div>
              )}
            </div>

            {/* Target Track Selection */}
            <div className="space-y-1.5 text-xs font-mono-tabular">
              <label className="text-[10px] text-slate-400 uppercase">Target Brewing Track</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => updateActiveBatch('targetTrack', 'soma_max')}
                  className={`p-2.5 rounded-lg border text-left transition ${
                    activeBatch.targetTrack === 'soma_max'
                      ? 'bg-cyan-950/80 border-cyan-400 text-cyan-200 shadow-[0_0_12px_rgba(0,240,255,0.2)]'
                      : 'hw-well border-white/5 text-slate-400'
                  }`}
                >
                  <span className="font-bold block">1.15 &tau; Soma-Max</span>
                  <span className="text-[9px] text-slate-400 block">Velvet creamsicle &amp; high GSH</span>
                </button>

                <button
                  onClick={() => updateActiveBatch('targetTrack', 'crowd_harmonic')}
                  className={`p-2.5 rounded-lg border text-left transition ${
                    activeBatch.targetTrack === 'crowd_harmonic'
                      ? 'bg-amber-950/80 border-amber-400 text-amber-200 shadow-[0_0_12px_rgba(245,176,65,0.2)]'
                      : 'hw-well border-white/5 text-slate-400'
                  }`}
                >
                  <span className="font-bold block">1.25 &tau; Crowd-Harmonic</span>
                  <span className="text-[9px] text-slate-400 block">Clean balanced snap</span>
                </button>
              </div>
            </div>

            {/* Target Event Tap Date */}
            <div className="hw-well p-3 rounded space-y-1">
              <label className="text-[10px] font-mono-tabular text-slate-400 uppercase block">Target Tap Date (Party / Event)</label>
              <input
                type="datetime-local"
                value={activeBatch.targetTapTimestamp}
                onChange={(e) => updateActiveBatch('targetTapTimestamp', e.target.value)}
                className="w-full px-2.5 py-1.5 rounded hw-well border border-white/10 text-white font-mono-tabular text-xs focus:border-cyan-400 outline-none"
              />
            </div>
          </div>

          {/* Right Column (7 Cols): Physical Brewery Batch Traveler Tag & Tap Trigger */}
          <div className="lg:col-span-7 space-y-4">
            {/* Live Chronometer & Progress */}
            <div className="hw-panel p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
                <div>
                  <span className="text-[10px] font-mono-tabular text-slate-400 uppercase tracking-wider block">
                    Current Vessel Phase
                  </span>
                  <div className="flex items-center space-x-2 mt-0.5">
                    <span className="text-xl font-bold font-display text-white">{timeline.phaseLabel}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-3xl font-bold font-mono-tabular text-cyan-400">
                    {timeline.currentTau} &tau;
                  </span>
                  <span className="text-xs font-mono-tabular text-slate-400">
                    ({timeline.elapsedHours}h elapsed)
                  </span>
                </div>
              </div>

              {/* Progress Conduit Bar */}
              <div className="space-y-1.5 font-mono-tabular text-xs">
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>0.00τ PITCH</span>
                  <span className="text-cyan-400">1.00τ HORIZON</span>
                  <span className="text-amber-400">1.15τ SOMA-MAX</span>
                  <span className="text-blue-400">STOKES LOCK</span>
                </div>
                <div className="w-full h-3 hw-well rounded-full overflow-hidden p-0.5 border border-white/10">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-400 via-amber-400 to-emerald-400 rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(0,240,255,0.4)]"
                    style={{ width: `${Math.min(100, (timeline.currentTau / 1.5) * 100)}%` }}
                  />
                </div>
              </div>

              {/* Live Countdowns Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-xs font-mono-tabular">
                <div className="hw-well p-3.5 rounded space-y-0.5">
                  <span className="text-slate-400 block text-[10px] uppercase">
                    Next Operational Move: Undock
                  </span>
                  <span className="text-xl font-bold text-amber-300 block font-mono-tabular">
                    {formatCountdown(timeline.chosenUndockDate)}
                  </span>
                  <span className="text-[10px] text-slate-500 block truncate">
                    Target: {timeline.chosenUndockDate.toLocaleString()}
                  </span>
                </div>

                <div className="hw-well p-3.5 rounded space-y-0.5">
                  <span className="text-slate-400 block text-[10px] uppercase">
                    Target Tap Countdown
                  </span>
                  <span className="text-xl font-bold text-emerald-300 block font-mono-tabular">
                    {formatCountdown(timeline.targetTapDate)}
                  </span>
                  <span className="text-[10px] text-slate-500 block truncate">
                    Target: {timeline.targetTapDate.toLocaleString()} ({timeline.hoursToTap}h)
                  </span>
                </div>
              </div>

              {/* Physical Tap-Handle Trigger & Batch Actions */}
              <div className="flex flex-wrap items-center gap-2.5 pt-3 border-t border-white/10">
                <button
                  onClick={() => updateActiveBatch('isUndocked', !activeBatch.isUndocked)}
                  className={`px-3 py-1.5 rounded font-mono-tabular text-xs transition flex items-center space-x-1.5 ${
                    activeBatch.isUndocked
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-500'
                      : 'hw-btn text-slate-300'
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{activeBatch.isUndocked ? 'Dock Dropped ✓' : 'Mark Dock Dropped'}</span>
                </button>

                <button
                  onClick={() => updateActiveBatch('isChilled', !activeBatch.isChilled)}
                  className={`px-3 py-1.5 rounded font-mono-tabular text-xs transition flex items-center space-x-1.5 ${
                    activeBatch.isChilled
                      ? 'bg-blue-950 text-blue-300 border border-blue-500'
                      : 'hw-btn text-slate-300'
                  }`}
                >
                  <Snowflake className="w-3.5 h-3.5" />
                  <span>{activeBatch.isChilled ? 'In Fridge (Cold Lock) ✓' : 'Mark In Fridge'}</span>
                </button>

                {/* Tactile Tap Handle Trigger */}
                <button
                  onClick={handleCelebratePour}
                  className="px-4 py-1.5 rounded bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 hover:from-amber-400 hover:to-amber-300 text-slate-950 font-bold font-mono-tabular text-xs transition flex items-center space-x-1.5 shadow-[0_0_15px_rgba(245,176,65,0.4)] active:scale-95"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>PULL TAP HANDLE // FIRST POUR 🎉</span>
                </button>

                <button
                  onClick={handleCopySchedule}
                  className="hw-btn px-3 py-1.5 rounded text-cyan-300 text-xs font-mono-tabular transition flex items-center space-x-1.5 ml-auto"
                >
                  {copiedBatchId === activeBatch.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Copy Tag</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Brewery Batch Traveler Tag (High-Contrast Physical Spec Sheet) */}
            <div className="hw-well p-5 rounded-lg border border-white/10 space-y-3 font-mono-tabular text-xs relative">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-slate-300 uppercase tracking-widest text-[11px]">
                    Brewery Batch Traveler Tag
                  </span>
                  <span className="text-slate-600">|</span>
                  <span className="text-[10px] text-cyan-400 font-bold">POPOS_SERIAL #ZYMO-9482</span>
                </div>
                <div className="text-[10px] text-slate-500">
                  ||||| ||| ||||||| || |||||
                </div>
              </div>

              <div className="divide-y divide-white/5 text-xs">
                {/* 1. Agitation */}
                <div className="py-2 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                    <span className="text-slate-300">90-Min Post-Pitch Agitation</span>
                  </div>
                  <div className="text-right">
                    <span className="text-white font-bold">{timeline.agitationDate.toLocaleString()}</span>
                    <span className="text-[10px] text-slate-500 block">1-Min Swirl for +18% O₂ dissolution</span>
                  </div>
                </div>

                {/* 2. Horizon */}
                <div className="py-2 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-yellow-400"></span>
                    <span className="text-slate-300">1.00&tau; Horizon (90% Gas Quiet)</span>
                  </div>
                  <div className="text-right">
                    <span className="text-yellow-300 font-bold">{timeline.horizonDate.toLocaleString()}</span>
                    <span className="text-[10px] text-slate-500 block">Estimated ~{timeline.effectiveTauHours}h</span>
                  </div>
                </div>

                {/* 3. Soma-Max Undock */}
                <div className="py-2 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                    <span className="text-slate-300">1.15&tau; Soma-Max Undock</span>
                  </div>
                  <div className="text-right">
                    <span className="text-amber-300 font-bold">{timeline.somaDate.toLocaleString()}</span>
                    <span className="text-[10px] text-slate-500 block">Maximum creamsicle silk &amp; G4 viability</span>
                  </div>
                </div>

                {/* 4. Crowd-Harmonic Undock */}
                <div className="py-2 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                    <span className="text-slate-300">1.25&tau; Crowd-Harmonic Undock</span>
                  </div>
                  <div className="text-right">
                    <span className="text-purple-300 font-bold">{timeline.crowdDate.toLocaleString()}</span>
                    <span className="text-[10px] text-slate-500 block">Crisp balanced diacetyl cleanup</span>
                  </div>
                </div>

                {/* 5. Fridge Complete */}
                <div className="py-2 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                    <span className="text-slate-300">Fridge Cold Lock Complete</span>
                  </div>
                  <div className="text-right">
                    <span className="text-blue-300 font-bold">{timeline.readyDate.toLocaleString()}</span>
                    <span className="text-[10px] text-slate-500 block">After {kit.chillHours}h at 38°F</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
