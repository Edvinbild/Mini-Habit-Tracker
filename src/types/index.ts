// User tip (iz Supabase Auth)
export interface User {
  id: string;
  email: string;
  created_at: string;
}

// Habit tip
export interface Habit {
  id: string;
  user_id: string;
  title: string;
  description: string | null;
  color: string;
  category: string;
  created_at: string;
  updated_at: string;
}

// Predložene kategorije
export const DEFAULT_CATEGORIES = [
  'Zdravlje',
  'Produktivnost',
  'Učenje',
  'Fitness',
  'Mindfulness',
  'Ostalo'
] as const;

export type CategoryType = typeof DEFAULT_CATEGORIES[number] | string;

// HabitEntry tip (dnevni unos)
export interface HabitEntry {
  id: string;
  habit_id: string;
  date: string;
  completed: boolean;
  note: string | null;
  created_at: string;
}

// Habit s uključenim unosima za danas
export interface HabitWithEntry extends Habit {
  todayEntry?: HabitEntry;
  streak?: number;
}
