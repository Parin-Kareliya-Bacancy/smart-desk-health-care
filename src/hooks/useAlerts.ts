"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { acknowledgeAlert, getAlerts } from "@/services/alerts";

export function useAlerts(patientId: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["alerts", patientId],
    queryFn: () => getAlerts(patientId),
    enabled: Boolean(patientId),
  });

  const mutation = useMutation({
    mutationFn: ({ id, acknowledged }: { id: string; acknowledged: boolean }) =>
      acknowledgeAlert(id, acknowledged),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alerts", patientId] });
    },
  });

  return {
    ...query,
    acknowledgeAlert: mutation.mutateAsync,
  };
}
