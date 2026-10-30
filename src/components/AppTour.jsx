import React, { useState } from 'react';
import {
  Sparkles,
  Bot,
  Layers,
  Sliders,
  Timer,
  BookOpen,
  X,
  ArrowRight,
  ArrowLeft,
  Check,
  FlaskConical,
  ShieldCheck,
  Compass,
  Zap
} from 'lucide-react';

export const TOUR_STEPS = [
  {
    step: 1,
    targetTab: 'catalog',
    badge: 'WELCOME TO CHRONO-ZYMURGY OS',
    title: 'The Open-Source Zymurgy Workstation',
    description: 'Chrono-Zymurgy OS merges non-equilibrium biophysics with craft brewing. Switch between Biophysics Lab Mode (Soma-Kinetic Lexicon) and Human Experience Mode using the dual-chamber switch in the header to adapt the interface to your preferred paradigm.',
    icon: Compass,
    accentColor: 'from-cyan-500 to-blue-500',
    highlightKey: 'dual_mode'
  },
  {
    step: 2,
    targetTab: 'ai_brew',
    badge: 'AI BREW ARCHITECT & COPILOT',
    title: 'AI Zymurgy Recipe Synthesizer',
    description: 'Describe any beer in plain English or tune taste vectors (ABV, IBU, Silkiness, Aromatics, SRM color). Our biophysics engine synthesizes complete bills of materials, hop tea schedules, and sensory radar profiles with 1-click simulation and tracking.',
    icon: Bot,
    accentColor: 'from-cyan-500 to-emerald-500',
    highlightKey: 'ai_brew'
  },
  {
    step: 3,
    targetTab: 'simulator',
    badge: 'MULTI-PHYSICS ENGINE',
    title: 'Runge-Kutta Fermentation Dynamics',
    description: 'Model 15 PSI isobaric pressure containment, Henry’s Law headspace oxygen mass transfer, G0 mother cell settling, and G4   daughter cell viability at 60fps in the Dynasty Simulator.',
    icon: FlaskConical,
    accentColor: 'from-amber-500 to-orange-500',
    highlightKey: 'simulator'
  },
  {
    step: 4,
    targetTab: 'simulator',
    badge: 'INTERACTIVE DATA VIZ',
    title: '4D Phase Scrubber & CAD Bioreactor',
    description: 'Drag the biological time scrubber across the timeline to watch the liquid clarify, krausen foam expand, and trub settle into the conical trap in real time, accompanied by live telemetry readouts.',
    icon: Zap,
    accentColor: 'from-blue-500 to-cyan-400',
    highlightKey: 'phase_scrubber'
  },
  {
    step: 5,
    targetTab: 'catalog',
    badge: 'DECOMMERCIALIZATION',
    title: '23 Master Kits & DIY Clone Library',
    description: 'Break free from expensive proprietary kit lock-in. Explore reverse-engineered bills of materials for popular commercial offerings with over 70% DIY cost savings ($30+ saved per batch) and Chrono-Vault encryption.',
    icon: Layers,
    accentColor: 'from-emerald-500 to-teal-500',
    highlightKey: 'catalog'
  },
  {
    step: 6,
    targetTab: 'tracker',
    badge: 'FLEET LOGISTICS',
    title: 'Real-Time τ-Batch Fleet Tracker',
    description: 'Track multiple physical Pinter vessels simultaneously with biological milestone countdowns, 1.00τ horizon logging, conical undocking alerts, and tap-ready notifications.',
    icon: Timer,
    accentColor: 'from-purple-500 to-pink-500',
    highlightKey: 'tracker'
  }
];

export default function AppTour({ isOpen, onClose, onNavigateTab }) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  if (!isOpen) return null;

  const currentStep = TOUR_STEPS[currentStepIndex];
  const StepIcon = currentStep.icon;
  const isFirst = currentStepIndex === 0;
  const isLast = currentStepIndex === TOUR_STEPS.length - 1;

  const handleNext = () => {
    if (isLast) {
      handleComplete();
    } else {
      const nextIdx = currentStepIndex + 1;
      setCurrentStepIndex(nextIdx);
      if (onNavigateTab && TOUR_STEPS[nextIdx].targetTab) {
        onNavigateTab(TOUR_STEPS[nextIdx].targetTab);
      }
    }
  };

  const handlePrev = () => {
    if (!isFirst) {
      const prevIdx = currentStepIndex - 1;
      setCurrentStepIndex(prevIdx);
      if (onNavigateTab && TOUR_STEPS[prevIdx].targetTab) {
        onNavigateTab(TOUR_STEPS[prevIdx].targetTab);
      }
    }
  };

  const handleComplete = () => {
    try {
      localStorage.setItem('chrono_zymo_tour_seen', 'true');
    } catch (e) {
      console.warn('Could not save tour state:', e);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-lg hw-panel border border-white/20 shadow-[0_0_50px_rgba(0,0,0,0.9)] rounded-xl overflow-hidden p-6 space-y-5 animate-scale-up">
        {/* Top Glow Accent Bar */}
        <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${currentStep.accentColor}`} />

        {/* Close / Skip button */}
        <button
          onClick={handleComplete}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-md hover:bg-white/10 transition"
          title="Exit Tour"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Step Indicator & Icon */}
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${currentStep.accentColor} p-0.5 flex items-center justify-center shadow-lg`}>
            <div className="w-full h-full bg-[#05070A] rounded-[7px] flex items-center justify-center">
              <StepIcon className="w-5 h-5 text-white" />
            </div>
          </div>
          <div>
            <span className="text-[10px] font-mono-tabular font-bold tracking-widest uppercase text-cyan-400 block">
              {currentStep.badge} • STEP {currentStep.step} OF {TOUR_STEPS.length}
            </span>
            <h3 className="text-xl font-bold font-display text-white tracking-tight">
              {currentStep.title}
            </h3>
          </div>
        </div>

        {/* Body Description */}
        <div className="hw-well p-4 rounded-lg border border-white/5 text-xs text-slate-300 font-sans leading-relaxed">
          {currentStep.description}
        </div>

        {/* Step Progress Dots */}
        <div className="flex items-center justify-between pt-2 border-t border-white/10">
          <div className="flex items-center space-x-1.5">
            {TOUR_STEPS.map((s, idx) => (
              <button
                key={s.step}
                onClick={() => {
                  setCurrentStepIndex(idx);
                  if (onNavigateTab && s.targetTab) onNavigateTab(s.targetTab);
                }}
                className={`h-2 rounded-full transition-all duration-300 ${idx === currentStepIndex
                    ? 'w-6 bg-cyan-400'
                    : idx < currentStepIndex
                      ? 'w-2 bg-emerald-400'
                      : 'w-2 bg-slate-700 hover:bg-slate-500'
                  }`}
                title={`Go to step ${s.step}`}
              />
            ))}
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center space-x-2 font-mono-tabular text-xs">
            {!isFirst && (
              <button
                onClick={handlePrev}
                className="px-3 py-1.5 rounded hw-btn text-slate-300 hover:text-white flex items-center space-x-1 transition"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            )}

            <button
              onClick={handleNext}
              className={`px-4 py-1.5 rounded font-bold text-slate-950 flex items-center space-x-1.5 shadow-lg transition bg-gradient-to-r ${currentStep.accentColor} hover:opacity-95`}
            >
              <span>{isLast ? 'Complete Tour' : 'Next Step'}</span>
              {isLast ? <Check className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
