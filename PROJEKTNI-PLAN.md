# Mini Habit Tracker - Detaljan Projektni Plan

## Pregled Projekta

- **Tehnologije**: React + Vite + Tailwind CSS
- **Backend**: Supabase (Auth + PostgreSQL + RLS)
- **Deploy**: Vercel
- **Trajanje**: 2 dana intenzivnog rada
- **Autentifikacija**: Email/Password
- **Dark Mode**: Da, s toggle gumbom

---

# DAN 1: Setup i Autentifikacija

## 1.1 Inicijalni Setup Projekta (30-45 min)

### Koraci:

1. **Kreiranje Vite projekta**

   ```bash
   npm create vite@latest mini-habit-tracker -- --template react
   cd mini-habit-tracker
   npm install
   ```

2. **Instalacija dependencija**

   ```bash
   npm install @supabase/supabase-js react-router-dom
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   ```

3. **Konfiguracija Tailwind** (`tailwind.config.js`)

   ```js
   content: ["./index.html", "./src/**/*.{js,jsx}"],
   darkMode: 'class'
   ```

4. **Tailwind direktive** (`src/index.css`)
   ```css
   @tailwind base;
   @tailwind components;
   @tailwind utilities;
   ```

### Folder Struktura:

```
src/
├── components/
│   ├── auth/
│   │   ├── LoginForm.jsx
│   │   └── ProtectedRoute.jsx
│   ├── habits/
│   │   ├── HabitCard.jsx
│   │   ├── HabitList.jsx
│   │   ├── HabitForm.jsx
│   │   └── HabitEntry.jsx
│   └── layout/
│       ├── Header.jsx
│       ├── Layout.jsx
│       └── ThemeToggle.jsx      # Dark mode toggle
├── pages/
│   ├── Login.jsx
│   ├── Dashboard.jsx
│   └── Habits.jsx
├── hooks/
│   ├── useAuth.js
│   ├── useHabits.js
│   └── useTheme.js              # Dark mode hook
├── lib/
│   └── supabase.js
├── context/
│   ├── AuthContext.jsx
│   └── ThemeContext.jsx         # Dark mode context
├── App.jsx
├── main.jsx
└── index.css
```

---

## 1.2 Supabase Setup (45-60 min)

### Koraci na Supabase Dashboard:

1. Idi na https://supabase.com i kreiraj account
2. Kreiraj novi projekt (odaberi regiju blizu tebe)
3. Sačekaj da se baza inicijalizira (~2 min)
4. Idi na Settings > API
5. Kopiraj `Project URL` i `anon/public key`

### Kreiranje .env datoteke:

```env
VITE_SUPABASE_URL=https://psflosereribbwqveznm.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzZmxvc2VyZXJpYmJ3cXZlem5tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU1Mjc0NDQsImV4cCI6MjA4MTEwMzQ0NH0.6PIwRVOWpcy12KAIOH9zu5BJBKeqLzol1okrFI3i5DE
```

### SQL Migracije - Tablice:

Idi na SQL Editor u Supabase i pokreni:

```sql
-- 1. Tablica habits
CREATE TABLE habits (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  color TEXT DEFAULT '#6366f1',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Tablica habit_entries (dnevni unosi)
CREATE TABLE habit_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  habit_id UUID REFERENCES habits(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(habit_id, date)
);

-- 3. Indeksi za performanse
CREATE INDEX idx_habits_user_id ON habits(user_id);
CREATE INDEX idx_habit_entries_habit_id ON habit_entries(habit_id);
CREATE INDEX idx_habit_entries_date ON habit_entries(date);
```

### RLS (Row Level Security) Pravila:

```sql
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
```

---

## 1.3 Supabase Klijent i Auth Context (45 min)

### Datoteke za kreiranje:

1. `src/lib/supabase.js` - Supabase client inicijalizacija
2. `src/context/AuthContext.jsx` - Auth state management
3. `src/hooks/useAuth.js` - Custom hook za auth operacije
4. `src/components/auth/ProtectedRoute.jsx` - Route protection

### Funkcionalnosti:

