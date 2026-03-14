import { isSupabaseConfigured } from "@/lib/env";
import { mockUsers } from "@/lib/mock-data";
import { supabase } from "@/lib/supabase/client";
import type { UserProfile } from "@/types/user";

export async function getPatients(): Promise<UserProfile[]> {
  if (!isSupabaseConfigured || !supabase) {
    return mockUsers.filter((user) => user.role === "patient");
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("id, email, full_name, role")
    .eq("role", "patient")
    .order("full_name", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => ({
    id: row.id,
    email: row.email,
    fullName: row.full_name,
    role: row.role,
  }));
}
