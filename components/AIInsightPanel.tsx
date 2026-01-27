
import React from 'react';
import { AIInsight } from '../types';

interface AIInsightPanelProps {
  insight: AIInsight | null;
  loading: boolean;
  onRefresh: () => void;
}

const AIInsightPanel: React.FC<AIInsightPanelProps> = ({ insight, loading, onRefresh }) => {
  return (
    <div className="bg-slate-900 rounded-[2rem] p-7 text-white premium-shadow relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-white/10 transition-all duration-700"></div>
      
      <div className="flex justify-between items-start mb-6 relative z-10">
        <div className="flex items-center gap-3">
          <div className="bg-white/10 p-2.5 rounded-xl border border-white/5">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h3 className="font-bold text-sm tracking-tight text-white/90">AI Assistant</h3>
            <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold">Insights & Coaching</p>
          </div>
        </div>
        <button 
          onClick={onRefresh} 
          disabled={loading}
          className="p-2 hover:bg-white/10 rounded-xl transition-all disabled:opacity-50 border border-transparent hover:border-white/10"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      {loading ? (
        <div className="space-y-4 animate-pulse relative z-10">
          <div className="h-3 bg-white/10 rounded-full w-full"></div>
          <div className="h-3 bg-white/10 rounded-full w-2/3"></div>
          <div className="h-3 bg-white/10 rounded-full w-4/5"></div>
        </div>
      ) : insight ? (
        <div className="space-y-6 relative z-10">
          <p className="text-sm text-slate-300 leading-relaxed font-medium">{insight.summary}</p>
          <div className="space-y-3">
            {insight.suggestions.slice(0, 2).map((s, i) => (
              <div key={i} className="flex gap-3 text-xs text-white/70 bg-white/5 p-3 rounded-xl border border-white/5">
                <span className="text-amber-400 shrink-0 font-bold">→</span>
                {s}
              </div>
            ))}
          </div>
          <div className="pt-6 border-t border-white/10 flex flex-col gap-2">
            <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em]">Focus for today</span>
            <p className="italic text-xs text-slate-400 leading-snug">"{insight.motivationalQuote}"</p>
          </div>
        </div>
      ) : (
        <div className="text-center py-4 relative z-10">
          <p className="text-xs text-slate-400 font-medium leading-relaxed">Refresh to generate a personalized focus strategy for your current routine.</p>
        </div>
      )}
    </div>
  );
};

export default AIInsightPanel;
