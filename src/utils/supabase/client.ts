"use client";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Custom cookie storage for client-side
const cookieStorage = {
  getItem: (key: string) => {
    if (typeof window === "undefined") return null;
    const value = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${key}=`))
      ?.split("=")[1];
    return value || null;
  },
  setItem: (key: string, value: string) => {
    if (typeof window === "undefined") return;
    document.cookie = `${key}=${value}; path=/; max-age=31536000; Secure; SameSite=Lax`;
  },
  removeItem: (key: string) => {
    if (typeof window === "undefined") return;
    document.cookie = `${key}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  },
};

export const supabase = createSupabaseClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
      storage: cookieStorage, // Use cookies instead of localStorage
    },
  }
);
