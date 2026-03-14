"use client";

import { useAuth } from "@/hooks/useAuth";

export function useCurrentUser() {
  const { session, loading } = useAuth();
  const userId = session?.user?.id ?? null;

  return { userId, loading };
}
