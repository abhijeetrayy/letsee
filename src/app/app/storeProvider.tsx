"use client";
import { AppStore, makeStore } from "@/redux/store/store";
import React, { useRef } from "react";
import { Provider } from "react-redux";

function storeProvider({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<AppStore | null>(null);
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }
  return <Provider store={storeRef.current}>{children}</Provider>;
}

export default storeProvider;
