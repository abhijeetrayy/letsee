"use client";

import React, { useEffect, useState } from "react";
import UserPrefrenceContext from "./userPrefrence";
import { supabase } from "@/utils/supabase/client";

const UserPrefrenceProvider = ({ children }: { children: React.ReactNode }) => {
  const [userPrefrence, setUserPrefrence] = useState({
    watched: [],
    favorite: [],
    watchlater: [],
  });
  const [loading, setloading] = useState(true);
  const [user, setUser] = useState(false);

  useEffect(() => {
    async function handler() {
      const { data: userData, error: userError } =
        await supabase.auth.getUser();
      const user = userData?.user;
      if (!userError && user) {
        const prefrence = await fetch("/api/userPrefrence", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        });
        const res = await prefrence.json();

        setUserPrefrence(res);
        setUser(true);
        setloading(false);
      } else {
        setUserPrefrence({
          watched: [],
          favorite: [],
          watchlater: [],
        });
        setUser(false);
        setloading(false);
      }
    }
    handler();
  }, []);
  return (
    <UserPrefrenceContext.Provider
      value={{ userPrefrence, setUserPrefrence, loading, user }}
    >
      {children}
    </UserPrefrenceContext.Provider>
  );
};

export default UserPrefrenceProvider;
