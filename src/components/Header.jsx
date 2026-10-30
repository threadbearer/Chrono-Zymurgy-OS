import React, { useState } from 'react';
import { useTerminology } from '../context/TerminologyContext';
import { sounds } from '../utils/audioEffects';
import { 
  FlaskConical, 
  Sparkles, 
  Timer, 
  BookOpen, 
  Volume2, 
  VolumeX, 
  Wind,
  Layers,
  Activity,
  Flame
} from 'lucide-react';

export default function Header({ activeTab, setActiveTab, activeBatchCount = 0 }) {
  const { mode, toggleMode, t } = useTerminology();
  const [isMuted, setIsMuted] = useState(false);
  const [isSteaming, setIsSteaming] = useState(false);

  const handleToggleMode = (targetMode) => {
    if (mode !== targetMode) {
      sounds.playClick();
      toggleMode();
    }
  };

  const handleManualHiss = () => {
    setIsSteaming(true);
    sounds.playValveHiss(0.8);
    setTimeout(() => setIsSteaming(false), 750);
  };

  const handleToggleSound = () => {
    sounds.muted = !isMuted;
    setIsMuted(!isMuted);
    if (isMuted) sounds.playClick();
  };

  const handleMinimize = () => {
    if (window.electronAPI?.minimize) window.electronAPI.minimize();
  };

  const handleMaximize = () => {
    if (window.electronAPI?.maximize) window.electronAPI.maximize();
  };

  const handleClose = () => {
    if (window.electronAPI?.close) window.electronAPI.close();
  };

  return (
    <header className="bg-[#080B10]/95 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50 select-none shadow-2xl">
      {/* Top Native Pop!_OS COSMIC Titlebar Chrome */}
      <div className="flex items-center justify-between px-4 py-1 bg-[#05070A] border-b border-white/5 text-[11px] font-mono-tabular text-slate-400">
        <div className="flex items-center space-x-2.5">
          <div className="flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-semibold tracking-wider text-slate-200">CHRONO-ZYMURGY OS</span>
          </div>
          <span className="text-slate-700">|</span>
          <span className="text-slate-400 hidden sm:inline">POPOS_COSMIC // LINUX_STATION</span>
          <span className="text-slate-700 hidden sm:inline">|</span>
          <span className="text-cyan-400/90 font-medium hidden md:inline">15 PSI DOCKED CORE (5,450 mL)</span>
        </div>

        <div className="flex items-center space-x-3">
          {/* Industrial Hazard Pneumatic Purge Button */}
          <div className="relative">
            <button
              onClick={handleManualHiss}
              title="Manually purge 15 PSI pneumatic relief valve"
              className="relative flex items-center space-x-1.5 px-2.5 py-0.5 rounded border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/25 active:bg-amber-500/35 text-amber-300 font-mono-tabular text-[11px] uppercase tracking-wider transition shadow-sm active:translate-y-px"
            >
              <Wind className="w-3 h-3 text-amber-400" />
              <span>15 PSI Purge</span>
            </button>

            {/* Steam Burst Particle Effect */}
            {isSteaming && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 pointer-events-none z-50">
                <div className="w-8 h-8 rounded-full bg-cyan-200/40 animate-steam-burst"></div>
                <div className="w-4 h-4 rounded-full bg-white/60 animate-steam-burst -mt-4 ml-1"></div>
              </div>
            )}
          </div>

          {/* Sound Mute Toggle */}
          <button
            onClick={handleToggleSound}
            title={isMuted ? 'Unmute Audio Synthesis' : 'Mute Audio Synthesis'}
            className="p-1 rounded hw-well hover:border-cyan-500/50 text-slate-400 hover:text-slate-200 transition"
          >
            {isMuted ? (
              <VolumeX className="w-3.5 h-3.5 text-rose-400" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 text-cyan-400" />
            )}
          </button>

          {/* Pop!_OS COSMIC Circular Window Controls */}
          <div className="flex items-center space-x-2 pl-3 border-l border-white/10">
            <button
              onClick={handleMinimize}
              className="w-3 h-3 rounded-full bg-slate-700 hover:bg-slate-500 transition"
              title="Minimize"
            />
            <button
              onClick={handleMaximize}
              className="w-3 h-3 rounded-full bg-slate-700 hover:bg-slate-500 transition"
              title="Maximize"
            />
            <button
              onClick={handleClose}
              className="w-3 h-3 rounded-full bg-slate-700 hover:bg-[#F68412] transition"
              title="Close (Pop!_OS)"
            />
          </div>
        </div>
      </div>

      {/* Main COSMIC Instrument Deck */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-col lg:flex-row items-center justify-between gap-3">
        {/* Left: Brand Identity & Vessel Status */}
        <div 
          className="flex items-center space-x-3 cursor-pointer group"
          onClick={() => setActiveTab('catalog')}
        >
          {/* Glowing Reactor Emblem */}
          <div className="relative w-10 h-10 rounded-lg bg-gradient-to-b from-[#1A2332] to-[#0A0E17] p-1 border border-cyan-500/30 group-hover:border-cyan-400/60 shadow-[0_0_15px_rgba(0,240,255,0.25)] flex items-center justify-center transition">
            <div className="absolute inset-0 rounded-lg bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.15),transparent)]"></div>
            <img src="./icon.svg" alt="Reactor Emblem" className="w-7 h-7 object-contain relative z-10" />
            <span className="absolute -bottom-1 -right-1 text-[9px] font-mono-tabular font-bold bg-[#05070A] text-cyan-300 border border-cyan-500/40 rounded px-1 shadow">
              &tau;
            </span>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-base font-bold font-display tracking-wider text-white">
                CHRONO-ZYMURGY <span className="text-cyan-400 font-extrabold">OS</span>
              </h1>
              <span className="px-1.5 py-0.2 rounded font-mono-tabular text-[10px] font-medium hw-well text-cyan-300 border border-cyan-500/30">
                v4.5 // 5,450mL_15PSI_CORE
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-sans truncate max-w-[280px]">
              {mode === 'biophysics' 
                ? 'Non-Equilibrium Biophysics & Dynasty Kinetics' 
                : 'Living-Rhythm Brewing for Free Humans'}
            </p>
          </div>
        </div>

        {/* Center: Illuminated Dual-Chamber Rocker Switch (The Showpiece) */}
        <div className="flex flex-col items-center">
          <div className="hw-well p-1 flex items-center gap-1 rounded-lg border border-white/10 shadow-[inset_0_2px_8px_rgba(0,0,0,0.8)]">
            {/* Biophysics Chamber */}
            <button
              onClick={() => handleToggleMode('biophysics')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-md text-xs font-mono-tabular transition-all duration-200 relative ${
                mode === 'biophysics'
                  ? 'bg-gradient-to-r from-cyan-950/80 to-[#0A2633] text-cyan-200 border border-[#00F0FF]/70 shadow-[0_0_16px_rgba(0,240,255,0.35)] font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
              }`}
            >
              <span className={`w-2 h-2 rounded-full transition ${mode === 'biophysics' ? 'bg-[#00F0FF] shadow-[0_0_8px_#00F0FF] animate-pulse' : 'bg-slate-600'}`}></span>
              <FlaskConical className="w-3.5 h-3.5 text-cyan-400" />
              <span>🔬 BIOPHYSICS [SKL/&tau;]</span>
            </button>

            {/* Human Experience Chamber */}
            <button
              onClick={() => handleToggleMode('human')}
              className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-md text-xs font-mono-tabular transition-all duration-200 relative ${
                mode === 'human'
                  ? 'bg-gradient-to-r from-amber-950/80 to-[#33200A] text-amber-200 border border-[#F5B041]/70 shadow-[0_0_16px_rgba(245,176,65,0.35)] font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
              }`}
            >
              <span className={`w-2 h-2 rounded-full transition ${mode === 'human' ? 'bg-[#F5B041] shadow-[0_0_8px_#F5B041] animate-pulse' : 'bg-slate-600'}`}></span>
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>🧠 HUMAN EXPERIENCE</span>
            </button>
          </div>
          <span className="text-[10px] font-mono-tabular text-slate-500 mt-1">
            Active Paradigm: <strong className={mode === 'biophysics' ? 'text-cyan-400' : 'text-amber-400'}>{t('method_name')}</strong>
          </span>
        </div>

        {/* Right: Hardware Bank Switches (Module Navigation) */}
        <nav className="flex items-center space-x-1 hw-well p-1 rounded-lg border border-white/10">
          <button
            onClick={() => setActiveTab('catalog')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded text-xs font-mono-tabular transition relative ${
              activeTab === 'catalog'
                ? 'bg-[#182030] text-cyan-200 border-t-2 border-[var(--mode-accent)] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <span className="text-[10px] text-slate-500 font-bold">01</span>
            <Layers className="w-3.5 h-3.5" />
            <span className="tracking-wide">CATALOG</span>
            <span className="px-1 py-0.2 rounded bg-black/50 text-[10px] text-cyan-300 font-mono-tabular">23</span>
          </button>

          <button
            onClick={() => setActiveTab('simulator')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded text-xs font-mono-tabular transition relative ${
              activeTab === 'simulator'
                ? 'bg-[#182030] text-cyan-200 border-t-2 border-[var(--mode-accent)] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <span className="text-[10px] text-slate-500 font-bold">02</span>
            <FlaskConical className="w-3.5 h-3.5" />
            <span className="tracking-wide">SIMULATOR</span>
          </button>

          <button
            onClick={() => setActiveTab('tracker')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded text-xs font-mono-tabular transition relative ${
              activeTab === 'tracker'
                ? 'bg-[#182030] text-cyan-200 border-t-2 border-[var(--mode-accent)] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <span className="text-[10px] text-slate-500 font-bold">03</span>
            <Timer className="w-3.5 h-3.5" />
            <span className="tracking-wide">&tau;-TRACKER</span>
            {activeBatchCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping ml-0.5"></span>
            )}
          </button>

          <button
            onClick={() => setActiveTab('codex')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded text-xs font-mono-tabular transition relative ${
              activeTab === 'codex'
                ? 'bg-[#182030] text-cyan-200 border-t-2 border-[var(--mode-accent)] shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] font-semibold'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            <span className="text-[10px] text-slate-500 font-bold">04</span>
            <BookOpen className="w-3.5 h-3.5" />
            <span className="tracking-wide">CODEX</span>
          </button>
        </nav>
      </div>
    </header>
  );
}
