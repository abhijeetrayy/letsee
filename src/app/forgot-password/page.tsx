"use client"; // Mark as a Client Component
import { useState } from "react";
import { createClient } from "../../utils/supabase/client";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleResetPassword = async (e: any) => {
    const supabase = createClient();
    e.preventDefault();
    setLoading(true);
    setMessage("Sending reset link...");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`, // Redirect URL after clicking the reset link
    });
    setLoading(false);
    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage("Check your email for the reset link!");
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col p-2 justify-center items-center bg-neutral-900">
      <div className="w-full z-10">
        <div
          className={
            loading
              ? "animate-bounce m-auto w-fit text-neutral-100 mb-5"
              : "m-auto w-fit text-neutral-100 mb-5"
          }
        >
          <h1 className="text-7xl font-extrabold text-neutral-100">
            Let's See
          </h1>
          <p>Social media for cinema.</p>
        </div>
        <form
          onSubmit={handleResetPassword}
          className={"flex flex-col max-w-sm w-full m-auto gap-2"}
        >
          <label className="text-neutral-100 pl-2" htmlFor="password">
            Forgot Password - Enter email
          </label>
          <input
            className="text-neutral-700 ring-0 outline-0 px-3 focus:ring-2 rounded-sm focus:ring-indigo-600 py-2"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          {message && <p className="text-white">{message}</p>}
          <div className="flex flex-col gap-3 mt-3">
            <button
              className="text-neutral-100 bg-indigo-700 py-2 rounded-md w-full hover:bg-indigo-600"
              disabled={loading}
              type="submit"
            >
              Send Reset Link
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
