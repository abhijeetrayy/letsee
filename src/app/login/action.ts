"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

export async function login(email: any, password: any) {
  const supabase = createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  // const data = {
  //   email: formData.get("email") as string,
  //   password: formData.get("password") as string,
  // };

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    console.log(error);
    redirect("/error");
  }

  revalidatePath("/app", "layout");
  redirect("/app");
}

export async function signup(email: any, password: any) {
  const supabase = createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs

  const { error } = await supabase.auth.signUp({ email, password });

  if (error) {
    console.log(error);
    redirect("/error");
  }

  revalidatePath("/app", "layout");
  redirect("/app");
}
