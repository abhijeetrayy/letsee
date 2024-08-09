"use client";

import React, { useEffect, useState } from "react";
import UserPrefrenceContext from "./userPrefrence";

const userPrefrenceProvider = ({ children }: { children: React.ReactNode }) => {
  const [userPrefrence, setUserPrefrence] = useState([]);

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
    }
    handler();
  }, []);
  return (
    <UserPrefrenceContext.Provider value={{ userPrefrence, setUserPrefrence }}>
      {children}
    </UserPrefrenceContext.Provider>
  );
};

export default userPrefrenceProvider;
