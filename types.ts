
export enum TaskCategory {
  WORK = 'Work',
  HEALTH = 'Health',
  PERSONAL = 'Personal',
  LEARNING = 'Learning',
  CHORES = 'Chores',
  OTHER = 'Other'
}

export enum TaskPriority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High'
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  category: TaskCategory;
  priority: TaskPriority;
  completed: boolean;
  time?: string;
  createdAt: number;
  completedAt?: number;
}

export interface DailyRecord {
  date: string; // ISO date string YYYY-MM-DD
  completionRate: number; // 0 to 100
}

export interface SyncState {
  syncId: string | null;
  status: 'idle' | 'syncing' | 'error' | 'success';
  lastSynced: number | null;
}

export interface AIInsight {
  summary: string;
  suggestions: string[];
  motivationalQuote: string;
}

// Added User interface to fix import error in Login.tsx
export interface User {
  email: string;
  name: string;
  photo: string;
}
