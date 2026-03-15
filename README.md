# 🇩🇪 German Learning App

A Next.js 15 + Supabase spaced-repetition flashcard app.

## Stack
- **Next.js 15** with App Router & Server Actions
- **Supabase** (Auth, Postgres, RLS, RPC)
- **Tailwind CSS** — mobile-first, minimal UI

## Project structure

```
app/
  layout.tsx              Root layout
  page.tsx                Dashboard (streak, XP, word list)
  login/page.tsx          Magic-link auth
  auth/callback/route.ts  OAuth callback
  learn/
    page.tsx              Redirects to next due card
    [id]/page.tsx         Server Component – fetches word → passes to FlashCard
components/
  FlashCard.tsx           "use client" – reveal/difficulty buttons → Server Action
  DailyProgress.tsx       Server Component – streak + XP summary
lib/
  actions.ts              updateUserProgress  (Server Action)
  db.ts                   Supabase client helper
  srs.ts                  Interval math + streak helpers
  database.types.ts       TypeScript types for DB schema
supabase/
  schema.sql              Full schema + RLS + trigger + RPC
  seed.sql                10 seed vocabulary words
```

## Setup

### 1. Create a Supabase project
Go to https://supabase.com and create a new project.

### 2. Run the SQL
In the Supabase SQL editor run `supabase/schema.sql`, then `supabase/seed.sql`.

### 3. Configure environment
Copy `.env.local` and fill in your values:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

### 4. Install & run
```bash
npm install
npm run dev
```

Open http://localhost:3000.

## How it works

### Spaced Repetition (SRS)
After revealing a card the user rates their recall: **Again / Hard / Good / Easy**.
Each rating maps to a difficulty value (0–4) which selects a review interval:

| Button | Difficulty | Next review |
|--------|-----------|-------------|
| Easy   | 0         | +30 days    |
| Good   | 1         | +7 days     |
| Hard   | 3         | +3 days     |
| Again  | 4         | +1 day      |

### Streak logic (in `lib/actions.ts`)
- Last review **today** → streak unchanged (no double-count)
- Last review **yesterday** → streak + 1
- Last review **older** → streak resets to 1

### XP
10 XP awarded per unique daily review (not per re-flip on the same day).
