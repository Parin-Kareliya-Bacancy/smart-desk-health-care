import { isSupabaseConfigured } from "@/lib/env";
import { mockAlerts } from "@/lib/mock-data";
import { supabase } from "@/lib/supabase/client";
import type { Alert } from "@/types/alert";

export async function getAlerts(patientId: string): Promise<Alert[]> {
  if (!isSupabaseConfigured || !supabase) {
    return mockAlerts.filter((alert) => alert.patientId === patientId);
  }

  const { data, error } = await supabase
    .from("alerts")
    .select("id, patient_id, title, message, severity, created_at, acknowledged")
    .eq("patient_id", patientId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    patientId: row.patient_id,
    title: row.title,
    message: row.message,
    severity: row.severity,
    createdAt: row.created_at,
    acknowledged: row.acknowledged,
  }));
}

export async function acknowledgeAlert(
  alertId: string,
  acknowledged: boolean
): Promise<Alert | null> {
  if (!isSupabaseConfigured || !supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("alerts")
    .update({ acknowledged })
    .eq("id", alertId)
    .select("id, patient_id, title, message, severity, created_at, acknowledged")
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Unable to update alert.");
  }

  return {
    id: data.id,
    patientId: data.patient_id,
    title: data.title,
    message: data.message,
    severity: data.severity,
    createdAt: data.created_at,
    acknowledged: data.acknowledged,
  };
}
