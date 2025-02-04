"use client";
import React, { useState, useEffect, use } from "react";
import { createClient } from "@/utils/supabase/client";
import { Span } from "next/dist/trace";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { CiSearch } from "react-icons/ci";
import { useRouter } from "next/navigation";

const supabase = createClient();

function Page() {
  const [loading, setLoading] = useState(true);
  const [btnloading, setbtnLoading] = useState(false);
  const [user, setUser] = useState(null) as any;
  const [username, setUsername] = useState("");
  const [about, setAbout] = useState("");
  const [oneWord, setOneWord] = useState(true);
  const [isUsernameValid, setIsUsernameValid] = useState(true);
  const [usernameAvailable, setUsernameAvailable] = useState(null) as any;
  const router = useRouter();

  useEffect(() => {
    async function fetchUser() {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        const { data, error } = await supabase
          .from("users")
          .select("username, about")
          .eq("id", user.id)
          .single();

        if (data) {
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
    const isValid = sanitized === input;
    const isOneWord = sanitized.length > 1;
    return { sanitized, isValid, isOneWord };
  };

  const checkUsername = async (sanitized: string) => {
    if (!username.trim()) {
      setUsernameAvailable(null);
      return;
    }

    setbtnLoading(true);
    try {
      const { data, error } = await supabase
        .from("users")
        .select("username")
        .eq("username", sanitized)
        .single();

      if (error && error.code === "PGRST116") {
        // If the username does not exist, treat it as available
        setUsernameAvailable(true);
      } else if (error) {
        console.error("Error checking username availability:", error);
        setUsernameAvailable(false);
      } else {
        // If we got a result, it means the username is not available
        setUsernameAvailable(data ? false : true);
      }
    } catch (error) {
      console.error("Error checking username:", error);
      setUsernameAvailable(false);
    } finally {
      setbtnLoading(false);
    }
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!user || !user.email) {
      alert("Email is required");
      return;
    }

    // Check if the username is unique before submitting
    await checkUsername(username);

    if (usernameAvailable === false) {
      alert("Username is not available. Please choose a different one.");
      return;
    }

    setLoading(true);
    const { data, error } = await supabase.from("users").upsert({
      id: user.id,
      email: user.email, // Make sure this is included
      username,
      about,
      updated_at: new Date(),
    });

    if (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile. Please try again.");
    } else {
      console.log("Profile updated successfully");
      alert("Profile updated successfully!");
    }

    // Refetch user data after submission
    const {
      data: { user: updatedUser },
    } = await supabase.auth.getUser();
    if (updatedUser) {
      setUser(updatedUser);
      console.log(updatedUser);
      const { data, error } = await supabase
        .from("users")
        .select("username")
        .eq("id", updatedUser?.id)
        .single(); // ✅ Use `.single()` to fetch a single row instead of an array

      if (error) {
        console.error("Error fetching username:", error.message);
        return;
      }

      if (data?.username) {
        router.push(`/app/profile/${data.username}`);
      } else {
        console.warn("Username not found for user ID:", updatedUser?.id);
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Please sign in</div>;

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
          <h1 className="text-7xl font-extrabold text-neutral-100">Profile</h1>
          <p>
            <span className="font-bold text-indigo-500">Complete</span> your
            profile details below.
          </p>
        </div>
        <form
          className={"flex flex-col max-w-sm w-full m-auto gap-2"}
          onSubmit={handleSubmit}
        >
          <label className="text-neutral-100 pl-2" htmlFor="username">
            Username
          </label>
          <input
            className={`text-neutral-700 ring-0 outline-0 px-3 focus:ring-2 rounded-sm py-2 ${
              isUsernameValid
                ? "focus:ring-indigo-600"
                : "ring-2 ring-red-500 focus:ring-red-500"
            }`}
            id="username"
            type="text"
            value={username}
            onChange={(e) => {
              const { sanitized, isValid, isOneWord } = sanitizeUsername(
                e.target.value
              );
              setIsUsernameValid(isValid);
              setOneWord(isOneWord);
              setUsername(sanitized);
              if (sanitized && isValid && isOneWord) {
                checkUsername(sanitized);
              } else {
                setUsernameAvailable(null); // Reset availability when typing
              }
            }}
            // onBlur={checkUsername}
          />
          {!isUsernameValid && (
            <span className="text-red-500">
              username: a-z lowercase and 0-9, no special character or spaces
            </span>
          )}
          {!oneWord && (
            <span className="text-red-500">
              username: more than one character
            </span>
          )}

          <div className="h-6">
            {btnloading ? (
              <span>
                <AiOutlineLoading3Quarters className="w-fit mt-1 ml-1 animate-spin text-neutral-100" />
              </span>
            ) : (
              usernameAvailable !== null && (
                <span className="text-neutral-100">
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
            disabled={
              loading ||
              usernameAvailable === false ||
              !isUsernameValid ||
              !oneWord
            }
          >
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Page;
