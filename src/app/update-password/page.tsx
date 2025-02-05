"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function UpdatePassword() {
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("access_token");
      setAccessToken(token);

      if (!token) {
        router.replace("/login"); // Redirect to login if no token is found
      }
    }
  }, [router]);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
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
    <UpdatePasswordForm
      loading={loading}
      onSubmit={handleUpdatePassword}
      newPassword={newPassword}
      setNewPassword={setNewPassword}
      message={message}
    />
  );
}

// Separate Form Component
function UpdatePasswordForm({
  loading,
  onSubmit,
  newPassword,
  setNewPassword,
  message,
}: {
  loading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  newPassword: string;
  setNewPassword: React.Dispatch<React.SetStateAction<string>>;
  message: string;
}) {
  return (
    <div className="w-full min-h-screen flex flex-col p-4 justify-center items-center bg-neutral-900">
      <div className="w-full max-w-md">
        <div
          className={`m-auto text-center text-neutral-100 mb-5 ${
            loading ? "animate-bounce" : ""
          }`}
        >
          <h1 className="text-5xl font-extrabold">Let's See</h1>
          <p>Social media for cinema.</p>
        </div>
        <form
          onSubmit={onSubmit}
          className="flex flex-col w-full gap-4 bg-neutral-800 p-6 rounded-md shadow-lg"
        >
          <label className="text-neutral-100 pl-2" htmlFor="password">
            New Password
          </label>
          <input
            className="text-neutral-700 px-3 py-2 rounded-md focus:ring-2 focus:ring-indigo-600 outline-none"
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          {message && <p className="text-white text-sm">{message}</p>}
          <button
            className="text-white bg-indigo-700 py-2 rounded-md w-full hover:bg-indigo-600 disabled:bg-indigo-400"
            disabled={loading}
            type="submit"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
