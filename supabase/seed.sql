-- ============================================================
-- ChronoCare AI — Seed data
-- Run AFTER creating test users via Supabase Auth.
--
-- Before running this seed, create two users in the Supabase
-- dashboard (Authentication > Users > Add user):
--   1. patient@chronocare.ai  (password: Test1234!)
--   2. doctor@chronocare.ai   (password: Test1234!)
--
-- Then replace the UUIDs below with the actual user IDs from
-- the dashboard, OR run the signup flow in the app first.
-- ============================================================

-- Replace these with the actual auth.users UUIDs after signup
-- You can find them in: Supabase Dashboard > Authentication > Users
do $$
declare
  v_patient_id uuid;
  v_doctor_id  uuid;
begin
  -- Look up user IDs from auth.users
  select id into v_patient_id from auth.users where email = 'patient@chronocare.ai' limit 1;
  select id into v_doctor_id  from auth.users where email = 'doctor@chronocare.ai'  limit 1;

  if v_patient_id is null or v_doctor_id is null then
    raise notice 'Please create the test users first (patient@chronocare.ai and doctor@chronocare.ai)';
    return;
  end if;

  -- Upsert profiles
  insert into public.profiles (id, email, full_name, role)
  values
    (v_patient_id, 'patient@chronocare.ai', 'Avery Patel',      'patient'),
    (v_doctor_id,  'doctor@chronocare.ai',  'Dr. Morgan Rivera', 'doctor')
  on conflict (id) do update set
    full_name = excluded.full_name,
    role      = excluded.role;

  -- Vitals
  insert into public.vitals (patient_id, type, value, unit, recorded_at) values
    (v_patient_id, 'heart_rate',      72,    'bpm',  '2026-03-14T06:00:00Z'),
    (v_patient_id, 'blood_pressure', 118,    'mmHg', '2026-03-14T06:05:00Z'),
    (v_patient_id, 'blood_pressure',  76,    'mmHg', '2026-03-14T06:05:00Z'),
    (v_patient_id, 'oxygen',          98,    '%',    '2026-03-14T06:10:00Z'),
    (v_patient_id, 'temperature',     98.6,  'F',    '2026-03-14T06:15:00Z');

  -- Medications
  insert into public.medications (patient_id, name, dosage, frequency, next_dose_at, is_active) values
    (v_patient_id, 'Metformin',     '500 mg', 'Twice daily',   '2026-03-14T12:00:00Z', true),
    (v_patient_id, 'Atorvastatin',  '20 mg',  'Every evening', '2026-03-14T20:00:00Z', true);

  -- Alerts
  insert into public.alerts (patient_id, title, message, severity, created_at, acknowledged) values
    (v_patient_id, 'Elevated blood pressure',  'Systolic reading above threshold for 3 days.', 'high',   '2026-03-13T18:00:00Z', false),
    (v_patient_id, 'Medication adherence',      'Missed one dose of Metformin yesterday.',      'medium', '2026-03-13T16:30:00Z', true);

  raise notice 'Seed data inserted successfully!';
end;
$$;
