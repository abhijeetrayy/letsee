"use client";

import LoginForm from "@/components/login/loginform";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const login = async (email: string, password: string) => {
    const supabase = createClient();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setLoading(false);
      setError(error.message);
    } else {
      router.push("/app");
    }
  };

  const signup = async (email: string, password: string) => {
    const supabase = createClient();
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      setLoading(false);
      setError(error.message);
    } else {
      toast.success(
        "Sign-up successful! Please check your email to confirm your account.",
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }
      );
      router.push("/app");
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
      <ToastContainer />
    </>
  );
}
