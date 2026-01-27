
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Task, TaskCategory, DailyRecord } from './types';
import { INITIAL_TASKS, MOTIVATIONAL_QUOTES } from './constants';
import TaskItem from './components/TaskItem';
import TaskForm from './components/TaskForm';
import DashboardHeader from './components/DashboardHeader';
import ProgressChart from './components/ProgressChart';
import SyncCenter from './components/SyncCenter';
import UserGuide from './components/UserGuide';
import { getPerformanceMantra, PerformanceMantraResponse } from './services/geminiService';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('zen_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [history, setHistory] = useState<DailyRecord[]>(() => {
    const saved = localStorage.getItem('zen_history');
    return saved ? JSON.parse(saved) : [];
  });

  const [syncState, setSyncState] = useState(() => {
    const saved = localStorage.getItem('zen_sync');
    return saved ? JSON.parse(saved) : { syncId: null, lastSynced: null, status: 'idle' };
  });

  const [aiMantra, setAiMantra] = useState<PerformanceMantraResponse | null>(null);
  const [loadingMantra, setLoadingMantra] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [showSyncModal, setShowSyncModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [showConfirmFinish, setShowConfirmFinish] = useState(false);
  const [filter, setFilter] = useState<TaskCategory | 'ALL'>('ALL');

  // Fallback mantra while AI is loading
  const fallbackMantra = useMemo(() => {
    const day = new Date().getDate();
    return MOTIVATIONAL_QUOTES[day % MOTIVATIONAL_QUOTES.length];
  }, []);

  const fetchAiMantra = useCallback(async () => {
    setLoadingMantra(true);
    try {
      const response = await getPerformanceMantra(tasks);
      setAiMantra(response);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingMantra(false);
    }
  }, [tasks]);

  // Initial mantra fetch and refresh on meaningful changes
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchAiMantra();
    }, 1200); // Debounce
    return () => clearTimeout(timer);
  }, [tasks.filter(t => t.completed).length, tasks.length, fetchAiMantra]);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const lastActive = localStorage.getItem('zen_last_active');
    if (lastActive && lastActive !== today) {
      const alreadyLogged = history.some(h => h.date === lastActive);
      if (!alreadyLogged) {
        const completedCount = tasks.filter(t => t.completed).length;
        const rate = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;
        setHistory(prev => {
          const updated = [...prev.filter(h => h.date !== lastActive), { date: lastActive, completionRate: rate }];
          return updated.sort((a, b) => b.date.localeCompare(a.date)).slice(0, 60);
        });
      }
      setTasks(prev => prev.map(t => ({ ...t, completed: false, completedAt: undefined })));
    }
    localStorage.setItem('zen_last_active', today);
  }, [history, tasks]);

  useEffect(() => {
    localStorage.setItem('zen_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('zen_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('zen_sync', JSON.stringify(syncState));
  }, [syncState]);

  // Show help on first visit
  useEffect(() => {
    const hasVisited = localStorage.getItem('zen_has_visited');
    if (!hasVisited) {
      setShowHelpModal(true);
      localStorage.setItem('zen_has_visited', 'true');
    }
  }, []);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      switch (e.key.toLowerCase()) {
        case 'n':
          e.preventDefault();
          setShowForm(true);
          break;
        case 'l':
          e.preventDefault();
          setShowSyncModal(true);
          break;
        case 'h':
          e.preventDefault();
          setShowHelpModal(true);
          break;
        case 'escape':
          setShowForm(false);
          setShowSyncModal(false);
          setShowHelpModal(false);
          setShowConfirmFinish(false);
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const addTask = (newTask: Omit<Task, 'id' | 'completed' | 'createdAt'>) => {
    const task: Task = { ...newTask, id: crypto.randomUUID(), completed: false, createdAt: Date.now() };
    setTasks(prev => [task, ...prev]);
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed, completedAt: !t.completed ? Date.now() : undefined } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const finishDay = () => {
    const today = new Date().toISOString().split('T')[0];
    const completedCount = tasks.filter(t => t.completed).length;
    const rate = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;
    const newHistory = [...history.filter(h => h.date !== today), { date: today, completionRate: rate }]
      .sort((a, b) => b.date.localeCompare(a.date)).slice(0, 60);
    setHistory(newHistory);
    setTasks(prev => prev.map(t => ({ ...t, completed: false, completedAt: undefined })));
    setShowConfirmFinish(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const filteredTasks = tasks.filter(t => filter === 'ALL' || t.category === filter);

  // Cloud Sync Mock Handlers
  const enableSync = (id?: string) => {
    const newId = id || Math.random().toString(36).substring(2, 8).toUpperCase();
    setSyncState({ syncId: newId, lastSynced: Date.now(), status: 'success' });
  };
  const forceSync = () => setSyncState(prev => ({ ...prev, lastSynced: Date.now(), status: 'success' }));
  const disconnectSync = () => setSyncState({ syncId: null, lastSynced: null, status: 'idle' });

  return (
    <div className="min-h-screen bg-[#f8fafc] selection:bg-blue-600 selection:text-white pb-24 overflow-x-hidden">
      {/* Decorative Orbs */}
      <div className="fixed top-0 -left-20 w-96 h-96 bg-blue-100/30 blur-[100px] rounded-full -z-10"></div>
      <div className="fixed bottom-0 -right-20 w-80 h-80 bg-orange-100/30 blur-[100px] rounded-full -z-10"></div>

      <div className="max-w-[1280px] mx-auto px-6 py-12 lg:py-20 flex flex-col lg:flex-row gap-16 lg:items-start">
        
        {/* SIDEBAR */}
        <aside className="w-full lg:w-[340px] flex flex-col gap-10 lg:sticky lg:top-20">
          <DashboardHeader 
            tasks={tasks} 
            history={history} 
            syncActive={!!syncState.syncId}
            onOpenSync={() => setShowSyncModal(true)}
            onOpenHelp={() => setShowHelpModal(true)}
          />

          {/* Daily Mantra - AI Powered with Hinglish Explanation */}
          <div className="bg-gradient-to-br from-orange-50 to-blue-50 border border-orange-100/50 p-6 rounded-[2rem] relative overflow-hidden group premium-shadow">
            <div className="absolute top-2 right-2 text-3xl opacity-20 group-hover:scale-125 transition-transform group-hover:rotate-12 duration-500">✨</div>
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-[0.2em]">Daily Focus Mantra</h4>
              <button 
                onClick={fetchAiMantra}
                disabled={loadingMantra}
                className="p-1.5 hover:bg-white/50 rounded-lg transition-all active:scale-90"
                title="Refresh Insight"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-3 w-3 text-blue-400 ${loadingMantra ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </button>
            </div>
            
            <div className="relative min-h-[90px] flex flex-col justify-center space-y-2">
              {loadingMantra ? (
                <div className="space-y-3 w-full animate-pulse">
                  <div className="h-4 bg-blue-100 rounded-full w-full"></div>
                  <div className="h-3 bg-blue-100 rounded-full w-2/3 opacity-60"></div>
                </div>
              ) : (
                <>
                  <p className="text-slate-800 font-black text-lg leading-tight tracking-tight">
                    "{aiMantra?.mantra || fallbackMantra}"
                  </p>
                  {aiMantra?.explanation && (
                    <p className="text-slate-500 font-medium text-[13px] leading-relaxed italic border-l-2 border-orange-200 pl-3">
                      {aiMantra.explanation}
                    </p>
                  )}
                </>
              )}
            </div>
            
            <div className="mt-5 flex items-center gap-3">
              <div className="h-1.5 flex-1 bg-slate-200/40 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 transition-all duration-1000 ease-out" 
                  style={{ width: `${tasks.length > 0 ? (tasks.filter(t => t.completed).length / tasks.length) * 100 : 0}%` }}
                />
              </div>
              <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest whitespace-nowrap">Energy Level</span>
            </div>
          </div>
          
          <div className="hidden lg:block">
            <ProgressChart history={history} />
          </div>

          <div className="hidden lg:block p-6 bg-white border border-blue-50 rounded-[2rem] premium-shadow">
            <h4 className="text-[10px] font-bold text-blue-300 uppercase tracking-widest mb-4">Keyboard Shortcuts</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-600 font-medium">Add Objective</span>
                <kbd className="px-2 py-1 bg-blue-50 border border-blue-100 rounded-lg text-blue-500 font-mono text-[10px]">N</kbd>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-600 font-medium">Open Help</span>
                <kbd className="px-2 py-1 bg-blue-50 border border-blue-100 rounded-lg text-blue-500 font-mono text-[10px]">H</kbd>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-600 font-medium">Open Sync</span>
                <kbd className="px-2 py-1 bg-blue-50 border border-blue-100 rounded-lg text-blue-500 font-mono text-[10px]">L</kbd>
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN */}
        <main className="flex-1 space-y-8">
          <div className="flex items-end justify-between border-b border-blue-100 pb-6">
            <div>
              <h2 className="text-sm font-black text-blue-400 uppercase tracking-[0.2em] mb-1">Your Focus</h2>
              <h3 className="text-3xl font-black text-blue-900 tracking-tighter">Daily Objectives</h3>
            </div>
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="text-[11px] font-bold text-blue-500 bg-white border border-blue-200 px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500/20 hover:border-blue-400 transition-all uppercase tracking-widest cursor-pointer"
            >
              <option value="ALL">All Categories</option>
              {Object.values(TaskCategory).map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-6">
            {filteredTasks.length > 0 ? (
              filteredTasks.map(task => (
                <TaskItem key={task.id} task={task} onToggle={toggleTask} onDelete={deleteTask} />
              ))
            ) : (
              <div className="col-span-full py-20 px-10 text-center bg-white border border-dashed border-blue-200 rounded-[3rem] space-y-6">
                <div className="text-5xl animate-bounce">✍️</div>
                <div className="space-y-2">
                  <p className="text-blue-900 font-black text-xl tracking-tight">Your canvas is blank.</p>
                  <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-[280px] mx-auto">Click below to design your routine and unlock your daily mantra.</p>
                </div>
                <button 
                  onClick={() => setShowForm(true)}
                  className="px-8 py-4 bg-blue-600 text-white rounded-full font-black text-[10px] uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-blue-100"
                >
                  Create First Task
                </button>
              </div>
            )}
          </div>

          {tasks.some(t => t.completed) && filter === 'ALL' && (
            <div className="pt-10 flex flex-col items-center gap-4">
               <div className="text-[10px] font-black text-blue-300 uppercase tracking-widest animate-bounce">Scroll to Finish Day</div>
              <button 
                onClick={() => setShowConfirmFinish(true)}
                className="group flex items-center gap-3 px-10 py-5 bg-blue-600 text-white rounded-full font-black text-xs tracking-[0.2em] uppercase premium-shadow hover:scale-105 active:scale-95 transition-all border-4 border-white"
              >
                Archive Routine
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </div>
          )}
        </main>
      </div>

      {/* FAB */}
      <button
        onClick={() => setShowForm(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center premium-shadow hover:scale-110 active:scale-95 transition-all z-40 border-4 border-white"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
      </button>

      {/* MODALS */}
      {showForm && <TaskForm onAdd={addTask} onClose={() => setShowForm(false)} />}
      
      {showSyncModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-blue-900/20 backdrop-blur-md">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md p-2 text-center premium-shadow animate-in zoom-in-95 duration-300 border border-blue-50 relative">
            <button 
              onClick={() => setShowSyncModal(false)}
              className="absolute top-6 right-6 p-2 text-slate-300 hover:text-slate-600 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <SyncCenter 
              syncState={syncState} 
              onEnableSync={enableSync} 
              onForceSync={forceSync} 
              onDisconnect={disconnectSync} 
            />
          </div>
        </div>
      )}

      {showHelpModal && <UserGuide onClose={() => setShowHelpModal(false)} />}

      {showConfirmFinish && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-blue-900/10 backdrop-blur-md">
          <div className="bg-white rounded-[3rem] w-full max-w-md p-10 text-center space-y-8 premium-shadow animate-in zoom-in-95 duration-300 border border-blue-50">
            <div className="w-24 h-24 bg-orange-50 border border-orange-100 rounded-[2rem] flex items-center justify-center mx-auto rotate-3">
               <span className="text-4xl">🏅</span>
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-black tracking-tighter text-blue-900">Great Progress!</h2>
              <p className="text-slate-500 text-sm leading-relaxed font-medium">Ready to seal today's achievements into your history?</p>
            </div>
            <div className="flex flex-col gap-3">
              <button onClick={finishDay} className="w-full py-5 bg-blue-600 text-white rounded-[1.5rem] font-black tracking-widest uppercase text-[10px] hover:bg-blue-700 transition-all shadow-xl shadow-blue-200">Seal Routine</button>
              <button onClick={() => setShowConfirmFinish(false)} className="w-full py-5 bg-white text-slate-400 rounded-[1.5rem] font-black tracking-widest uppercase text-[10px] hover:text-blue-900 transition-all">Keep Working</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
