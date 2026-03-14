-- ============================================================
-- Fix: RLS policy recursion causing 500 errors
-- The "Doctors can read all" policies on each table do a
-- subquery on profiles, but profiles itself has an RLS policy
-- that subqueries profiles, creating infinite recursion.
--
-- Solution: a SECURITY DEFINER function that bypasses RLS
-- to check the user's role.
-- ============================================================

-- Helper function that checks role without triggering RLS
create or replace function public.get_user_role()
returns text
language sql
security definer
stable
as $$
  select role from public.profiles where id = auth.uid();
$$;

-- ===================== PROFILES =====================
-- Drop the recursive doctor policy
drop policy if exists "Doctors can read all profiles" on public.profiles;

-- Recreate using the helper function
create policy "Doctors can read all profiles"
  on public.profiles for select
  using (public.get_user_role() = 'doctor');

-- ===================== VITALS =======================
drop policy if exists "Doctors can read all vitals" on public.vitals;

create policy "Doctors can read all vitals"
  on public.vitals for select
  using (public.get_user_role() = 'doctor');

-- ===================== MEDICATIONS ==================
drop policy if exists "Doctors can read all medications" on public.medications;
drop policy if exists "Doctors can manage medications" on public.medications;

create policy "Doctors can read all medications"
  on public.medications for select
  using (public.get_user_role() = 'doctor');

create policy "Doctors can manage medications"
  on public.medications for all
  using (public.get_user_role() = 'doctor');

-- ===================== ALERTS =======================
drop policy if exists "Doctors can read all alerts" on public.alerts;
drop policy if exists "Doctors can manage alerts" on public.alerts;

create policy "Doctors can read all alerts"
  on public.alerts for select
  using (public.get_user_role() = 'doctor');

create policy "Doctors can manage alerts"
  on public.alerts for all
  using (public.get_user_role() = 'doctor');

-- ===================== APPOINTMENTS =================
drop policy if exists "Doctors can read all appointments" on public.appointments;
drop policy if exists "Doctors can manage appointments" on public.appointments;

create policy "Doctors can read all appointments"
  on public.appointments for select
  using (public.get_user_role() = 'doctor');

create policy "Doctors can manage appointments"
  on public.appointments for all
  using (public.get_user_role() = 'doctor');
