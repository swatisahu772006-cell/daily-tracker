
import React, { useState } from 'react';
import { TaskCategory, TaskPriority, Task } from '../types';

interface TaskFormProps {
  onAdd: (task: Omit<Task, 'id' | 'completed' | 'createdAt'>) => void;
  onClose: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ onAdd, onClose }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<TaskCategory>(TaskCategory.PERSONAL);
  const [priority, setPriority] = useState<TaskPriority>(TaskPriority.MEDIUM);
  const [time, setTime] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd({ title, description, category, priority, time });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-blue-900/20 backdrop-blur-sm">
      <div className="bg-white rounded-t-[3rem] sm:rounded-[3rem] w-full max-w-xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom sm:zoom-in duration-300 max-h-[95vh] flex flex-col border border-blue-50">
        <div className="p-6 sm:p-8 border-b border-blue-50 flex justify-between items-center bg-white sticky top-0 z-10">
          <div>
            <h2 className="text-2xl font-black text-blue-900">New Objective</h2>
            <p className="text-xs text-blue-400 font-bold uppercase tracking-widest mt-1">Design Your Day</p>
          </div>
          <button 
            onClick={onClose} 
            className="p-3 bg-blue-50 text-blue-400 hover:text-blue-600 rounded-2xl transition-colors active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 overflow-y-auto custom-scrollbar">
          <div className="space-y-2">
            <label className="block text-xs font-black text-blue-400 uppercase tracking-widest">Objective Title</label>
            <input
              autoFocus
              required
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-5 py-4 rounded-[1.25rem] bg-blue-50/50 border-2 border-transparent focus:bg-white focus:border-blue-500 transition-all outline-none text-blue-900 font-semibold text-lg"
              placeholder="What's the goal?"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-black text-blue-400 uppercase tracking-widest">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-5 py-4 rounded-[1.25rem] bg-blue-50/50 border-2 border-transparent focus:bg-white focus:border-blue-500 transition-all outline-none resize-none h-24 text-slate-700 font-medium"
              placeholder="Optional details..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-xs font-black text-blue-400 uppercase tracking-widest">Category</label>
              <div className="relative">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as TaskCategory)}
                  className="w-full px-5 py-4 rounded-[1.25rem] bg-blue-50/50 border-2 border-transparent focus:bg-white focus:border-blue-500 transition-all outline-none appearance-none font-bold text-blue-900"
                >
                  {Object.values(TaskCategory).map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-blue-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <label className="block text-xs font-black text-blue-400 uppercase tracking-widest">Target Time</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-5 py-4 rounded-[1.25rem] bg-blue-50/50 border-2 border-transparent focus:bg-white focus:border-blue-500 transition-all outline-none font-bold text-blue-900"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-black text-blue-400 uppercase tracking-widest">Priority</label>
            <div className="grid grid-cols-3 gap-3">
              {Object.values(TaskPriority).map(p => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPriority(p)}
                  className={`py-4 rounded-[1.25rem] text-sm font-black border-2 transition-all ${
                    priority === p 
                      ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-100' 
                      : 'bg-white border-blue-50 text-blue-400 hover:border-blue-200'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-5 mt-4 bg-blue-600 text-white rounded-[1.5rem] font-black text-lg shadow-2xl shadow-blue-200 hover:bg-blue-700 transition-all transform active:scale-[0.98]"
          >
            Create Routine Task
          </button>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
