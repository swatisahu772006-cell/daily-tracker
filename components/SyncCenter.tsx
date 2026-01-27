
import React, { useState } from 'react';
import { SyncState } from '../types';

interface SyncCenterProps {
  syncState: SyncState;
  onEnableSync: (id?: string) => void;
  onForceSync: (direction: 'push' | 'pull') => void;
  onDisconnect: () => void;
}

const SyncCenter: React.FC<SyncCenterProps> = ({ syncState, onEnableSync, onForceSync, onDisconnect }) => {
  const [inputKey, setInputKey] = useState('');
  const [showInput, setShowInput] = useState(false);

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputKey.trim().length === 6) {
      onEnableSync(inputKey.trim().toUpperCase());
      setShowInput(false);
      setInputKey('');
    }
  };

  if (!syncState.syncId) {
    return (
      <div className="p-10 space-y-8">
        <div className="flex flex-col items-center text-center gap-4">
          <div className="bg-orange-50 p-6 rounded-[2rem] text-orange-400 border border-orange-100 shadow-xl shadow-orange-100/20">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.5 3c1.557 0 3.046.727 4 2.015C12.454 3.727 13.943 3 15.5 3c2.786 0 5.25 2.322 5.25 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001Z" />
            </svg>
          </div>
          <div className="space-y-1">
            <h3 className="text-2xl font-black text-slate-800 tracking-tight">Cloud Sync</h3>
            <p className="text-sm text-slate-500 leading-relaxed max-w-[240px]">
              Secure your daily objectives across all your refined devices.
            </p>
          </div>
        </div>
        
        {showInput ? (
          <form onSubmit={handleJoin} className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <input 
              autoFocus
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              placeholder="6-char ID"
              maxLength={6}
              className="w-full px-4 py-5 rounded-2xl bg-blue-50/50 border-2 border-transparent focus:bg-white focus:border-blue-500 text-xl font-mono text-center uppercase outline-none text-blue-900 font-bold"
            />
            <div className="flex gap-2">
              <button type="submit" className="flex-1 py-4 bg-blue-600 text-white rounded-2xl text-sm font-black uppercase tracking-widest shadow-xl shadow-blue-100">Connect</button>
              <button type="button" onClick={() => setShowInput(false)} className="px-6 py-4 bg-slate-100 text-slate-500 rounded-2xl text-xs font-bold uppercase tracking-widest">Back</button>
            </div>
          </form>
        ) : (
          <div className="flex flex-col gap-3">
            <button 
              onClick={() => onEnableSync()}
              className="w-full py-5 bg-blue-600 text-white rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-xs shadow-2xl shadow-blue-200 hover:bg-blue-700 transition-all hover:scale-[1.02] active:scale-95"
            >
              Generate New ID
            </button>
            <button 
              onClick={() => setShowInput(true)}
              className="w-full py-5 bg-white border-2 border-blue-100 text-blue-600 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-xs hover:bg-blue-50 transition-all active:scale-95"
            >
              Join Existing Sync
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-10 space-y-8 animate-in zoom-in-95 duration-300">
      <div className="flex flex-col items-center gap-4">
        <div className="w-20 h-20 rounded-[2.5rem] bg-blue-600 flex items-center justify-center text-white shadow-2xl shadow-blue-200">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <div className="text-center">
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">Sync Active</h3>
          <p className="text-xs text-blue-400 font-bold uppercase tracking-widest mt-1">Connectivity Premium</p>
        </div>
      </div>
      
      <div className="bg-blue-50/50 p-6 rounded-[2rem] flex flex-col items-center gap-2 border-2 border-blue-100 shadow-inner">
        <span className="text-[10px] font-black text-blue-300 uppercase tracking-[0.3em]">Access Code</span>
        <span className="text-4xl font-black text-blue-600 font-mono tracking-tighter">{syncState.syncId}</span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button 
          onClick={() => onForceSync('push')}
          className="flex flex-col items-center gap-2 p-5 bg-white border-2 border-blue-50 rounded-[1.5rem] hover:border-blue-200 hover:shadow-xl hover:shadow-blue-100/20 transition-all group"
        >
          <div className="p-3 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-blue-600">Cloud Push</span>
        </button>
        <button 
          onClick={() => onForceSync('pull')}
          className="flex flex-col items-center gap-2 p-5 bg-white border-2 border-blue-50 rounded-[1.5rem] hover:border-blue-200 hover:shadow-xl hover:shadow-blue-100/20 transition-all group"
        >
          <div className="p-3 bg-orange-50 text-orange-400 rounded-xl group-hover:bg-orange-400 group-hover:text-white transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
            </svg>
          </div>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-orange-400">Cloud Pull</span>
        </button>
      </div>

      <button onClick={onDisconnect} className="w-full py-4 text-[10px] font-black text-red-400 hover:text-red-600 uppercase tracking-[0.3em] transition-colors border-t border-slate-50 pt-8">
        Terminate Sync Session
      </button>
    </div>
  );
};

export default SyncCenter;
