import { isSupabaseConfigured } from "@/lib/env";
import { mockVitals } from "@/lib/mock-data";
import { supabase } from "@/lib/supabase/client";
import type { VitalReading } from "@/types/vitals";

export async function getVitals(patientId: string): Promise<VitalReading[]> {
  if (!isSupabaseConfigured || !supabase) {
    return mockVitals.filter((vital) => vital.patientId === patientId);
  }

  const { data, error } = await supabase
    .from("vitals")
    .select("id, patient_id, type, value, unit, recorded_at")
    .eq("patient_id", patientId)
    .order("recorded_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    patientId: row.patient_id,
    type: row.type,
    value: row.value,
    unit: row.unit,
    recordedAt: row.recorded_at,
  }));
}

export async function createVital(reading: Omit<VitalReading, "id" | "recordedAt">): Promise<VitalReading> {
  const payload = {
    patient_id: reading.patientId,
    type: reading.type,
    value: reading.value,
    unit: reading.unit,
    recorded_at: new Date().toISOString(),
  };

  if (!isSupabaseConfigured || !supabase) {
    return {
      id: `local-${Date.now()}`,
      recordedAt: payload.recorded_at,
      ...reading,
    };
  }

  const { data, error } = await supabase
    .from("vitals")
    .insert(payload)
    .select("id, patient_id, type, value, unit, recorded_at")
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Unable to create vital reading.");
  }

  return {
    id: data.id,
    patientId: data.patient_id,
    type: data.type,
    value: data.value,
    unit: data.unit,
    recordedAt: data.recorded_at,
  };
}
