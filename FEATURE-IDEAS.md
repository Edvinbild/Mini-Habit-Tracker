# Feature Ideas - Mini Habit Tracker

Lista predloženih features-a za buduće verzije aplikacije.

---

## Trenutno Stanje Projekta

Projekt je ~85-90% završen. Implementirano:
- Autentifikacija (login/register/logout)
- CRUD operacije za habits
- Daily entry tracking s toggle checkbox
- Dark mode
- Responsive dizajn

---

## Predloženi Features

### 1. Prikaz Streak-a na Dashboard-u
**Prioritet: Visok** | **Složenost: Niska**

Streak funkcionalnost već postoji u `useHabits.ts`, ali nije povezana s UI-jem.

**Što dodati:**
- Prikazati streak badge pored svakog habit-a
- Motivacijski elementi (npr. "7 dana za redom!")
- Vizualni feedback za duge streak-ove

---

### 2. Kalendar View / Povijest
**Prioritet: Visok** | **Složenost: Srednja**

Trenutno se vidi samo današnji dan. Korisnici žele vidjeti svoju povijest.

**Što dodati:**
- Mjesečni kalendar s oznakama za svaki habit
- Heatmap vizualizacija (kao GitHub contributions)
- Mogućnost označavanja prošlih dana (ako su zaboravili)

---

### 3. Statistika i Analitika
**Prioritet: Srednji** | **Složenost: Srednja**

**Što dodati:**
- Ukupni postotak uspješnosti po habit-u
- Tjedni/mjesečni grafovi
- Najbolji streak ikad
- Prosječni broj completions po tjednu

---

### 4. Kategorije/Tagovi za Habits
**Prioritet: Srednji** | **Složenost: Srednja**

**Što dodati:**
- Grupiranje habit-a po kategorijama (Zdravlje, Produktivnost, Učenje...)
- Filtriranje po kategoriji
- Ikone za kategorije

---

### 5. Notifikacije/Podsjetnici
**Prioritet: Srednji** | **Složenost: Visoka**

**Što dodati:**
- Push notifikacije (browser notifications)
- Email podsjetnici
- Konfigurabilan timing (jutro, večer)

---

### 6. Bilješke uz Unose
**Prioritet: Nizak** | **Složenost: Niska**

**Što dodati:**
- Mogućnost dodavanja kratke bilješke kada označiš habit
- Journal/dnevnik po danu
- Praćenje razloga za missed habits

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

## Preporučeni Redoslijed Implementacije

1. **Prikaz Streak-a** - brzo za napraviti, već postoji logika
2. **Kalendar View** - velik UX improvement
3. **Statistika** - korisnici vole vidjeti napredak
4. **Kategorije** - organizacija za korisnike s više habit-a
5. Ostalo prema potrebi

---

## Potrebne Database Promjene

### Za Kategorije:
```sql
ALTER TABLE habits ADD COLUMN category TEXT;
```

### Za Bilješke:
```sql
ALTER TABLE habit_entries ADD COLUMN note TEXT;
```

### Za Ciljeve:
```sql
ALTER TABLE habits ADD COLUMN goal_days INTEGER;
ALTER TABLE habits ADD COLUMN goal_start_date DATE;
```

---

*Generirano uz pomoć Claude AI*
