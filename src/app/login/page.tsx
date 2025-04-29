"use client";

import LoginForm from "@/components/login/loginform";
import { supabase } from "@/utils/supabase/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
// import { toast, ToastContainer } from "react-toastify";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  // Check if user is already logged in
  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        router.push("/app"); // Redirect to /app if user is logged in
      }
    };
    checkUser();
  }, [router]);

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
        setLoading(false);
      } else {
        router.push("/app"); // Redirect to /app after successful login
      }
    } catch (err) {
      setLoading(false);
      console.log("Unexpected Login Error:", err);
      setError("An unexpected error occurred. Please try again.");
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
        router.push("/app"); // Redirect to /app after successful signup
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
      <div className="w-full bg-neutral-700 flex justify-center p-4">
        {" "}
        <Link className="max-w-6xl w-full m-auto text-gray-100" href={"/app"}>
          Let'see
        </Link>
      </div>
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
