import React, { useState } from 'react';
import { useTerminology } from '../context/TerminologyContext';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer,
  Legend,
  Tooltip
} from 'recharts';

export default function RadarProfile({ 
  scores, 
  benchmarkScores, 
  benchmarkLabel = 'Flagship Hazy Tau',
  size = 'default',
  allowBenchmarkToggle = true
}) {
  const { mode, t } = useTerminology();
  const [showBenchmark, setShowBenchmark] = useState(false);

  // Default Flagship Benchmark scores if not provided
  const benchmark = benchmarkScores || {
    silk: 9.2,
    dc: 4.0,
    as: 2.5,
    aroma: 9.4,
    drag: 0.8,
    carb: 7.2,
    buzz: 9.6
  };

  // 5-Axis Profile (with benchmark values attached)
  const radarData = [
    {
      subject: mode === 'biophysics' ? 'Suspension (Silk)' : 'Sip Silk',
      fullKey: 'axis_1',
      value: scores?.silk ?? 5.0,
      benchmark: benchmark.silk,
      fullMark: 10,
    },
    {
      subject: mode === 'biophysics' ? 'Diacetyl (Dc)' : 'Butterscotch',
      fullKey: 'axis_2a',
      value: scores?.dc ?? 3.0,
      benchmark: benchmark.dc,
      fullMark: 10,
    },
    {
      subject: mode === 'biophysics' ? 'Terpene (TL)' : 'Aroma Wave',
      fullKey: 'axis_3a',
      value: scores?.aroma ?? 7.0,
      benchmark: benchmark.aroma,
      fullMark: 10,
    },
    {
      subject: mode === 'biophysics' ? 'Carbonic (Vel)' : 'Bubble Tingle',
      fullKey: 'axis_4',
      value: scores?.carb ?? 7.5,
      benchmark: benchmark.carb,
      fullMark: 10,
    },
    {
      subject: mode === 'biophysics' ? 'Soma (Φ)' : 'Fuzzy Buzz',
      fullKey: 'axis_5',
      value: scores?.buzz ?? 8.0,
      benchmark: benchmark.buzz,
      fullMark: 10,
    },
  ];

  const height = size === 'compact' ? 180 : 230;

  return (
    <div className="w-full flex flex-col items-center">
      {/* Benchmark Comparison Toggle */}
      {allowBenchmarkToggle && (
        <div className="w-full flex items-center justify-between px-1 mb-1 text-[10px] font-mono-tabular">
          <span className="text-slate-500 uppercase">Sensory Scaffold</span>
          <button
            type="button"
            onClick={() => setShowBenchmark(!showBenchmark)}
            className={`px-2 py-0.5 rounded transition border ${
              showBenchmark 
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-sm' 
                : 'hw-well text-slate-400 hover:text-slate-200 border-white/10'
            }`}
          >
            {showBenchmark ? '✓ Comparing vs Benchmark' : '+ Compare vs Benchmark'}
          </button>
        </div>
      )}

      <div style={{ width: '100%', height }} className="relative">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius={size === 'compact' ? '65%' : '75%'} data={radarData}>
            <PolarGrid stroke="rgba(255,255,255,0.08)" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: '#94A3B8', fontSize: size === 'compact' ? 9 : 11, fontFamily: 'monospace' }}
            />
            <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} axisLine={false} />

            {/* Active Recipe Radar Polygon */}
            <Radar
              name="Active Recipe"
              dataKey="value"
              stroke={mode === 'biophysics' ? '#00F0FF' : '#F5B041'}
              fill={mode === 'biophysics' ? '#00F0FF' : '#F5B041'}
              fillOpacity={0.35}
            />

            {/* Benchmark Overlay Radar Polygon */}
            {showBenchmark && (
              <Radar
                name={benchmarkLabel}
                dataKey="benchmark"
                stroke="#10B981"
                fill="#10B981"
                fillOpacity={0.15}
                strokeDasharray="3 3"
              />
            )}
          </RadarChart>
        </ResponsiveContainer>
      </div>

      {/* Axis Breakdown Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 w-full mt-2 text-[11px] font-mono-tabular">
        <div className="p-1.5 rounded hw-well border border-white/5 flex justify-between items-center">
          <span className="text-slate-400 truncate">{t('axis_1', 'short')}:</span>
          <span className="font-bold text-cyan-300 ml-1">{scores?.silk}/10</span>
        </div>
        <div className="p-1.5 rounded hw-well border border-white/5 flex justify-between items-center">
          <span className="text-slate-400 truncate">{t('axis_2a', 'short')}:</span>
          <span className="font-bold text-amber-300 ml-1">{scores?.dc}/10</span>
        </div>
        <div className="p-1.5 rounded hw-well border border-white/5 flex justify-between items-center">
          <span className="text-slate-400 truncate">{t('axis_2b', 'short')}:</span>
          <span className="font-bold text-emerald-300 ml-1">{scores?.as}/10</span>
        </div>
        <div className="p-1.5 rounded hw-well border border-white/5 flex justify-between items-center">
          <span className="text-slate-400 truncate">{t('axis_3a', 'short')}:</span>
          <span className="font-bold text-purple-300 ml-1">{scores?.aroma}/10</span>
        </div>
        <div className="p-1.5 rounded hw-well border border-white/5 flex justify-between items-center">
          <span className="text-slate-400 truncate">{t('axis_3b', 'short')}:</span>
          <span className="font-bold text-rose-300 ml-1">{scores?.drag}/10</span>
        </div>
        <div className="p-1.5 rounded hw-well border border-white/5 flex justify-between items-center">
          <span className="text-slate-400 truncate">{t('axis_5', 'short')}:</span>
          <span className="font-bold text-yellow-300 ml-1">{scores?.buzz}/10</span>
        </div>
      </div>
    </div>
  );
}
