"use server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  // Get the cookie store (no need for `await` in Next.js 15)
  const cookieStore = await cookies();

  // Create and return the Supabase client
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!, // Supabase project URL
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, // Supabase anonymous key
    {
      cookies: {
        // Get a cookie by name
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        // Set a cookie
        set(name: string, value: string, options: any) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            console.error("Error setting cookie:", error);
          }
        },
        // Remove a cookie
        remove(name: string, options: any) {
          try {
            cookieStore.set({ name, value: "", ...options });
          } catch (error) {
            console.error("Error removing cookie:", error);
          }
        },
      },
    }
  );
}
