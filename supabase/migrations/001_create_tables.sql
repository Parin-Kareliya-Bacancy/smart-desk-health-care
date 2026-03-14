-- ============================================================
-- ChronoCare AI — Supabase schema
-- Tables: profiles, vitals, medications, alerts
-- ============================================================

-- 1. PROFILES
-- Linked to Supabase Auth (auth.users)
create table if not exists public.profiles (
  id         uuid primary key references auth.users(id) on delete cascade,
  email      text not null,
  full_name  text not null,
  role       text not null check (role in ('patient', 'doctor')),
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Users can read own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Doctors can read all profiles"
  on public.profiles for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'doctor'
    )
  );

-- Auto-create a profile row when a new user signs up
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(new.raw_user_meta_data ->> 'role', 'patient')
  );
  return new;
end;
$$;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 2. VITALS
create table if not exists public.vitals (
  id          uuid primary key default gen_random_uuid(),
  patient_id  uuid not null references public.profiles(id) on delete cascade,
  type        text not null check (type in ('heart_rate', 'blood_pressure', 'temperature', 'oxygen')),
  value       numeric not null,
  unit        text not null,
  recorded_at timestamptz not null default now()
);

alter table public.vitals enable row level security;

create policy "Patients can read own vitals"
  on public.vitals for select
  using (auth.uid() = patient_id);

create policy "Patients can insert own vitals"
  on public.vitals for insert
  with check (auth.uid() = patient_id);

create policy "Doctors can read all vitals"
  on public.vitals for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'doctor'
    )
  );

create index idx_vitals_patient on public.vitals (patient_id, recorded_at desc);

-- 3. MEDICATIONS
create table if not exists public.medications (
  id           uuid primary key default gen_random_uuid(),
  patient_id   uuid not null references public.profiles(id) on delete cascade,
  name         text not null,
  dosage       text not null,
  frequency    text not null,
  next_dose_at timestamptz not null,
  is_active    boolean not null default true
);

alter table public.medications enable row level security;

create policy "Patients can read own medications"
  on public.medications for select
  using (auth.uid() = patient_id);

create policy "Doctors can read all medications"
  on public.medications for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'doctor'
    )
  );

create policy "Doctors can manage medications"
  on public.medications for all
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'doctor'
    )
  );

create policy "Patients can update own medications"
  on public.medications for update
  using (auth.uid() = patient_id);

create index idx_medications_patient on public.medications (patient_id, next_dose_at asc);

-- 4. ALERTS
create table if not exists public.alerts (
  id           uuid primary key default gen_random_uuid(),
  patient_id   uuid not null references public.profiles(id) on delete cascade,
  title        text not null,
  message      text not null,
  severity     text not null check (severity in ('low', 'medium', 'high')),
  created_at   timestamptz not null default now(),
  acknowledged boolean not null default false
);

alter table public.alerts enable row level security;

create policy "Patients can read own alerts"
  on public.alerts for select
  using (auth.uid() = patient_id);

create policy "Patients can acknowledge own alerts"
  on public.alerts for update
  using (auth.uid() = patient_id);

create policy "Doctors can read all alerts"
  on public.alerts for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'doctor'
    )
  );

create policy "Doctors can manage alerts"
  on public.alerts for all
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'doctor'
    )
  );

create index idx_alerts_patient on public.alerts (patient_id, created_at desc);
