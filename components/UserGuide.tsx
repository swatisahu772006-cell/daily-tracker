
import React from 'react';

interface UserGuideProps {
  onClose: () => void;
}

const UserGuide: React.FC<UserGuideProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-blue-900/20 backdrop-blur-md">
      <div className="bg-white rounded-[3rem] w-full max-w-lg p-8 sm:p-12 shadow-2xl border border-blue-50 overflow-y-auto max-h-[90vh] custom-scrollbar animate-in zoom-in-95 duration-300">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h2 className="text-3xl font-black text-blue-900 tracking-tighter">Getting Started</h2>
            <p className="text-xs text-blue-400 font-bold uppercase tracking-widest mt-1">Master Your Routine</p>
          </div>
          <button onClick={onClose} className="p-3 bg-blue-50 text-blue-400 rounded-2xl hover:text-blue-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-10">
          <section className="space-y-4">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
              <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-[10px]">01</span>
              How to Download
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[11px] font-bold text-blue-500 uppercase mb-2">iOS / Safari</p>
                <p className="text-xs text-slate-600 leading-relaxed">Tap the <strong>Share</strong> icon then select <strong>"Add to Home Screen"</strong>.</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <p className="text-[11px] font-bold text-blue-500 uppercase mb-2">Android / Chrome</p>
                <p className="text-xs text-slate-600 leading-relaxed">Tap the <strong>three dots</strong> then select <strong>"Install app"</strong>.</p>
              </div>
            </div>
          </section>

          <section className="space-y-4">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
              <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-[10px]">02</span>
              AI Performance Mantra
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              The top-left card generates a unique motivation quote based on your completion rate. 
              The <strong>Hinglish explanation</strong> (Hindi in English words) gives you a relatable perspective on your energy levels!
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest flex items-center gap-2">
              <span className="w-6 h-6 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-[10px]">03</span>
              Finishing the Day
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              When you're done, scroll to the bottom and tap <strong>Archive Routine</strong>. 
              This clears your list and updates your 14-day consistency chart.
            </p>
          </section>
        </div>

        <button 
          onClick={onClose}
          className="w-full mt-10 py-5 bg-blue-600 text-white rounded-[1.5rem] font-black uppercase tracking-widest text-[10px] shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all"
        >
          Got it, let's go!
        </button>
      </div>
    </div>
  );
};

export default UserGuide;
