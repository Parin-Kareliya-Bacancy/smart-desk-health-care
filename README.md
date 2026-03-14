# ChronoCare AI

Production-ready Next.js 14 starter for remote patient monitoring, powered by Supabase.

## Stack

- Next.js 14 (App Router, TypeScript)
- Tailwind CSS
- Supabase (database + auth) with Supabase JS client
- Zod + React Hook Form
- TanStack Query
- Recharts
- shadcn/ui

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Set environment variables (see `.env.example`):

```
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

3. Run the dev server:

```bash
npm run dev
```

## Supabase Tables (starter schema)

Create the following tables in Supabase to back the starter services:

```sql
-- profiles
create table if not exists profiles (
  id uuid primary key,
  email text not null,
  full_name text not null,
  role text not null
);

-- vitals
create table if not exists vitals (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null,
  type text not null,
  value numeric not null,
  unit text not null,
  recorded_at timestamptz not null default now()
);

-- medications
create table if not exists medications (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null,
  name text not null,
  dosage text not null,
  frequency text not null,
  next_dose_at timestamptz,
  is_active boolean not null default true
);

-- alerts
create table if not exists alerts (
  id uuid primary key default gen_random_uuid(),
  patient_id uuid not null,
  title text not null,
  message text not null,
  severity text not null,
  created_at timestamptz not null default now(),
  acknowledged boolean not null default false
);
```

## Project Structure

```
src/
  app/
  components/
  hooks/
  lib/
  services/
  types/
```
