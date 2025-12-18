# Feature Ideas - Mini Habit Tracker

Lista predloženih features-a za buduće verzije aplikacije.

---

## Trenutno Stanje Projekta

Projekt je ~95% završen. Implementirano:
- Autentifikacija (login/register/logout)
- CRUD operacije za habits
- Daily entry tracking s toggle checkbox
- Dark mode
- Responsive dizajn
- ✅ Streak prikaz na svakom habit-u
- ✅ Kalendar heatmap s poviješću i retroaktivnim označavanjem
- ✅ Statistika stranica s grafovima
- ✅ Kategorije/tagovi s filtriranjem
- ✅ Bilješke uz unose s view/edit modom

---

## ✅ Implementirani Features

### 1. Prikaz Streak-a na Dashboard-u ✅
**Status: IMPLEMENTIRANO**

- Streak badge pored svakog habit-a (🔥 ikona s brojem dana)
- Vizualni feedback za streak-ove

---

### 2. Kalendar View / Povijest ✅
**Status: IMPLEMENTIRANO**

- Mjesečni kalendar heatmap (GitHub-style)
- Navigacija između mjeseci
- DayModal za pregled i toggle habit-a po datumu
- Retroaktivno označavanje prošlih dana
- Ikona bilješke na danima s notama

---

### 3. Statistika i Analitika ✅
**Status: IMPLEMENTIRANO**

- `/stats` stranica s detaljnim statistikama
- Ukupni postotak uspješnosti
- Najbolji streak ikad (best streak)
- Tjedni grafovi
- Statistike po habit-u

---

### 4. Kategorije/Tagovi za Habits ✅
**Status: IMPLEMENTIRANO**

- Grupiranje habit-a po kategorijama (Zdravlje, Produktivnost, Učenje, Fitness, Mindfulness, Ostalo)
- CategoryFilter komponenta za filtriranje
- Category badge na svakom habit-u
- Mogućnost kreiranja custom kategorija

---

### 6. Bilješke uz Unose ✅
**Status: IMPLEMENTIRANO**

- EntryNotesModal s view/edit modom
- Ikona bilješke na HabitEntry (puna/prazna)
- Ikona bilješke u kalendaru za dane s notama
- Max 500 karaktera po bilješci

---

## Neimplementirani Features

### 5. Notifikacije/Podsjetnici
**Prioritet: Srednji** | **Složenost: Visoka**

**Što dodati:**
- Push notifikacije (browser notifications)
- Email podsjetnici
- Konfigurabilan timing (jutro, večer)

---

### 7. Ciljevi i Milestones
**Prioritet: Nizak** | **Složenost: Srednja**

**Što dodati:**
- Postavljanje cilja (npr. "30 dana za redom")
- Celebration animacija kod dostizanja milestones
- Badge/achievement sistem

---

### 8. PWA (Progressive Web App)
**Prioritet: Nizak** | **Složenost: Srednja**

**Što dodati:**
- Offline podrška
- Instalabilnost na mobile
- Service worker za caching

---

### 9. Habit Templates
**Prioritet: Nizak** | **Složenost: Niska**

**Što dodati:**
- Predloženi habits za brzi start (Meditacija, Vježbanje, Čitanje...)
- Import/export habit-a

---

### 10. Social Features (Opcionalno)
**Prioritet: Vrlo nizak** | **Složenost: Visoka**

**Što dodati:**
- Dijeljenje napretka s prijateljima
- Accountability partners
- Leaderboard-ovi

---

## Preporučeni Sljedeći Koraci

1. **PWA** - omogućiti instalaciju na mobile
2. **Ciljevi i Milestones** - gamifikacija
3. **Notifikacije** - podsjetnici za habit-e
4. Ostalo prema potrebi

---

## Potrebne Database Promjene

### ✅ Za Kategorije (IMPLEMENTIRANO):
```sql
ALTER TABLE habits ADD COLUMN category TEXT DEFAULT 'Ostalo';
```

### ✅ Za Bilješke (IMPLEMENTIRANO):
```sql
ALTER TABLE habit_entries ADD COLUMN note TEXT DEFAULT NULL;
```

### Za Ciljeve (budući feature):
```sql
ALTER TABLE habits ADD COLUMN goal_days INTEGER;
ALTER TABLE habits ADD COLUMN goal_start_date DATE;
```

---

*Generirano uz pomoć Claude AI*
