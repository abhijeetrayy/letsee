"use client";

import SignupForm from "@/components/signup/signupForm";
import { supabase } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

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

  const signup = async (email: string, password: string) => {
    setLoading(true);
    setError("");

    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      setLoading(false);
      setError(error.message);
    } else {
      // toast.success(
      //   "Sign-up successful! Please check your email to confirm your account.",
      //   {
      //     position: "top-right",
      //     autoClose: 5000,
      //     hideProgressBar: false,
      //     closeOnClick: true,
      //     pauseOnHover: true,
      //     draggable: true,
      //     progress: undefined,
      //   }
      // );
      router.refresh();
    }
  };

  return (
    <>
      <SignupForm onSignup={signup} loading={loading} error={error} />
      {/* <ToastContainer /> */}
    </>
  );
}