- Login s email/password
- Registracija
- Logout
- Session listener (onAuthStateChange)
- Automatski redirect za neautorizirane

---

## 1.4 Login/Register Stranica (30-45 min)

### Komponente:

1. `src/pages/Login.jsx` - Stranica s formom
2. `src/components/auth/LoginForm.jsx` - Form komponenta

### Funkcionalnosti:

- Toggle između Login i Register moda
- Validacija email/password
- Error handling i prikaz poruka
- Loading state tijekom auth operacija
- Redirect na Dashboard nakon uspješnog logina

---

# DAN 2: CRUD Operacije i UI

## 2.1 Dashboard Stranica (30-45 min)

### Komponente:

1. `src/pages/Dashboard.jsx`
2. `src/components/layout/Header.jsx`
3. `src/components/layout/Layout.jsx`

### Funkcionalnosti:

- Prikaz današnjeg datuma
- Pregled svih habit-a za danas
- Quick toggle za označavanje habit-a kao completed
- Statistika (streak, postotak završenih)
- Link na upravljanje habit-ima

---

## 2.2 Habits Hook i CRUD Operacije (45-60 min)

### Datoteka: `src/hooks/useHabits.js`

### Funkcije:

```javascript
// Habits CRUD
-fetchHabits() - // Dohvati sve habit-e korisnika
  createHabit(title, description, color) -
  updateHabit(id, updates) -
  deleteHabit(id) -
  // Habit Entries CRUD
  fetchEntriesForDate(date) -
  toggleEntry(habitId, date) - // Toggle completed status
  getHabitStreak(habitId); // Izračunaj streak
```

### SQL funkcija za streak (opcionalno):

```sql
CREATE OR REPLACE FUNCTION get_habit_streak(habit_uuid UUID)
RETURNS INTEGER AS $$
DECLARE
  streak INTEGER := 0;
  check_date DATE := CURRENT_DATE;
  entry_exists BOOLEAN;
BEGIN
  LOOP
    SELECT completed INTO entry_exists
    FROM habit_entries
    WHERE habit_id = habit_uuid AND date = check_date;

    IF entry_exists IS TRUE THEN
      streak := streak + 1;
      check_date := check_date - 1;
    ELSE
      EXIT;
    END IF;
  END LOOP;

  RETURN streak;
END;
$$ LANGUAGE plpgsql;
```

---

## 2.3 Habit Lista i Forme (45-60 min)

### Komponente:

1. `src/pages/Habits.jsx` - Stranica za upravljanje
2. `src/components/habits/HabitList.jsx` - Lista svih habit-a
3. `src/components/habits/HabitCard.jsx` - Pojedinačni habit
4. `src/components/habits/HabitForm.jsx` - Kreiranje/editiranje

### Funkcionalnosti:

- Lista svih habit-a s opcijama Edit/Delete
- Modal ili inline forma za kreiranje
- Color picker za habit boju
- Confirmation prije brisanja

---

## 2.4 Daily Entry Tracking (30-45 min)

### Komponenta: `src/components/habits/HabitEntry.jsx`

### Funkcionalnosti:

- Checkbox za svaki habit
- Vizualni feedback (animacija pri toggle)
- Optimistic UI updates
- Streak prikaz pored svakog habit-a

---

## 2.5 Routing Setup (15-20 min)

### Struktura ruta:

```jsx
<Routes>
  <Route path="/login" element={<Login />} />
  <Route element={<ProtectedRoute />}>
    <Route path="/" element={<Dashboard />} />
    <Route path="/habits" element={<Habits />} />
  </Route>
</Routes>
```

---

## 2.6 Dark Mode Implementacija (20-30 min)

### Tailwind konfiguracija:

```js
// tailwind.config.js
darkMode: "class";
```

### Komponente:

1. `src/context/ThemeContext.jsx` - Theme state management
2. `src/hooks/useTheme.js` - Custom hook
3. `src/components/layout/ThemeToggle.jsx` - Toggle button

### Funkcionalnosti:

- Toggle dark class na `<html>` elementu
- Spremanje preferencije u localStorage
- Ikona sunce/mjesec za toggle

