
import React from 'react';
import { Task, DailyRecord } from '../types';

interface DashboardHeaderProps {
  tasks: Task[];
  history: DailyRecord[];
  syncActive: boolean;
  onOpenSync: () => void;
  onOpenHelp: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ tasks, history, syncActive, onOpenSync, onOpenHelp }) => {
  const completedCount = tasks.filter(t => t.completed).length;
  const progress = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  const calculateStreak = () => {
    let streak = 0;
    const sortedHistory = [...history].sort((a, b) => b.date.localeCompare(a.date));
    if (progress >= 50) streak++;
    for (const record of sortedHistory) {
      if (record.completionRate >= 50) streak++;
      else break;
    }
    return streak;
  };

  const getWeeklyDays = () => {
    const days = [];
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const record = history.find(h => h.date === dateStr);
      days.push({
        label: d.toLocaleDateString('en-US', { weekday: 'narrow' }),
        rate: i === 0 ? progress : (record?.completionRate || 0),
        isToday: i === 0
      });
    }
    return days;
  };

  const streak = calculateStreak();
  const weeklyDays = getWeeklyDays();

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <p className="text-[11px] font-bold text-blue-400 uppercase tracking-[0.2em]">{today}</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={onOpenHelp}
              className="p-2.5 rounded-2xl bg-white border border-blue-50 text-blue-400 hover:text-blue-600 transition-all active:scale-95 shadow-sm"
              title="App Guide"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>
            <button 
              onClick={onOpenSync}
              className={`p-2.5 rounded-2xl transition-all active:scale-95 ${syncActive ? 'bg-blue-600 text-white' : 'bg-orange-50 text-orange-400 border border-orange-100'}`}
              title="Sync Data"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.5 3c1.557 0 3.046.727 4 2.015C12.454 3.727 13.943 3 15.5 3c2.786 0 5.25 2.322 5.25 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001Z" />
              </svg>
            </button>
          </div>
        </div>
        <div className="flex items-end justify-between">
          <h1 className="text-4xl font-extrabold tracking-tighter text-blue-900">Routine</h1>
          {streak > 0 && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-400 text-white rounded-full text-[10px] font-black uppercase tracking-widest premium-shadow">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.334-.398-1.817a1 1 0 00-1.487-.876 7.998 7.998 0 00-4.391 7.703c.034.273.055.547.057.822a7.993 7.993 0 0015.986 0c.003-.275-.018-.549-.052-.822a7.999 7.999 0 00-4.526-7.702z" clipRule="evenodd" />
              </svg>
              {streak} Days
            </div>
          )}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-end">
          <span className="text-[10px] font-black text-blue-300 uppercase tracking-widest">Daily Progress</span>
          <span className="text-xl font-black text-blue-600 tracking-tighter">{Math.round(progress)}%</span>
        </div>
        <div className="h-1.5 w-full bg-blue-50 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-600 transition-all duration-1000 ease-[cubic-bezier(0.19,1,0.22,1)]"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {weeklyDays.map((day, idx) => (
          <div key={idx} className="flex flex-col items-center gap-2">
            <span className={`text-[9px] font-black ${day.isToday ? 'text-blue-900' : 'text-blue-200'}`}>{day.label}</span>
            <div className={`w-full aspect-square rounded-lg flex items-center justify-center transition-all duration-500 ${
              day.rate >= 80 ? 'bg-blue-600 text-white' : 
              day.rate > 0 ? 'bg-blue-50 text-blue-300' : 'border border-dashed border-blue-100'
            }`}>
              {day.rate >= 80 ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DashboardHeader;
