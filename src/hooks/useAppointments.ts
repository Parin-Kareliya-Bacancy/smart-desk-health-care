"use client";

import { useQuery } from "@tanstack/react-query";
import { getAppointments } from "@/services/appointments";

export function useAppointments(patientId: string) {
  return useQuery({
    queryKey: ["appointments", patientId],
    queryFn: () => getAppointments(patientId),
    enabled: Boolean(patientId),
  });
}
