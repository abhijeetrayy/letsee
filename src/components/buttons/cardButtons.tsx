"use client";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import React, { useContext } from "react";
import UserPrefrenceContext from "@/app/contextAPI/userPrefrence";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

interface CardMovieButtonProps {
  icon: React.ReactNode;
  name: string;
  itemId: number;
  funcType: "watched" | "watchlater" | "favorite";
  mediaType: string;
  imgUrl: string;
  adult: boolean;
  state: boolean;
  Wstate: boolean;
  WLstate: boolean;
  Favstate: boolean;
}

const CardMovieButton: React.FC<CardMovieButtonProps> = ({
  icon,
  name,
  itemId,
  funcType,
  mediaType,
  imgUrl,
  adult,
  state,
  Wstate,
  WLstate,
  Favstate,
}) => {
  const { setUserPrefrence, loading }: any = useContext(UserPrefrenceContext);

  async function handleAction(
    funcType: "watched" | "watchlater" | "favorite",
    itemId: number,
    name: string,
    mediaType: string,
    imgUrl: string,
    adult: boolean
  ) {
    if (loading) {
      return;
    }
    const toastId = toast.loading(state ? "Removing..." : "Adding...");
    let apiUrl = "";
    let apiDeleteUrl = "";
    let successMessage = "";

    switch (funcType) {
      case "watched":
        apiUrl = "/api/watchedButton";
        apiDeleteUrl = "/api/deletewatchedButton";
        successMessage = state ? "Removed from watched" : "Added to watched";
        break;
      case "watchlater":
        apiUrl = "/api/watchlistButton";
        apiDeleteUrl = "/api/deletewatchlistButton";
        successMessage = state
          ? "Removed from Watch Later"
          : "Saved to Watch Later";
        break;
      case "favorite":
        apiUrl = "/api/favoriteButton";
        apiDeleteUrl = "/api/deletefavoriteButton";
        successMessage = state
          ? "Removed from favorites"
          : "Added to favorites";
        break;
      default:
        toast.update(toastId, {
          render: "Invalid action",
          type: "error",
          isLoading: false,
          autoClose: 5000,
        });
        return;
    }

    try {
      if (funcType === "watchlater" && !state) {
        const response = await fetch("/api/watchlistButton", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ itemId, name, mediaType, imgUrl, adult }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "An error occurred");
        }

        setUserPrefrence((prev: any) => {
          const updatedPrefrence = { ...prev };

          // Always remove from "watched" if it exists
          if (updatedPrefrence["watched"]) {
            updatedPrefrence["watched"] = updatedPrefrence["watched"].filter(
              (item: any) => item.item_id !== itemId
            );
          }

          // Handle "watchlater"
          if (!updatedPrefrence["watchlater"]) {
            updatedPrefrence["watchlater"] = [];
          }

          const watchlaterIndex = updatedPrefrence["watchlater"].findIndex(
            (item: any) => item.item_id === itemId
          );

          if (data.action === "added") {
            if (watchlaterIndex === -1) {
              // Item doesn't exist in watchlater, so add it
              updatedPrefrence["watchlater"].push({ item_id: itemId });
            }
          } else if (data.action === "removed") {
            if (watchlaterIndex !== -1) {
              // Item exists in watchlater, so remove it
              updatedPrefrence["watchlater"].splice(watchlaterIndex, 1);
            }
          }

          return updatedPrefrence;
        });

        toast.update(toastId, {
          render: successMessage,
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
      }
      if (funcType === "watched" && !state) {
        const response = await fetch("/api/watchedButton", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ itemId, name, mediaType, imgUrl, adult }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "An error occurred");
        }

        setUserPrefrence((prev: any) => {
          const updatedPrefrence = { ...prev };

          // Always remove from "watched" if it exists
          if (updatedPrefrence["watchlater"]) {
            updatedPrefrence["watchlater"] = updatedPrefrence[
              "watchlater"
            ].filter((item: any) => item.item_id !== itemId);
          }

          // Handle "watchlater"
          if (!updatedPrefrence["watched"]) {
            updatedPrefrence["watched"] = [];
          }

          const watchlaterIndex = updatedPrefrence["watched"].findIndex(
            (item: any) => item.item_id === itemId
          );

          if (data.action === "added") {
            if (watchlaterIndex === -1) {
              // Item doesn't exist in watchlater, so add it
              updatedPrefrence["watched"].push({ item_id: itemId });
            }
          } else if (data.action === "removed") {
            if (watchlaterIndex !== -1) {
              // Item exists in watchlater, so remove it
              updatedPrefrence["watched"].splice(watchlaterIndex, 1);
            }
          }

          return updatedPrefrence;
        });

        toast.update(toastId, {
          render: successMessage,
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
      } else {
        const url = state ? apiDeleteUrl : apiUrl;
        const response = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ itemId, name, mediaType, imgUrl, adult }),
        });

        const data = await response.json();
        console.log(data);

        if (!response.ok) {
          throw new Error(data.error || "An error occurred");
        }

        setUserPrefrence((prev: any) => {
          const updatedPrefrence = { ...prev };

          if (state) {
            // Remove item if it exists
            updatedPrefrence[funcType] = updatedPrefrence[funcType].filter(
              (item: any) => item.item_id !== itemId
            );
          } else {
            // Add item if it doesn't exist
            if (!updatedPrefrence[funcType]) {
              updatedPrefrence[funcType] = [];
            }
            updatedPrefrence[funcType].push({ item_id: itemId });
          }

          return updatedPrefrence;
        });

        toast.update(toastId, {
          render: successMessage,
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
      }
    } catch (error: any) {
      toast.update(toastId, {
        render: error.message || "An error occurred",
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
      console.error(error);
    }
  }

  return (
    <button
      onClick={() =>
        handleAction(funcType, itemId, name, mediaType, imgUrl, adult)
      }
      title={funcType}
      className="h-full w-full flex items-center justify-center text-2xl bg-neutral-800 text-neutral-200 hover:bg-neutral-700"
    >
      {loading ? (
        <div className="w-fit m-auto animate-spin">
          <AiOutlineLoading3Quarters />
        </div>
      ) : (
        icon
      )}
    </button>
  );
};

export default CardMovieButton;
