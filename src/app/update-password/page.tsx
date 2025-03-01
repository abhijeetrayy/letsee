"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function UpdatePassword() {
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();

  // Extract token_hash from URL
  const tokenHash = searchParams.get("token");

  // Verify token_hash and establish session on mount
  useEffect(() => {
    const verifyToken = async () => {
      if (!tokenHash) {
        setMessage("Error: No reset token provided in URL.");
        return;
      }

      setLoading(true);
      setMessage("Verifying reset token...");

      // Verify the token_hash for password recovery
      const { error } = await supabase.auth.verifyOtp({
        token_hash: tokenHash, // Use token_hash instead of token
        type: "recovery",
      });

      setLoading(false);

      if (error) {
        setMessage(`Error verifying token: ${error.message}`);
      } else {
        setMessage("Token verified. Enter your new password below.");
      }
    };

    verifyToken();
  }, [tokenHash]);

  // Handle password update
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenHash) {
      setMessage("Error: No reset token provided.");
      return;
    }

    setLoading(true);
    setMessage("Updating password...");

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    setLoading(false);

    if (error) {
      setMessage(`Error: ${error.message}`);
    } else {
      setMessage("Password updated successfully! Redirecting to login...");
      setTimeout(() => {
        router.push("/login");
      }, 2000);
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
          onSubmit={handleUpdatePassword}
          className="flex flex-col max-w-sm w-full m-auto gap-2"
        >
          <label className="text-neutral-100 pl-2" htmlFor="password">
            Update password
          </label>
          <input
            className="text-neutral-700 ring-0 outline-0 px-3 focus:ring-2 rounded-sm focus:ring-indigo-600 py-2"
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            disabled={loading || !tokenHash}
          />

          {message && <p className="text-white">{message}</p>}
          <div className="flex flex-col gap-3 mt-3">
            <button
              className="text-neutral-100 bg-indigo-700 py-2 rounded-md w-full hover:bg-indigo-600"
              disabled={loading || !tokenHash}
              type="submit"
            >
              Update Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
