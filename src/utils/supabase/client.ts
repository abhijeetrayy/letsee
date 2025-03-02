"use client";

import { createBrowserClient as createSupabaseClient } from "@supabase/ssr";

export const supabase = createSupabaseClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);
