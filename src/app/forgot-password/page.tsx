"use client";
import { useState, useEffect } from "react";
import { supabase } from "../../utils/supabase/client";
import Link from "next/link";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [lastRequestTime, setLastRequestTime] = useState<number | null>(null);
  const [cooldown, setCooldown] = useState(0);

  // Cooldown timer
  useEffect(() => {
    if (lastRequestTime) {
      const interval = setInterval(() => {
        const timeSinceLastRequest = Math.floor(
          (Date.now() - lastRequestTime) / 1000
        );
        const remaining = 60 - timeSinceLastRequest;
        setCooldown(remaining > 0 ? remaining : 0);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [lastRequestTime]);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent submission if still in cooldown
    if (cooldown > 0) {
      setMessage(`Please wait ${cooldown} seconds before trying again.`);
      return;
    }

    setLoading(true);
    setMessage("Sending reset link...");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    });

    setLoading(false);
    setLastRequestTime(Date.now()); // Update last request time

    if (error) {
      if (error.message.includes("For security purposes")) {
        setMessage(
          "Please wait 60 seconds before requesting another reset link."
        );
        setCooldown(60); // Reset cooldown to 60 seconds
      } else {
        setMessage(`Error: ${error.message}`);
      }
      console.error("Reset Error:", error);
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
          className="flex flex-col max-w-sm w-full m-auto gap-2"
        >
          <label className="text-neutral-100 pl-2" htmlFor="email">
            Forgot Password - Enter email
          </label>
          <input
            className="text-neutral-700 ring-0 outline-0 px-3 focus:ring-2 rounded-sm focus:ring-indigo-600 py-2"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading || cooldown > 0} // Disable during cooldown
          />

          {message && <p className="text-white">{message}</p>}
          <div className="flex flex-col gap-3 mt-3">
            <button
              className="text-neutral-100 bg-indigo-700 py-2 rounded-md w-full hover:bg-indigo-600 disabled:opacity-50"
              disabled={loading || cooldown > 0} // Disable during cooldown
              type="submit"
            >
              Send Reset Link {cooldown > 0 ? `(${cooldown}s)` : ""}
            </button>
          </div>
          <p className="flex flex-row gap-2 m-auto w-full text-white">
            <span>back to login</span>{" "}
            <Link className="underline" href={"/login"}>
              click
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
