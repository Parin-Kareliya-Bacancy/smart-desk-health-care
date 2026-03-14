import { isSupabaseConfigured } from "@/lib/env";
import { mockMedications } from "@/lib/mock-data";
import { supabase } from "@/lib/supabase/client";
import type { Medication } from "@/types/medication";

export async function getMedications(patientId: string): Promise<Medication[]> {
  if (!isSupabaseConfigured || !supabase) {
    return mockMedications.filter((med) => med.patientId === patientId);
  }

  const { data, error } = await supabase
    .from("medications")
    .select("id, patient_id, name, dosage, frequency, next_dose_at, is_active")
    .eq("patient_id", patientId)
    .order("next_dose_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    patientId: row.patient_id,
    name: row.name,
    dosage: row.dosage,
    frequency: row.frequency,
    nextDoseAt: row.next_dose_at,
    isActive: row.is_active,
  }));
}

export async function toggleMedication(
  medicationId: string,
  isActive: boolean
): Promise<Medication | null> {
  if (!isSupabaseConfigured || !supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("medications")
    .update({ is_active: isActive })
    .eq("id", medicationId)
    .select("id, patient_id, name, dosage, frequency, next_dose_at, is_active")
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Unable to update medication.");
  }

  return {
    id: data.id,
    patientId: data.patient_id,
    name: data.name,
    dosage: data.dosage,
    frequency: data.frequency,
    nextDoseAt: data.next_dose_at,
    isActive: data.is_active,
  };
}
