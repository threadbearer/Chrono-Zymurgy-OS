import React, { useState, useEffect } from 'react';
import { TerminologyProvider, useTerminology } from './context/TerminologyContext';
import Header from './components/Header';
import MasterCatalog from './components/MasterCatalog';
import DynastySimulator from './components/DynastySimulator';
import BatchTracker from './components/BatchTracker';
import CodexGuide from './components/CodexGuide';
import { MASTER_KITS } from './data/kits';

function MainApp() {
  const { mode } = useTerminology();
  const [activeTab, setActiveTab] = useState('catalog'); // 'catalog' | 'simulator' | 'tracker' | 'codex'
  const [simulatorKit, setSimulatorKit] = useState(MASTER_KITS[0]); // Flagship Hazy Tau IPA default


  
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
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6">
        {activeTab === 'catalog' && (
          <MasterCatalog
            onSelectForSimulator={handleSelectForSimulator}
            onSelectForTracker={handleSelectForTracker}
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

      {/* Bottom Status Footer */}
      <footer className="border-t border-white/5 bg-[#05070A]/95 px-5 py-2 text-[11px] font-mono-tabular text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2 select-none z-40 backdrop-blur-md">
        <div className="flex items-center space-x-3">
          <span className="flex items-center space-x-1.5 text-slate-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>CHRONO-ZYMURGY OS // POP!_OS EDITION</span>
          </span>
          <span className="text-slate-700">|</span>
          <span className="text-slate-400">15 PSI SEALED CONTAINMENT</span>
          <span className="text-slate-700">|</span>
          <span className="text-cyan-400 font-semibold">5,450 mL FILL LINE</span>
        </div>

        <div className="flex items-center space-x-2 text-[11px]">
          <span className="text-slate-500">Non-Equilibrium Biophysics Engine</span>
          <span className="text-slate-700">&bull;</span>
          <span className="text-amber-400/90 font-medium">Free Open-Source Brewing</span>
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
