"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client"; // Adjust the path as necessary

const SignOut = () => {
  const router = useRouter();
  const supabase = createClient();
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error.message);
      // Optionally, redirect to an error page or display an error message
      router.push("/error");
    } else {
      // Redirect to the login page after signing out
      router.push("/login");
    }
  };

  return (
    <button className="w-full text-left" onClick={signOut}>
      Sign Out
    </button>
  );
};

export default SignOut;
