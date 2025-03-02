"use client";
import React, { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/client"; // Adjust path as necessary

const SignOut: React.FC = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle sign-out with loading state and error feedback
  const handleSignOut = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        throw new Error(error.message);
      }

      // Clear any local session data if needed
      localStorage.clear(); // Optional: Clear local storage if your app uses it
      sessionStorage.clear(); // Optional: Clear session storage

      // Redirect to login page after successful sign-out
      router.push("/login");
      router.refresh(); // Ensure the page reflects the signed-out state
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "An unexpected error occurred during sign-out";
      console.error("Sign-out Error:", errorMessage);
      setError(errorMessage);
      setTimeout(() => setError(null), 5000); // Clear error after 5 seconds
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  return (
    <div className="w-full">
      <button
        onClick={handleSignOut}
        disabled={isLoading}
        className={`w-full text-left px-4 py-2 text-white rounded-md transition-colors duration-200 ${
          isLoading
            ? "bg-gray-500 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Signing Out...
          </span>
        ) : (
          "Sign Out"
        )}
      </button>
      {error && (
        <p className="mt-2 text-red-500 text-sm text-center">{error}</p>
      )}
    </div>
  );
};

export default SignOut;
