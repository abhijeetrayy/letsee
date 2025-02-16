"use client";
import React from "react";
import type { RootState } from "@/redux/store/store";
import { useDispatch, useSelector } from "react-redux";
import { decrement, increment } from "@/features/count/countSlice";
import Link from "next/link";

function page() {
  // const count = useSelector((state: RootState) => state.counter.value);
  // const dispatch = useDispatch();
  return (
    <div>
      {/* <button onClick={() => dispatch(increment())}>+</button>
      {count}
      <button onClick={() => dispatch(decrement())}>-</button>
      <Link href={"/app"}>home</Link> */}
      hi.
    </div>
  );
}

export default page;
