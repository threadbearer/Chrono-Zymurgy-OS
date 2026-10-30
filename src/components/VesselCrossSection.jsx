import React from 'react';
import { useTerminology } from '../context/TerminologyContext';
import { AlertTriangle, ShieldCheck, Gauge, Wind, Zap, CheckCircle2 } from 'lucide-react';

export default function VesselCrossSection({ simulationData, scrubbedTau = null }) {
  const { mode, t } = useTerminology();
  const { inputs, physics, scores } = simulationData;

  const airPocket = inputs.airPocketMl;
  const isConical = inputs.conicalInstalled;
  const isBlowout = physics.isBlowoutRisk;

  // Active biological timeline stage (if scrubbedTau is provided, otherwise default to undockTau)
  const currentTau = scrubbedTau !== null ? scrubbedTau : inputs.undockTau;
  const isFridgePhase = currentTau > 1.6;
  const fridgeDay = isFridgePhase ? Math.round((currentTau - 1.6) / 0.2) : 0;
  const isUndockedAtThisPoint = currentTau >= inputs.undockTau;

  // Dynamic Krausen Foam Height based on active tau phase:
  // Krausen peaks between 0.40 and 0.75 tau, then collapses as horizon is reached
  let foamMultiplier = 0.2;
  if (currentTau < 0.2) {
    foamMultiplier = 0.25;
  } else if (currentTau <= 0.7) {
    foamMultiplier = 0.5 + ((currentTau - 0.2) / 0.5) * 0.5; // reaches 1.0 peak
  } else if (currentTau <= 1.0) {
    foamMultiplier = 1.0 - ((currentTau - 0.7) / 0.3) * 0.65; // drops to 0.35
  } else if (currentTau <= 1.25) {
    foamMultiplier = 0.35 - ((currentTau - 1.0) / 0.25) * 0.25; // drops to 0.1
  } else {
    foamMultiplier = 0.05; // negligible foam during cold lock
  }

  // Headspace air height varies with airPocket (from 300ml to 1600ml -> 30px to 95px)
  const headspaceHeight = Math.min(100, Math.max(30, (airPocket / 1600) * 95));
  // Krausen foam height
  const maxKrausenH = Math.min(headspaceHeight - 5, Math.max(15, (physics.krausenVolumeMl / 1600) * 95));
  const dynamicKrausenHeight = Math.max(8, maxKrausenH * foamMultiplier);
  const foamCeilingGap = Math.round(headspaceHeight - dynamicKrausenHeight);

  // Dynamic Trub accumulation in dock:
  // Starts empty at 0.0 tau, fills to maximum by 1.0 tau
  const trubAccumulation = Math.min(1.0, currentTau / 1.0);
  const trubHeightPx = Math.round(trubAccumulation * 60);

  // Dynamic Liquid Turbidity vs Clarity:
  // Early wort is murky; cold lock clarifies to luminous liquid
  const clarityPct = isFridgePhase
    ? Math.min(1.0, 0.6 + (fridgeDay / 5) * 0.4)
    : Math.max(0.1, (currentTau / 1.6) * 0.5);

  // Active 15 PSI Valve emission state
  const isActivelyVenting = currentTau >= 0.3 && currentTau <= 0.85;

  return (
    <div className="hw-panel p-5 space-y-4">
      {/* CAD Instrument Header & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-white/10">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 text-xs font-mono-tabular">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            <span className="uppercase tracking-widest font-semibold">CAD Bioreactor Cutaway // 6,650 mL Containment</span>
            <span className="text-slate-600">|</span>
            <span className="text-amber-400 font-bold">
              {isFridgePhase ? `COLD LOCK D${fridgeDay}` : `${currentTau.toFixed(2)} τ PHASE`}
            </span>
          </div>
          <h4 className="text-base font-bold font-display text-white mt-0.5">
            {mode === 'biophysics'
              ? 'Hydrodynamic Vessel Cross-Section & Stokes-Henry Kinetics'
              : 'Live Pinter Cutaway & Bubble Chamber'}
          </h4>
          <p className="text-xs text-slate-400 font-mono-tabular mt-0.5">
            Total Vessel Capacity: <strong className="text-cyan-300">{(5450 + airPocket).toLocaleString()} mL</strong> (5,450 mL Liquid Wort + {airPocket} mL Headspace Pocket)
          </p>
        </div>

        {/* Conical Funnel Safety Status */}
        <div className="flex items-center space-x-2">
          {isConical ? (
            <span className="px-2.5 py-1 rounded hw-well border border-emerald-500/50 text-emerald-300 font-mono-tabular text-xs flex items-center space-x-1.5 shadow-[0_0_10px_rgba(16,185,129,0.25)]">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>CONICAL FUNNEL: LOCKED [92% TRUB STRIPPED]</span>
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded hw-well border border-rose-500 text-rose-300 font-mono-tabular text-xs flex items-center space-x-1.5 shadow-[0_0_15px_rgba(244,63,94,0.35)] animate-pulse">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              <span>CONICAL MISSING: 75% TRUB RESUSPENDED</span>
            </span>
          )}
        </div>
      </div>

      {/* Critical Valve Blowout Alert Strobe */}
      {isBlowout && (
        <div className="p-3.5 rounded-lg bg-rose-950/80 border-2 border-rose-500 text-rose-100 text-xs font-mono-tabular flex items-center space-x-3 shadow-[0_0_25px_rgba(244,63,94,0.5)] animate-pulse">
          <AlertTriangle className="w-6 h-6 text-rose-400 shrink-0 animate-bounce" />
          <div>
            <strong className="text-white block font-bold text-sm tracking-wide">
              CRITICAL BLOWOUT RISK: HEADSPACE &lt; 820 mL
            </strong>
            <span className="text-rose-200">
              Active Headspace Air Pocket ({airPocket} mL) is insufficient for violent Krausen expansion ({physics.krausenVolumeMl} mL). High risk of Krausen entering the 15 PSI relief valve, clogging the diaphragm, or causing gasket venting!
            </span>
          </div>
        </div>
      )}

      {/* Dynamic Technical SVG CAD Illustration */}
      <div className="relative w-full hw-well p-4 rounded-lg overflow-hidden border border-white/10">
        <svg viewBox="0 0 900 380" className="w-full h-auto max-h-[380px] select-none">
          <defs>
            <linearGradient id="liquidGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={isFridgePhase ? '#F5B041' : '#E67E22'} stopOpacity={0.95} />
              <stop offset="45%" stopColor={isFridgePhase ? '#F59E0B' : '#D97706'} stopOpacity={0.95} />
              <stop offset="100%" stopColor="#78350F" stopOpacity={1} />
            </linearGradient>
            <linearGradient id="foamGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FEF08A" stopOpacity="0.95" />
              <stop offset="70%" stopColor="#FEF3C7" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.75" />
            </linearGradient>
            <linearGradient id="headspaceGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#0284C7" stopOpacity="0.05" />
            </linearGradient>
            <linearGradient id="trubGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#451A03" />
              <stop offset="100%" stopColor="#1C1917" />
            </linearGradient>
            <filter id="neonGlowCyan">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="neonGlowRed">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* CAD Blueprint Grid Lines & Dimension Accents */}
          <line x1="60" y1="50" x2="840" y2="50" stroke="#1E293B" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="60" y1="170" x2="840" y2="170" stroke="#1E293B" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="60" y1="310" x2="840" y2="310" stroke="#1E293B" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="240" y1="30" x2="240" y2="340" stroke="#334155" strokeWidth="1" strokeDasharray="4 4" />

          {/* Blueprint Dimension Lines & Annotation Arrows */}
          <g opacity="0.6">
            <line x1="240" y1="42" x2="760" y2="42" stroke="#00F0FF" strokeWidth="1" />
            <circle cx="240" cy="42" r="2" fill="#00F0FF" />
            <circle cx="760" cy="42" r="2" fill="#00F0FF" />
            <text x="500" y="38" fontFamily="monospace" fontSize="9" fill="#00F0FF" textAnchor="middle">
              MAIN DOCKED BARREL (5,450 mL FILL LINE)
            </text>
          </g>

          {/* MAIN PINTER CHASSIS (Horizontal Barrel) */}
          <rect
            x="240"
            y="60"
            width="520"
            height="260"
            rx="28"
            fill="#0B0E14"
            stroke="#2A384F"
            strokeWidth="4"
          />

          {/* Tap / Spout Handle on Right */}
          <path d="M 760,150 L 815,150 L 815,230 L 760,230 Z" fill="#161C28" stroke="#3A4D6B" strokeWidth="3" />
          <circle cx="825" cy="190" r="14" fill="#00F0FF" filter="url(#neonGlowCyan)" />
          <text x="825" y="240" fontFamily="monospace" fontSize="10" fill="#94A3B8" textAnchor="middle">TAP VALVE</text>

          {/* BREWING DOCK (Attached at Left: 450 mL capacity) */}
          <g transform={isUndockedAtThisPoint ? "translate(-25, 0)" : "translate(0, 0)"} className="transition-transform duration-500">
            <path
              d="M 115,80 L 240,80 L 240,300 L 115,300 A 30,110 0 0,1 115,80 Z"
              fill={isUndockedAtThisPoint ? "#05070A" : "#080C14"}
              stroke={isUndockedAtThisPoint ? "#10B981" : "#3A4D6B"}
              strokeWidth="3.5"
            />
            <text x="175" y="72" fontFamily="monospace" fontSize="10" fontWeight="bold" fill={isUndockedAtThisPoint ? "#10B981" : "#00F0FF"} textAnchor="middle">
              {isUndockedAtThisPoint ? 'DOCK UNDOCKED ✓' : 'BREWING DOCK (450 mL)'}
            </text>

            {/* Trub Layer in Brewing Dock */}
            {isConical ? (
              <path
                d={`M 120,${300 - trubHeightPx} Q 180,${290 - trubHeightPx} 235,${300 - trubHeightPx} L 235,295 A 25,25 0 0,1 210,300 L 130,300 A 20,20 0 0,1 120,280 Z`}
                fill="url(#trubGrad)"
                stroke="#78350F"
                strokeWidth="2"
              />
            ) : (
              <g>
                <path
                  d={`M 120,${300 - trubHeightPx} L 235,${300 - trubHeightPx} L 235,300 L 120,300 Z`}
                  fill="url(#trubGrad)"
                />
                <path d="M 220,260 C 260,250 280,290 330,270" stroke="#F43F5E" strokeWidth="2.5" fill="none" />
                <circle cx="280" cy="260" r="5" fill="#78350F" stroke="#F43F5E" strokeWidth="1.5" />
                <circle cx="340" cy="275" r="6" fill="#78350F" stroke="#F43F5E" strokeWidth="1.5" />
                <circle cx="390" cy="285" r="5" fill="#78350F" stroke="#F43F5E" strokeWidth="1.5" />
              </g>
            )}
          </g>

          {/* CONICAL FUNNEL JUNCTION */}
          {isConical ? (
            <g>
              <polygon points="230,85 250,140 250,220 230,275" fill="#064E3B" stroke="#10B981" strokeWidth="3" />
              <line x1="240" y1="120" x2="240" y2="240" stroke="#34D399" strokeWidth="3" strokeDasharray="4 2" />
              <text x="240" y="48" fontFamily="monospace" fontSize="10" fontWeight="bold" fill="#34D399" textAnchor="middle">
                CONICAL FILTER [LOCKED]
              </text>
            </g>
          ) : (
            <g>
              <line x1="240" y1="85" x2="240" y2="275" stroke="#F43F5E" strokeWidth="3" strokeDasharray="6 4" filter="url(#neonGlowRed)" />
              <text x="240" y="48" fontFamily="monospace" fontSize="10" fontWeight="bold" fill="#F43F5E" textAnchor="middle">
                ⚠️ FUNNEL MISSING (RESUSPENSION RISK)
              </text>
            </g>
          )}

          {/* LIQUID WORT CHAMBER (5,450 mL Standard Fill) */}
          <path
            d="M 245,140 L 755,140 L 755,300 A 20,20 0 0,1 735,315 L 265,315 A 20,20 0 0,1 245,300 Z"
            fill="url(#liquidGrad)"
            opacity={0.90 + clarityPct * 0.10}
          />

          {/* Animated G4   Daughters */}
          <circle cx="310" cy="210" r="4" fill="#FEF08A" opacity={0.6 + clarityPct * 0.4} />
          <circle cx="360" cy="180" r="3" fill="#FEF08A" opacity={0.5 + clarityPct * 0.5} />
          <circle cx="410" cy="240" r="4.5" fill="#FEF08A" opacity={0.6 + clarityPct * 0.4} />
          <circle cx="470" cy="190" r="3.5" fill="#FEF08A" opacity={0.5 + clarityPct * 0.5} />
          <circle cx="530" cy="250" r="4" fill="#FEF08A" opacity={0.6 + clarityPct * 0.4} />
          <circle cx="600" cy="205" r="3" fill="#FEF08A" opacity={0.5 + clarityPct * 0.5} />
          <circle cx="670" cy="235" r="4.5" fill="#FEF08A" opacity={0.6 + clarityPct * 0.4} />
          <circle cx="710" cy="180" r="3.5" fill="#FEF08A" opacity={0.5 + clarityPct * 0.5} />

          {/* Micro CO2 bubbles rising toward surface */}
          <circle cx="340" cy="155" r="1.5" fill="#FFFFFF" opacity="0.8" />
          <circle cx="430" cy="150" r="2" fill="#FFFFFF" opacity="0.75" />
          <circle cx="520" cy="158" r="1.8" fill="#FFFFFF" opacity="0.85" />
          <circle cx="630" cy="152" r="2" fill="#FFFFFF" opacity="0.8" />

          {/* DYNAMIC KRAUSEN FOAM LAYER RISING FROM WORT */}
          {dynamicKrausenHeight > 5 && (
            <g>
              <rect
                x="245"
                y={140 - dynamicKrausenHeight * 0.75}
                width="510"
                height={dynamicKrausenHeight * 0.75}
                fill="url(#foamGrad)"
                stroke="#FEF08A"
                strokeWidth="1.5"
                opacity="0.92"
              />
              <circle cx="290" cy={140 - dynamicKrausenHeight * 0.4} r="5" fill="#FFFFFF" opacity="0.65" />
              <circle cx="370" cy={140 - dynamicKrausenHeight * 0.6} r="7" fill="#FFFFFF" opacity="0.55" />
              <circle cx="450" cy={140 - dynamicKrausenHeight * 0.3} r="6" fill="#FFFFFF" opacity="0.65" />
              <circle cx="550" cy={140 - dynamicKrausenHeight * 0.5} r="7.5" fill="#FFFFFF" opacity="0.55" />
              <circle cx="640" cy={140 - dynamicKrausenHeight * 0.4} r="5.5" fill="#FFFFFF" opacity="0.65" />
            </g>
          )}

          {/* HEADSPACE AIR POCKET (Henry's Law O2 Reservoir) */}
          <rect
            x="245"
            y="65"
            width="510"
            height={Math.max(10, 75 - dynamicKrausenHeight * 0.75)}
            fill="url(#headspaceGrad)"
          />
          <text x="500" y="85" fontFamily="monospace" fontSize="11" fontWeight="bold" fill="#00F0FF" textAnchor="middle">
            HEADSPACE AIR POCKET: {airPocket} mL (O₂ ~{physics.headspaceO2Mg} mg)
          </text>

          {/* Henry's Law Diffusion Arrows */}
          <g opacity="0.8">
            <line x1="380" y1="92" x2="380" y2="125" stroke="#00F0FF" strokeWidth="2" strokeDasharray="3 3" />
            <line x1="500" y1="92" x2="500" y2="125" stroke="#00F0FF" strokeWidth="2" strokeDasharray="3 3" />
            <line x1="620" y1="92" x2="620" y2="125" stroke="#00F0FF" strokeWidth="2" strokeDasharray="3 3" />
            <text x="500" y="115" fontFamily="monospace" fontSize="9" fill="#00F0FF" textAnchor="middle">
              Henry's Law O₂ Transport &rarr; Liquid Wort
            </text>
          </g>

          {/* 15 PSI PNEUMATIC RELIEF VALVE AT TOP */}
          <g transform="translate(500, 30)">
            <rect
              x="-40"
              y="0"
              width="80"
              height="30"
              rx="6"
              fill="#111620"
              stroke={isBlowout ? '#F43F5E' : isActivelyVenting ? '#F5B041' : '#00F0FF'}
              strokeWidth="2.5"
              filter={isBlowout ? 'url(#neonGlowRed)' : 'url(#neonGlowCyan)'}
            />
            <circle cx="0" cy="15" r="6" fill={isBlowout ? '#F43F5E' : isActivelyVenting ? '#F5B041' : '#10B981'} />
            <text x="0" y="-8" fontFamily="monospace" fontSize="10" fontWeight="bold" fill={isBlowout ? '#F43F5E' : isActivelyVenting ? '#F5B041' : '#00F0FF'} textAnchor="middle">
              15 PSI RELIEF VALVE {isBlowout ? '⚠️ RISK' : isActivelyVenting ? '💨 ACOUSTIC HISS' : '✓ EQUILIBRIUM'}
            </text>
            {isActivelyVenting && (
              <g opacity="0.7">
                <line x1="-15" y1="-12" x2="-25" y2="-22" stroke="#F5B041" strokeWidth="2" />
                <line x1="0" y1="-14" x2="0" y2="-26" stroke="#F5B041" strokeWidth="2" />
                <line x1="15" y1="-12" x2="25" y2="-22" stroke="#F5B041" strokeWidth="2" />
              </g>
            )}
          </g>

          {/* Analog-Digital Pressure Arc Gauge (Lower Right Overlay) */}
          <g transform="translate(680, 260)">
            <circle cx="0" cy="0" r="32" fill="#05070A" stroke="#00F0FF" strokeWidth="2.5" />
            <circle cx="0" cy="0" r="2.5" fill="#FFFFFF" />
            <line
              x1="0"
              y1="0"
              x2={currentTau < 0.2 ? "0" : "16"}
              y2={currentTau < 0.2 ? "-22" : "-16"}
              stroke={isBlowout ? '#F43F5E' : '#00F0FF'}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <text x="0" y="14" fontFamily="monospace" fontSize="9" fontWeight="bold" fill="#00F0FF" textAnchor="middle">
              {currentTau < 0.2 ? '5 PSI' : '15 PSI'}
            </text>
            <text x="0" y="24" fontFamily="monospace" fontSize="7" fill="#64748B" textAnchor="middle">PRESSURE</text>
          </g>

          {/* Annotations & Volume Metrics */}
          <text x="500" y="295" fontFamily="monospace" fontSize="11" fontWeight="bold" fill="#FEF08A" textAnchor="middle">
            LIQUID WORT: 5,450 mL | Gn = {physics.Gn} Generations
          </text>
        </svg>
      </div>

      {/* 4-KPI Recessed Readout Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono-tabular">
        <div className="hw-well p-3 rounded">
          <span className="text-slate-400 block text-[10px] uppercase">Dissolved Base O₂</span>
          <span className="text-base font-bold text-cyan-300 mt-0.5 block">
            ~{physics.dissolvedBaseO2Mg} mg O₂
          </span>
          <span className="text-[10px] text-slate-500">From 5,450 mL water fill</span>
        </div>

        <div className="hw-well p-3 rounded">
          <span className="text-slate-400 block text-[10px] uppercase">Headspace O₂ Transfer</span>
          <span className="text-base font-bold text-cyan-400 mt-0.5 block">
            +{physics.effectiveO2TransferredMg} mg O₂
          </span>
          <span className="text-[10px] text-slate-500">
            Via {inputs.aerationProtocol.replace('_', ' ')}
          </span>
        </div>

        <div className="hw-well p-3 rounded">
          <span className="text-slate-400 block text-[10px] uppercase">Replicative Factor</span>
          <span className="text-base font-bold text-yellow-300 mt-0.5 block">
            Gn = {physics.Gn}
          </span>
          <span className="text-[10px] text-slate-500">
            {(physics.daughterFraction * 100).toFixed(0)}% G4 live daughters
          </span>
        </div>

        <div className="hw-well p-3 rounded">
          <span className="text-slate-400 block text-[10px] uppercase">Krausen Clearance</span>
          <span className={`text-base font-bold mt-0.5 block ${foamCeilingGap < 20 ? 'text-rose-400' : 'text-emerald-300'}`}>
            {foamCeilingGap > 0 ? `${foamCeilingGap} mL buffer` : 'BLOWOUT RISK'}
          </span>
          <span className="text-[10px] text-slate-500">
            Foam: {Math.round(dynamicKrausenHeight * 12)} mL vs {airPocket} mL pocket
          </span>
        </div>
      </div>
    </div>
  );
}
