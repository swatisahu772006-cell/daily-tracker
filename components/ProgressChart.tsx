
import React from 'react';
import { DailyRecord } from '../types';

interface ProgressChartProps {
  history: DailyRecord[];
}

const ProgressChart: React.FC<ProgressChartProps> = ({ history }) => {
  const data = [...history]
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(-14);

  if (data.length < 2) {
    return (
      <div className="bg-white p-6 rounded-3xl border border-blue-100 text-center py-12">
        <div className="bg-blue-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
          </svg>
        </div>
        <p className="text-blue-400 text-sm font-medium">Keep tracking to unlock insights!</p>
      </div>
    );
  }

  const width = 500;
  const height = 150;
  const padding = 20;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const points = data.map((record, i) => {
    const x = padding + (i / (data.length - 1)) * chartWidth;
    const y = padding + chartHeight - (record.completionRate / 100) * chartHeight;
    return { x, y, rate: record.completionRate, date: record.date };
  });

  const pathD = points.reduce((acc, point, i) => {
    return i === 0 ? `M ${point.x} ${point.y}` : `${acc} L ${point.x} ${point.y}`;
  }, '');

  const areaD = `${pathD} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`;

  return (
    <div className="bg-white p-6 rounded-3xl border border-blue-100 premium-shadow overflow-hidden">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-sm font-bold text-blue-800 uppercase tracking-wider">Consistency</h3>
        <span className="text-[10px] font-bold text-blue-400 bg-blue-50 px-2 py-1 rounded">Past Fortnight</span>
      </div>
      
      <div className="relative">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
          {[0, 25, 50, 75, 100].map(val => {
            const y = padding + chartHeight - (val / 100) * chartHeight;
            return (
              <g key={val}>
                <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="#f0f9ff" strokeWidth="1" />
                <text x={padding - 5} y={y + 3} textAnchor="end" className="fill-blue-200 text-[8px] font-bold">{val}%</text>
              </g>
            );
          })}

          <path d={areaD} fill="url(#chartGradient)" className="opacity-10" />
          <path d={pathD} fill="none" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />

          {points.map((p, i) => (
            <circle 
              key={i} 
              cx={p.x} 
              cy={p.y} 
              r="4" 
              className="fill-white stroke-blue-600 stroke-2 hover:r-6 transition-all"
            />
          ))}

          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="#fff" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      <div className="mt-4 flex justify-between px-1">
        <div className="flex flex-col">
          <span className="text-[10px] text-blue-300 font-bold uppercase tracking-widest">Avg. Success</span>
          <span className="text-lg font-black text-blue-900">
            {Math.round(data.reduce((acc, d) => acc + d.completionRate, 0) / data.length)}%
          </span>
        </div>
        <div className="flex flex-col text-right">
          <span className="text-[10px] text-blue-300 font-bold uppercase tracking-widest">Health</span>
          <span className="text-lg font-black text-orange-400">Steady</span>
        </div>
      </div>
    </div>
  );
};

export default ProgressChart;
