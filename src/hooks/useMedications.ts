"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMedications, toggleMedication } from "@/services/medications";

export function useMedications(patientId: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["medications", patientId],
    queryFn: () => getMedications(patientId),
    enabled: Boolean(patientId),
  });

  const mutation = useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      toggleMedication(id, isActive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medications", patientId] });
    },
  });

  return {
    ...query,
    toggleMedication: mutation.mutateAsync,
  };
}
