"use server";

import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    "Supabase URL and Anon Key must be defined in environment variables."
  );
}

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      get(name: string): string | undefined {
        const value = cookieStore.get(name)?.value;

        return value;
      },
      set(name: string, value: string, options: CookieOptions): void {
        try {
          cookieStore.set({ name, value, ...options });
        } catch (error) {
          console.error(`Server - Error setting cookie '${name}':`, error);
        }
      },
      remove(name: string, options: CookieOptions): void {
        try {
          cookieStore.set({
            name,
            value: "",
            expires: new Date(0),
            ...options,
          });
        } catch (error) {
          console.error(`Server - Error removing cookie '${name}':`, error);
        }
      },
    },
  });
}
