import type { Session } from "@supabase/supabase-js";
import { isSupabaseConfigured } from "@/lib/env";
import { supabase } from "@/lib/supabase/client";

export type AuthResult = {
  error: string | null;
};

export async function signInWithPassword(email: string, password: string): Promise<AuthResult> {
  if (!isSupabaseConfigured || !supabase) {
    return { error: "Supabase is not configured." };
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  return { error: error?.message ?? null };
}

export async function signUpWithPassword(
  email: string,
  password: string,
  fullName?: string,
  role?: string,
): Promise<AuthResult> {
  if (!isSupabaseConfigured || !supabase) {
    return { error: "Supabase is not configured." };
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName ?? "",
        role: role ?? "patient",
      },
    },
  });
  return { error: error?.message ?? null };
}

export async function signOut(): Promise<AuthResult> {
  if (!isSupabaseConfigured || !supabase) {
    return { error: null };
  }

  const { error } = await supabase.auth.signOut();
  return { error: error?.message ?? null };
}

export async function getSession(): Promise<Session | null> {
  if (!isSupabaseConfigured || !supabase) {
    return null;
  }

  const { data } = await supabase.auth.getSession();
  return data.session ?? null;
}
