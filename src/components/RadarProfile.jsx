import React from 'react';
import { useTerminology } from '../context/TerminologyContext';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  PolarRadiusAxis, 
  ResponsiveContainer 
} from 'recharts';

export default function RadarProfile({ scores, size = 'default' }) {
  const { mode, t } = useTerminology();

  // 5-Axis Profile
  const radarData = [
    {
      subject: mode === 'biophysics' ? 'Suspension (Silk)' : 'Sip Silk',
      fullKey: 'axis_1',
      value: scores?.silk ?? 5.0,
      fullMark: 10,
    },
    {
      subject: mode === 'biophysics' ? 'Diacetyl (Dc)' : 'Butterscotch',
      fullKey: 'axis_2a',
      value: scores?.dc ?? 3.0,
      fullMark: 10,
    },
    {
      subject: mode === 'biophysics' ? 'Terpene (TL)' : 'Aroma Wave',
      fullKey: 'axis_3a',
      value: scores?.aroma ?? 7.0,
      fullMark: 10,
    },
    {
      subject: mode === 'biophysics' ? 'Carbonic (Vel)' : 'Bubble Tingle',
      fullKey: 'axis_4',
      value: scores?.carb ?? 7.5,
      fullMark: 10,
    },
    {
      subject: mode === 'biophysics' ? 'Soma (Φ)' : 'Fuzzy Buzz',
      fullKey: 'axis_5',
      value: scores?.buzz ?? 8.0,
      fullMark: 10,
    },
  ];

  const height = size === 'compact' ? 180 : 230;

  return (
    <div className="w-full flex flex-col items-center">
      <div style={{ width: '100%', height }} className="relative">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius={size === 'compact' ? '65%' : '75%'} data={radarData}>
            <PolarGrid stroke="rgba(255,255,255,0.08)" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fill: '#94A3B8', fontSize: size === 'compact' ? 9 : 11, fontFamily: 'monospace' }}
            />
            <PolarRadiusAxis angle={30} domain={[0, 10]} tick={false} axisLine={false} />
            <Radar
              name="Profile"
              dataKey="value"
              stroke={mode === 'biophysics' ? '#00F0FF' : '#F5B041'}
              fill={mode === 'biophysics' ? '#00F0FF' : '#F5B041'}
              fillOpacity={0.35}
            />
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
