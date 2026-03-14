import { isSupabaseConfigured } from "@/lib/env";
import { mockAppointments } from "@/lib/mock-data";
import { supabase } from "@/lib/supabase/client";
import type { Appointment } from "@/types/appointment";

export async function getAppointments(patientId: string): Promise<Appointment[]> {
  if (!isSupabaseConfigured || !supabase) {
    return mockAppointments
      .filter((appointment) => appointment.patientId === patientId)
      .sort(
        (a, b) =>
          new Date(a.scheduledAt).getTime() - new Date(b.scheduledAt).getTime()
      );
  }

  const { data, error } = await supabase
    .from("appointments")
    .select("id, patient_id, title, provider, scheduled_at, location, status")
    .eq("patient_id", patientId)
    .order("scheduled_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    patientId: row.patient_id,
    title: row.title,
    provider: row.provider,
    scheduledAt: row.scheduled_at,
    location: row.location,
    status: row.status,
  }));
}
