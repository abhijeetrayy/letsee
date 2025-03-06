"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient, Session } from "@supabase/supabase-js";

// Environment variables
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Validate environment variables at runtime
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    "Missing Supabase environment variables. Ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are defined."
  );
}

// Custom cookie storage for client-side session persistence
const cookieStorage = {
  getItem: (key: string): string | null => {
    if (typeof window === "undefined") return null;
    const value = document.cookie
      .split("; ")
      .find((row) => row.startsWith(`${key}=`))
      ?.split("=")[1];
    return value || null;
  },
  setItem: (key: string, value: string): void => {
    if (typeof window === "undefined") return;
    document.cookie = `${key}=${value}; path=/; max-age=31536000; Secure; SameSite=Lax`;
  },
  removeItem: (key: string): void => {
    if (typeof window === "undefined") return;
    document.cookie = `${key}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; Secure; SameSite=Lax`;
  },
};

// Singleton Supabase client with typed Database
export const supabase: SupabaseClient = createBrowserClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      autoRefreshToken: true, // Automatically refresh session tokens
      persistSession: true, // Persist session across tabs and refreshes
      detectSessionInUrl: true, // Handle OAuth redirects (e.g., login callbacks)
      storage: cookieStorage, // Use cookies instead of localStorage for broader compatibility
    },
  }
);

// Utility function to get the current session with error handling
export const getSession = async (): Promise<Session | null> => {
  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();
    if (error) throw new Error("Failed to fetch session: " + error.message);
    return session;
  } catch (err) {
    console.error("Error in getSession:", err);
    return null;
  }
};

// Utility function to get the current user with profile data
export const getUserProfile = async () => {
  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError)
      throw new Error("Failed to fetch user: " + userError.message);
    if (!user) return null;

    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();

    if (profileError)
      throw new Error("Failed to fetch profile: " + profileError.message);

    return { user, profile };
  } catch (err) {
    console.error("Error in getUserProfile:", err);
    return null;
  }
};

// Optional: Subscribe to auth state changes
export const onAuthChange = (
  callback: (event: string, session: Session | null) => void
) => {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange(callback);
  return () => subscription.unsubscribe();
};
