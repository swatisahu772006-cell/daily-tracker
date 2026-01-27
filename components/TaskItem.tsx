
import React from 'react';
import { Task, TaskPriority } from '../types';
import { CATEGORY_COLORS } from '../constants';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete }) => {
  // Random sticker labels for completed tasks
  const stickers = ['EXCELLENT', 'WELL DONE', 'NAILED IT', 'SUPERB'];
  const stickerIndex = (task.title.length + (task.createdAt % 10)) % stickers.length;

  return (
    <div className={`group relative flex items-start gap-4 p-6 rounded-[2rem] border transition-all duration-500 ${
      task.completed 
        ? 'bg-blue-50/10 border-blue-100/30' 
        : 'bg-white border-blue-100/60 hover:border-blue-300 hover:shadow-[0_15px_40px_rgba(37,99,235,0.06)] active:scale-[0.995]'
    }`}>
      {/* Completed Sticker Stamp */}
      {task.completed && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none rotate-12 z-10 opacity-100 animate-in zoom-in duration-300">
          <div className="px-3 py-1 border-4 border-orange-400 text-orange-400 font-black text-[10px] tracking-widest rounded-lg bg-white/90 shadow-lg shadow-orange-100/50">
            {stickers[stickerIndex]}
          </div>
        </div>
      )}

      {/* Blue Minimalistic Check Trigger */}
      <button
        onClick={() => onToggle(task.id)}
        className={`mt-0.5 w-6 h-6 rounded-full border transition-all duration-500 shrink-0 flex items-center justify-center check-animate relative z-20 ${
          task.completed 
            ? 'bg-blue-600 border-blue-600 text-white' 
            : 'bg-transparent border-blue-200 hover:border-blue-600'
        }`}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className={`h-3.5 w-3.5 transition-transform duration-500 ${task.completed ? 'scale-100' : 'scale-0'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </button>

      <div className="flex-1 min-w-0 relative z-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <span className={`px-2 py-0.5 rounded-md text-[9px] font-bold uppercase tracking-wider border ${CATEGORY_COLORS[task.category]}`}>
            {task.category}
          </span>
          {task.time && (
            <span className="text-[10px] text-blue-400 font-medium">
              {task.time}
            </span>
          )}
        </div>
        <h3 className={`text-[16px] font-bold tracking-tight transition-all duration-500 ${task.completed ? 'text-blue-200 line-through decoration-blue-100' : 'text-slate-900'}`}>
          {task.title}
        </h3>
        {task.description && !task.completed && (
          <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed font-medium opacity-70">{task.description}</p>
        )}
      </div>

      <button
        onClick={() => onDelete(task.id)}
        className="p-2 text-red-200 hover:text-red-500 sm:opacity-0 group-hover:opacity-100 transition-all rounded-lg hover:bg-red-50 shrink-0 relative z-20"
        aria-label="Delete Task"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  );
};

export default TaskItem;
