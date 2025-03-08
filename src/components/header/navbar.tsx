"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { IoNotifications } from "react-icons/io5";
import { FaUser } from "react-icons/fa6";
import { FcFilmReel } from "react-icons/fc";
import BurgerMenu from "./BurgerMenu";
import DropdownMenu from "./dropDownMenu";
import MessageButton from "./MessageButton";
import RealtimeNotification from "./RealtimeNotification";
import SearchBar from "./searchBar";
import { supabase } from "@/utils/supabase/client";

const Navbar: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user data with error handling
  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();
      console.log(user);
      if (authError)
        throw new Error(
          "Failed to fetch authentication data: " + authError.message
        );

      if (user) {
        const { data: userData, error: dbError } = await supabase
          .from("users")
          .select("*")
          .eq("id", user.id)
          .single();

        if (dbError)
          throw new Error("Failed to fetch user data: " + dbError.message);
        if (!userData) throw new Error("User data not found in database");

        setUser(userData);
      } else {
        setUser(null);
      }
    } catch (err) {
      console.error("Error in fetchUser:", err);
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
      setUser(null); // Reset user on error to avoid stale data
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle auth state changes and initial fetch
  useEffect(() => {
    fetchUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      try {
        if (session?.user) {
          const { data: userData, error } = await supabase
            .from("users")
            .select("*")
            .eq("id", session.user.id)
            .single();

          if (error)
            throw new Error(
              "Failed to fetch user data on auth change: " + error.message
            );
          if (!userData) throw new Error("User data not found on auth change");

          setUser(userData);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error("Error in auth state change:", err);
        setError(
          err instanceof Error ? err.message : "An unexpected error occurred"
        );
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchUser]);

  // Loading state UI
  if (loading) {
    return (
      <div className="max-w-[1520px] w-full m-auto flex flex-row items-center justify-between text-white p-3 h-full">
        <div>
          <Link className="font-bold text-md md:text-xl sm:ml-5" href="/app">
            Let's see
          </Link>
        </div>
        <div className="flex flex-row gap-3 items-center">
          <div className="animate-pulse bg-neutral-700 w-20 h-10 rounded-md"></div>
          <div className="animate-pulse bg-neutral-700 w-20 h-10 rounded-md"></div>
        </div>
      </div>
    );
  }

  // Error state UI
  if (error) {
    return (
      <div className="max-w-[1520px] w-full m-auto flex flex-row items-center justify-between text-white p-3 h-full">
        <div>
          <Link className="font-bold text-md md:text-xl sm:ml-5" href="/app">
            Let's see
          </Link>
        </div>
        <div className="flex flex-row gap-3 items-center">
          <span className="text-red-400 text-sm">
            Error: Unable to load user data
          </span>
          <Link
            className="flex text-nowrap items-center text-gray-100 justify-center px-3 py-1 rounded-md bg-blue-600 hover:bg-blue-500"
            href="/login"
          >
            Retry Login
          </Link>
        </div>
      </div>
    );
  }

  // Main Navbar UI
  return (
    <div className="max-w-[1520px] w-full m-auto flex flex-row items-center justify-between text-white p-3 h-full">
      <div>
        <Link className="font-bold text-md md:text-xl sm:ml-5" href="/app">
          Let's see
        </Link>
      </div>

      <div className="flex flex-row gap-3 items-center">
        <Link
          className="flex items-center justify-center px-4 py-2 rounded-md bg-neutral-600 hover:bg-neutral-500 relative"
          href="/app/reel"
        >
          <FcFilmReel />
        </Link>
        {user && <MessageButton userId={user.id} />}
        {user && (
          <Link
            className="hidden md:flex items-center justify-center px-4 py-2 rounded-md bg-neutral-600 hover:bg-neutral-500 relative"
            href="/app/notification"
          >
            <IoNotifications />
            {/* <RealtimeNotification userId={user.id} /> */}
          </Link>
        )}
        <Link
          className="flex items-center justify-center px-4 py-2 rounded-md bg-neutral-600 hover:bg-neutral-500 relative"
          href="/app/profile"
        >
          <FaUser />
        </Link>
        <SearchBar />
        <div className="hidden md:flex flex-row gap-3 items-center">
          {user ? (
            <DropdownMenu user={user} />
          ) : (
            <Link
              className="flex text-nowrap items-center text-gray-100 justify-center px-3 py-1 rounded-md bg-blue-600 hover:bg-blue-500 relative"
              href="/login"
            >
              Log in
            </Link>
          )}
        </div>
        <BurgerMenu userID={user?.username} />
      </div>
    </div>
  );
};

export default Navbar;
