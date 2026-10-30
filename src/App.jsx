import React, { useState, useEffect } from 'react';
import { TerminologyProvider, useTerminology } from './context/TerminologyContext';
import Header from './components/Header';
import AIBrewmaster from './components/AIBrewmaster';
import MasterCatalog from './components/MasterCatalog';
import DynastySimulator from './components/DynastySimulator';
import BatchTracker from './components/BatchTracker';
import CodexGuide from './components/CodexGuide';
import AppTour from './components/AppTour';
import { MASTER_KITS } from './data/kits';

function MainApp() {
  const { mode } = useTerminology();
  // 'ai_brew' | 'catalog' | 'simulator' | 'tracker' | 'codex'
  const [activeTab, setActiveTab] = useState('ai_brew');
  const [simulatorKit, setSimulatorKit] = useState(MASTER_KITS[0]); // Flagship Hazy Tau IPA default

  // App Tour state
  const [isTourOpen, setIsTourOpen] = useState(false);

  // Auto-launch tour on very first visit
  useEffect(() => {
    try {
      const tourSeen = localStorage.getItem('chrono_zymo_tour_seen');
      if (!tourSeen) {
        const timer = setTimeout(() => setIsTourOpen(true), 1200);
        return () => clearTimeout(timer);
      }
    } catch (e) {
      console.warn('Could not read tour state:', e);
    }
  }, []);

  // Custom DIY kits stored in localStorage
  const [customKits, setCustomKits] = useState(() => {
    try {
      const saved = localStorage.getItem('chrono_zymo_custom_kits');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const handleSaveCustomKit = (newKit) => {
    const updated = [newKit, ...customKits];
    setCustomKits(updated);
    try {
      localStorage.setItem('chrono_zymo_custom_kits', JSON.stringify(updated));
    } catch (e) {
      console.warn('Could not save custom kit:', e);
    }
  };

  const handleSelectForSimulator = (kit) => {
    setSimulatorKit(kit);
    setActiveTab('simulator');
  };

  const handleSelectForAI = (kit) => {
    setActiveTab('ai_brew');
  };

  const handleSelectForTracker = (kit) => {
    setActiveTab('tracker');
  };

  return (
    <div 
      data-mode={mode === 'human' ? 'human' : 'biophysics'}
      className="min-h-screen bg-telemetry-grid text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950 transition-colors duration-500"
    >
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeBatchCount={2}
        onStartTour={() => setIsTourOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6">
        {activeTab === 'ai_brew' && (
          <AIBrewmaster
            onSelectForSimulator={handleSelectForSimulator}
            onSelectForTracker={handleSelectForTracker}
            onSaveCustomKit={handleSaveCustomKit}
            customKits={customKits}
          />
        )}

        {activeTab === 'catalog' && (
          <MasterCatalog
            onSelectForSimulator={handleSelectForSimulator}
            onSelectForTracker={handleSelectForTracker}
            onSelectForAI={handleSelectForAI}
            customKits={customKits}
            onSaveCustomKit={handleSaveCustomKit}
          />
        )}

        {activeTab === 'simulator' && (
          <DynastySimulator
            initialKit={simulatorKit}
            customKits={customKits}
            onPitchBatch={handleSelectForTracker}
          />
        )}

        {activeTab === 'tracker' && (
          <BatchTracker
            customKits={customKits}
            onSelectForSimulator={handleSelectForSimulator}
          />
        )}

        {activeTab === 'codex' && (
          <CodexGuide />
        )}
      </main>

      {/* Interactive App Tour Modal Walkthrough */}
      <AppTour
        isOpen={isTourOpen}
        onClose={() => setIsTourOpen(false)}
        onNavigateTab={(tab) => setActiveTab(tab)}
      />

      {/* Bottom Status Footer */}
      <footer className="border-t border-white/5 bg-[#05070A]/95 px-5 py-2 text-[11px] font-mono-tabular text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2 select-none z-40 backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <span className="flex items-center space-x-1.5 text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>CHRONO-ZYMURGY OS // AI-POWERED ZYMURGY WORKSTATION</span>
          </span>
          <span className="text-slate-700">|</span>
          <span className="text-slate-400">15 PSI SEALED CONTAINMENT</span>
          <span className="text-slate-700">|</span>
          <span className="text-cyan-400 font-semibold">5,450 mL FILL LINE</span>
        </div>

        <div className="flex items-center space-x-2 text-[11px]">
          <span className="text-slate-500">Non-Equilibrium Biophysics Engine</span>
          <span className="text-slate-700">&bull;</span>
          <span className="text-amber-400/90 font-medium">Free Open-Source Craft Brewing</span>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <TerminologyProvider>
      <MainApp />
    </TerminologyProvider>
  );
}
