# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

- Uvijek pročitaj plan @PROJEKTNI-PLAN.md prije rada na tasku

## Commands

```bash
npm run dev      # Start development server (http://localhost:5173)
npm run build    # TypeScript check + production build
npm run lint     # ESLint for .ts and .tsx files
npm run preview  # Preview production build
```

## Architecture

**Tech Stack:** React + TypeScript + Vite + Tailwind CSS + Supabase

### Core Structure

```
src/
├── context/AuthContext.tsx   # Auth state, session listener, useAuth hook
├── components/auth/          # LoginForm, ProtectedRoute
├── components/habits/        # HabitCard, HabitList, HabitForm, HabitEntry
├── components/layout/        # Header, Layout, ThemeToggle
├── pages/                    # Login, Dashboard, Habits
├── hooks/                    # useHabits (CRUD operations)
├── lib/supabase.ts           # Supabase client
├── types/index.ts            # Habit, HabitEntry, HabitWithEntry types
```

### Authentication Flow

- `AuthProvider` wraps the app, manages session via `supabase.auth.onAuthStateChange`
- `useAuth()` hook provides: `user`, `session`, `loading`, `signIn`, `signUp`, `signOut`
- `ProtectedRoute` redirects unauthenticated users to `/login`

### Database Schema (Supabase)

- **habits**: id, user_id, title, description, color, created_at, updated_at
- **habit_entries**: id, habit_id, date, completed, created_at (unique: habit_id + date)
- RLS policies ensure users only access their own data

### Styling

- Tailwind CSS with `darkMode: 'class'`
- Dark mode classes: `dark:bg-gray-900`, `dark:text-white`, etc.

## Environment Variables

Required in `.env`:

```
VITE_SUPABASE_URL=<supabase-project-url>
VITE_SUPABASE_ANON_KEY=<supabase-anon-key>
```

## Database Setup

SQL migrations are in `supabase/migrations.sql`. Run in Supabase SQL Editor to create tables and RLS policies.
