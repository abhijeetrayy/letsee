"use client";
import React, { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase/client";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import Link from "next/link";
import { useRouter } from "next/navigation";

function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [alreadyExists, setAlreadyExists] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [username, setUsername] = useState("");
  const [about, setAbout] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [usernameAvailable, setUsernameAvailable] = useState<null | boolean>(
    null
  );

  const router = useRouter();

  useEffect(() => {
    async function fetchUser() {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        setUser(user);
        const { data } = await supabase
          .from("users")
          .select("username, about")
          .eq("id", user.id)
          .single();

        if (data) {
          setAlreadyExists(true);
          setUsername(data.username || "");
          setAbout(data.about || "");
        }
      }
      setLoading(false);
    }

    fetchUser();
  }, []);

  const sanitizeUsername = (input: string) => {
    const sanitized = input.toLowerCase().replace(/[^a-z0-9]/g, "");
    if (!sanitized)
      return { sanitized, error: "Enter a username.", valid: false };
    if (sanitized.length === 1)
      return {
        sanitized,
        error: "More than one character needed.",
        valid: false,
      };
    if (sanitized.length > 15)
      return {
        sanitized,
        error: "Username must be 15 characters or less.",
        valid: false,
      };

    return { sanitized, valid: true };
  };

  const checkUsernameAvailability = async (sanitized: string) => {
    if (!sanitized) {
      setUsernameAvailable(null);
      return;
    }

    setBtnLoading(true);
    try {
      const { data, error } = await supabase
        .from("users")
        .select("username")
        .eq("username", sanitized)
        .single();

      setUsernameAvailable(!data); // If no data, username is available
    } catch (error) {
      console.error("Error checking username:", error);
      setUsernameAvailable(false);
    } finally {
      setBtnLoading(false);
    }
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const { sanitized, error, valid } = sanitizeUsername(input);

    setUsername(sanitized || ""); // Update username state
    setUsernameError(error || ""); // Set error message if invalid
    setUsernameAvailable(null); // Reset availability status

    if (valid && sanitized) checkUsernameAvailability(sanitized);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user || !user.email) {
      alert("Email is required");
      return;
    }

    if (!username || usernameError) {
      alert(usernameError || "Enter a valid username.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("users").upsert({
      id: user.id,
      email: user.email,
      username,
      about,
      updated_at: new Date(),
    });

    setLoading(false);

    if (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile. Please try again.");
      return;
    }

    alert("Profile updated successfully!");

    // Fetch the updated user data
    const {
      data: { user: updatedUser },
    } = await supabase.auth.getUser();

    if (updatedUser) {
      setUser(updatedUser);
      const { data } = await supabase
        .from("users")
        .select("username")
        .eq("id", updatedUser?.id)
        .single();

      if (data?.username) {
        router.push(`/app/profile/${data.username}`);
      } else {
        console.warn("Username not found for user ID:", updatedUser?.id);
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!user)
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center">
        Please{" "}
        <Link
          className="px-3 py-2 rounded-md text-neutral-200 bg-blue-800 hover:bg-neutral-600"
          href={"/login"}
        >
          Log in
        </Link>
      </div>
    );

  return (
    <div className="w-full min-h-screen flex flex-col p-2 justify-center items-center bg-neutral-900">
      <div className="w-full max-w-72 flex flex-col gap-4">
        <div className="m-auto w-fit text-neutral-100 mb-5">
          <h1 className="text-7xl font-extrabold">Profile</h1>
          <p>
            <span className="font-bold text-indigo-500">Complete</span> your
            profile details below.
          </p>
        </div>
        <form
          className="flex flex-col max-w-sm w-full m-auto gap-2"
          onSubmit={handleSubmit}
        >
          <label className="text-neutral-100 pl-2" htmlFor="username">
            Username
          </label>
          <input
            className="text-neutral-700 ring-0 outline-0 px-3 focus:ring-2 rounded-sm py-2 focus:ring-indigo-600"
            id="username"
            type="text"
            value={username}
            onChange={handleUsernameChange}
          />
          {usernameError && (
            <span className="text-red-500">{usernameError}</span>
          )}

          <div className="h-6">
            {btnLoading ? (
              <AiOutlineLoading3Quarters className="w-fit mt-1 ml-1 animate-spin text-neutral-100" />
            ) : (
              usernameAvailable !== null && (
                <span
                  className={`text-neutral-100 ${
                    usernameAvailable ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {usernameAvailable ? "✅ Available" : "❌ Not available"}
                </span>
              )
            )}
          </div>

          <label className="text-neutral-100 pl-2" htmlFor="about">
            About
          </label>
          <textarea
            className="text-neutral-700 ring-0 outline-0 px-3 focus:ring-2 rounded-sm focus:ring-indigo-600 py-2"
            id="about"
            value={about}
            onChange={(e) => setAbout(e.target.value)}
          />
          <button
            className="text-neutral-100 bg-indigo-700 py-2 rounded-md w-full hover:bg-indigo-600 disabled:bg-gray-400"
            type="submit"
            disabled={loading || !!usernameError}
          >
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </form>
        {alreadyExists && (
          <button
            type="button"
            className="text-neutral-100 bg-neutral-700 py-2 rounded-md w-full hover:bg-neutral-600"
            onClick={() => router.back()}
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}

export default ProfilePage;
