"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createVital, getVitals } from "@/services/vitals";
import type { VitalReading } from "@/types/vitals";

export function useVitals(patientId: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["vitals", patientId],
    queryFn: () => getVitals(patientId),
    enabled: Boolean(patientId),
  });

  const mutation = useMutation({
    mutationFn: (reading: Omit<VitalReading, "id" | "recordedAt">) =>
      createVital(reading),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vitals", patientId] });
    },
  });

  return {
    ...query,
    addVital: mutation.mutateAsync,
  };
}
