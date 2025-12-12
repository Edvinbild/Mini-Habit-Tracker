-- ============================================
-- MINI HABIT TRACKER - DATABASE SETUP
-- ============================================
-- Run this SQL in Supabase SQL Editor
-- (Dashboard > SQL Editor > New Query)
-- ============================================

-- 1. TABLICE
-- ============================================

-- Tablica habits
CREATE TABLE habits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#6366f1',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tablica habit_entries (dnevni unosi)
CREATE TABLE habit_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  habit_id UUID REFERENCES habits(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(habit_id, date)
);

-- 2. INDEKSI ZA PERFORMANSE
-- ============================================

CREATE INDEX idx_habits_user_id ON habits(user_id);
CREATE INDEX idx_habit_entries_habit_id ON habit_entries(habit_id);
CREATE INDEX idx_habit_entries_date ON habit_entries(date);

-- 3. ROW LEVEL SECURITY (RLS)
-- ============================================

-- Uključi RLS na tablicama
ALTER TABLE habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE habit_entries ENABLE ROW LEVEL SECURITY;

-- Pravila za habits tablicu
CREATE POLICY "Users can view own habits" ON habits
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own habits" ON habits
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own habits" ON habits
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own habits" ON habits
  FOR DELETE USING (auth.uid() = user_id);

-- Pravila za habit_entries tablicu
CREATE POLICY "Users can view own habit entries" ON habit_entries
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM habits
      WHERE habits.id = habit_entries.habit_id
      AND habits.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own habit entries" ON habit_entries
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM habits
      WHERE habits.id = habit_entries.habit_id
      AND habits.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own habit entries" ON habit_entries
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM habits
      WHERE habits.id = habit_entries.habit_id
      AND habits.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own habit entries" ON habit_entries
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM habits
      WHERE habits.id = habit_entries.habit_id
      AND habits.user_id = auth.uid()
    )
  );

-- ============================================
-- DONE! Tablice i RLS pravila su postavljena.
-- ============================================
