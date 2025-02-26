"use client";
import Link from "next/link";
import React, { useState } from "react";

interface pageProps {
  message: string;
}

function logornot({ message }: pageProps) {
  const [modal, setModal] = useState(false);
  const onClose = () => {
    setModal(!modal);
  };
  return (
    <>
      {modal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]">
          <div className="bg-neutral-700 w-full h-fit max-w-3xl sm:rounded-lg p-5 shadow-xl">
            <div className="flex justify-between items-center p-4 border-b">
              <Link
                className="bg-blue-600 hover:bg-blue-700 rounded-md px-3 py-2 text-white text-lg font-semibold"
                href={"/login"}
              >
                Log in
              </Link>
              <button
                onClick={onClose}
                className="text-white hover:text-gray-300"
              >
                ✖
              </button>
            </div>
            <div className="p-4">
              <p className="text-white">{message}</p>
            </div>
          </div>
        </div>
      )}
      <button
        onClick={onClose}
        className="px-4 py-2 bg-neutral-700 text-white rounded-md  transition-colors"
      >
        Message
      </button>
    </>
  );
}

export default logornot;
