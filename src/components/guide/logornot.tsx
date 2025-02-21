"use client";
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
              <h2 className="text-white text-lg font-semibold">
                Please Log In First
              </h2>
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
