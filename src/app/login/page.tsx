"use client";

import LoginForm from "@/components/login/loginform";
import { supabase } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
// import { toast, ToastContainer } from "react-toastify";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.log("Login Error:", error);
        setError(error.message);
      } else {
        // Force a full page refresh to ensure the session is set
        router.refresh();
      }
    } catch (err) {
      console.log("Unexpected Login Error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const signup = async (email: string, password: string) => {
    setLoading(true);
    setError("");

    try {
      const { data, error } = await supabase.auth.signUp({ email, password });

      if (error) {
        console.log("Signup Error:", error.message);
        setError(error.message);
      } else {
        router.refresh();
      }
    } catch (err) {
      console.log("Unexpected Signup Error:", err);
      setError("An unexpected error occurred during signup.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <LoginForm
        onLogin={login}
        onSignup={signup}
        loading={loading}
        error={error}
      />
      {/* <ToastContainer /> */}
    </>
  );
}
