-- ============================================================
-- Fix: Grant permissions to authenticated/anon roles
-- and create the missing appointments table
-- ============================================================

-- Grant table access to authenticated and anon roles
grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on all tables in schema public to authenticated;
grant select on all tables in schema public to anon;

-- Ensure future tables also get these grants
alter default privileges in schema public
  grant select, insert, update, delete on tables to authenticated;
alter default privileges in schema public
  grant select on tables to anon;

-- Grant sequence usage (needed for auto-generated UUIDs)
grant usage on all sequences in schema public to authenticated;
alter default privileges in schema public
  grant usage on sequences to authenticated;

-- ============================================================
-- Create appointments table
-- ============================================================
create table if not exists public.appointments (
  id           uuid primary key default gen_random_uuid(),
  patient_id   uuid not null references public.profiles(id) on delete cascade,
  title        text not null,
  provider     text not null,
  scheduled_at timestamptz not null,
  location     text not null default '',
  status       text not null default 'scheduled'
                 check (status in ('scheduled', 'completed', 'cancelled')),
  created_at   timestamptz not null default now()
);

alter table public.appointments enable row level security;

create policy "Patients can read own appointments"
  on public.appointments for select
  using (auth.uid() = patient_id);

create policy "Doctors can read all appointments"
  on public.appointments for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'doctor'
    )
  );

create policy "Doctors can manage appointments"
  on public.appointments for all
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role = 'doctor'
    )
  );

create index idx_appointments_patient on public.appointments (patient_id, scheduled_at asc);
