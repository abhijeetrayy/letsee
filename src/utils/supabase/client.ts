import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Create a single instance of the Supabase client
export const supabase = createSupabaseClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true, // Important for reset links
    },
  }
);
