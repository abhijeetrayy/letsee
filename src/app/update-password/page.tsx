"use client"; // Mark as a Client Component
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export default function UpdatePassword() {
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");
  const router = useRouter();

  const supabase = createClient();

  useEffect(() => {
    // Check if the user is authenticated (i.e., they clicked the reset link)
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push("/login"); // Redirect to login if not authenticated
      }
    });
  }, [router, supabase.auth]);

  const handleUpdatePassword = async (e: any) => {
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
            Let&apos;s See
          </h1>
          <p>Social media for cinema.</p>
        </div>
        <form
          onSubmit={handleUpdatePassword}
          className={"flex flex-col max-w-sm w-full m-auto gap-2"}
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
          />

          {message && <p className="text-white">{message}</p>}
          <div className="flex flex-col gap-3 mt-3">
            <button
              className="text-neutral-100 bg-indigo-700 py-2 rounded-md w-full hover:bg-indigo-600"
              disabled={loading}
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
