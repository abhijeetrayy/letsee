"use client";

import React, { useEffect, useState } from "react";
import UserPrefrenceContext from "./userPrefrence";

const userPrefrenceProvider = ({ children }: { children: React.ReactNode }) => {
  const [userPrefrence, setUserPrefrence] = useState({
    watched: [],
    favorite: [],
    watchlater: [],
  });
  const [loading, setloading] = useState(true);

  useEffect(() => {
    async function handler() {
      const prefrence = await fetch("/api/userPrefrence", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const res = await prefrence.json();
      console.log(res);
      setUserPrefrence(res);
      setloading(false);
    }
    handler();
  }, []);
  return (
    <UserPrefrenceContext.Provider
      value={{ userPrefrence, setUserPrefrence, loading }}
    >
      {children}
    </UserPrefrenceContext.Provider>
  );
};

export default userPrefrenceProvider;
