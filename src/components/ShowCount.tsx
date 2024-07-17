"use client";
import { useAppSelector } from "@/redux/hook/reduxHook";
import React from "react";

function ShowCount() {
  const count = useAppSelector((state) => state.counter.value);
  return <div>ShowCount {count}</div>;
}

export default ShowCount;
