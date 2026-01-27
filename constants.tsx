
import { TaskCategory, TaskPriority } from './types';

export const CATEGORY_COLORS: Record<TaskCategory, string> = {
  [TaskCategory.WORK]: 'bg-blue-50 text-blue-700 border-blue-100',
  [TaskCategory.HEALTH]: 'bg-orange-50 text-orange-700 border-orange-100', // Peach
  [TaskCategory.PERSONAL]: 'bg-indigo-50 text-indigo-700 border-indigo-100',
  [TaskCategory.LEARNING]: 'bg-sky-50 text-sky-700 border-sky-100',
  [TaskCategory.CHORES]: 'bg-red-50 text-red-700 border-red-100',
  [TaskCategory.OTHER]: 'bg-slate-50 text-slate-500 border-slate-100',
};

export const PRIORITY_COLORS: Record<TaskPriority, string> = {
  [TaskPriority.LOW]: 'text-blue-300',
  [TaskPriority.MEDIUM]: 'text-blue-600',
  [TaskPriority.HIGH]: 'text-red-500 font-bold',
};

export const MOTIVATIONAL_QUOTES = [
  "Your routine is your signature on the day.",
  "Small wins are the seeds of giant achievements.",
  "Focus is a muscle. Today is training day.",
  "Excellence is not an act, but a habit.",
  "The secret of your future is hidden in your daily routine."
];

export const INITIAL_TASKS = [
  {
    id: '1',
    title: 'Morning Momentum',
    description: 'Establish focus with deep breathing and hydration.',
    category: TaskCategory.HEALTH,
    priority: TaskPriority.HIGH,
    completed: false,
    time: '07:00',
    createdAt: Date.now(),
  },
  {
    id: '2',
    title: 'Blue-Sky Strategy',
    description: 'High-level planning for the primary objectives.',
    category: TaskCategory.WORK,
    priority: TaskPriority.HIGH,
    completed: false,
    time: '09:00',
    createdAt: Date.now(),
  },
];
