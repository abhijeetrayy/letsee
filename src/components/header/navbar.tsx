"use client";

import Link from "next/link";
import { IoNotifications } from "react-icons/io5";
import { FaUser } from "react-icons/fa6";
import { FcFilmReel } from "react-icons/fc";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import BurgerMenu from "./BurgerMenu";
import DropdownMenu from "./dropDownMenu";
import MessageButton from "./MessageButton";
import RealtimeNotification from "./RealtimeNotification";
import SearchBar from "./searchBar";

// Define the User type based on your Supabase "users" table structure
interface User {
  id: string;
  username?: string;
  [key: string]: any; // Flexible for additional fields
}

export function LogedNavbar() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/navbar", {
          credentials: "include", // Include cookies for auth
        });
        if (response.ok) {
          const { user } = await response.json();
          setUser(user || null);
          console.log(user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

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
}