---

## 2.7 Polish i Deploy (30-45 min)

### Tailwind Styling:

- Responsive design (mobile-first)
- Dark mode boje za sve komponente
- Konzistentne boje i spacing

### Vercel Deploy:

1. Push kod na GitHub
2. Poveži repo s Vercel
3. Dodaj environment varijable:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy

---

# Zadaci za Claude (Copy-Paste Promptovi)

## Setup Faza:

- "Generiraj mi `src/lib/supabase.js` s inicijalizacijom klijenta"
- "Napravi AuthContext.jsx s useContext hookom i session listenerom"
- "Kreiraj useAuth.js hook s login, register, logout funkcijama"

## Auth Komponente:

- "Generiraj LoginForm.jsx s toggle između login/register, Tailwind styling"
- "Napravi ProtectedRoute.jsx komponentu za react-router-dom v6"

## Habits Komponente:

- "Kreiraj useHabits.js hook sa svim CRUD operacijama za habits i entries"
- "Generiraj HabitCard.jsx s prikazom naziva, streaka i toggle checkbox"
- "Napravi HabitForm.jsx s inputima za title, description i color picker"
- "Kreiraj Dashboard.jsx s prikazom današnjih habit-a i statistikom"

## Dark Mode:

- "Napravi ThemeContext.jsx i useTheme.js hook za dark mode"
- "Kreiraj ThemeToggle.jsx komponentu s ikonom sunce/mjesec"

## SQL i Supabase:

- "Daj mi SQL za kreiranje tablica habits i habit_entries"
- "Generiraj RLS pravila za habits tablicu"
- "Napravi SQL funkciju za izračun streak-a"

---

# Checklist za Praćenje Napretka

## Dan 1:

- [ ] Vite projekt kreiran
- [ ] Tailwind konfiguriran
- [ ] Folder struktura postavljena
- [ ] Supabase projekt kreiran
- [ ] .env datoteka s ključevima
- [ ] Tablice kreirane (SQL)
- [ ] RLS pravila aktivna
- [ ] Supabase klijent inicijaliziran
- [ ] AuthContext implementiran
- [ ] Login/Register stranica radi
- [ ] Protected routes funkcioniraju

## Dan 2:

- [ ] useHabits hook implementiran
- [ ] Dashboard stranica gotova
- [ ] HabitList komponenta radi
- [ ] Create Habit forma funkcionira
- [ ] Edit/Delete habit radi
- [ ] Daily entry toggle radi
- [ ] Streak prikaz implementiran
- [ ] Dark mode implementiran
- [ ] Responsive styling dovršen
- [ ] Deploy na Vercel uspješan

---

# Napomene

1. **Testiranje RLS pravila**: Koristi Supabase Table Editor za testiranje da korisnici vide samo svoje podatke

2. **Error Handling**: Svaki Supabase poziv treba try/catch i error state

3. **Loading States**: Svaka async operacija treba loading indikator

4. **Optimistic Updates**: Za toggle entry, update UI odmah pa rollback ako API fail

5. **Date Handling**: Koristi `date-fns` ili native Date za konzistentnost timezone-a

6. **Dark Mode Testing**: Testiraj sve komponente u oba moda (light i dark)

---

# Dijagram Tablica

```
┌─────────────────────┐       ┌─────────────────────────┐
│       habits        │       │     habit_entries       │
├─────────────────────┤       ├─────────────────────────┤
│ id (UUID) PK        │───┐   │ id (UUID) PK            │
│ user_id (UUID) FK   │   │   │ habit_id (UUID) FK      │──┐
│ title (TEXT)        │   └──>│ date (DATE)             │  │
│ description (TEXT)  │       │ completed (BOOLEAN)     │  │
│ color (TEXT)        │       │ created_at (TIMESTAMP)  │  │
│ created_at          │       │ UNIQUE(habit_id, date)  │  │
│ updated_at          │       └─────────────────────────┘  │
└─────────────────────┘                                    │
         │                                                 │
         └─────────────────────────────────────────────────┘
```

---

_Ovaj plan je generiran uz pomoć Claude AI._
