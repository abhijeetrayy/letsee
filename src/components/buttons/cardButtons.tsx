"use client";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React from "react";

interface CardMovieButtonProps {
  icon: React.ReactNode;
  name: string;
  itemId: number;
  funcType: "watched" | "watchlater" | "favorite";
  mediaType: string;
  imgUrl: string;
  adult: boolean;
}

async function handleAction(
  funcType: "watched" | "watchlater" | "favorite",
  itemId: number,
  name: string,
  mediaType: string,
  imgUrl: string,
  adult: boolean
) {
  const toastId = toast.loading("Adding...");
  let apiUrl = "";
  let successMessage = "";

  switch (funcType) {
    case "watched":
      apiUrl = "/api/watchedButton";
      successMessage = "Added to watched";
      break;
    case "watchlater":
      apiUrl = "/api/watchlistButton";
      successMessage = "Saved to Watch Later";
      break;
    case "favorite":
      apiUrl = "/api/favoriteButton";
      successMessage = "Added to favorites";
      break;
  }

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ itemId, name, mediaType, imgUrl, adult }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    toast.update(toastId, {
      render: successMessage,
      type: "success",
      isLoading: false,
      autoClose: 2000,
    });
    console.log(data);
  } catch (error) {
    toast.update(toastId, {
      render: "An error occurred",
      type: "error",
      isLoading: false,
      autoClose: 5000,
    });
    console.error(error);
  }
}

const CardMovieButton: React.FC<CardMovieButtonProps> = ({
  icon,
  name,
  itemId,
  funcType,
  mediaType,
  imgUrl,
  adult,
}) => {
  return (
    <button
      onClick={() =>
        handleAction(funcType, itemId, name, mediaType, imgUrl, adult)
      }
      title={funcType}
      className="h-full w-full flex items-center justify-center text-2xl bg-neutral-800 text-neutral-200 hover:bg-neutral-700"
    >
      {icon}
    </button>
  );
};

export default CardMovieButton;
