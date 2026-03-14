"use client";

import { useQuery } from "@tanstack/react-query";
import { getPatients } from "@/services/patients";

export function usePatients() {
  return useQuery({
    queryKey: ["patients"],
    queryFn: getPatients,
  });
}
