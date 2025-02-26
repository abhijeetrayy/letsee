// components/CardMovieButton.tsx
"use client";
import React, { useState, useContext } from "react";
import UserPrefrenceContext from "@/app/contextAPI/userPrefrence";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import toast from "react-hot-toast";
import Link from "next/link";

interface CardMovieButtonProps {
  icon: React.ReactNode;
  name: string;
  itemId: number;
  funcType: "watched" | "watchlater" | "favorite";
  mediaType: string;
  imgUrl: string;
  adult: boolean;
  state: boolean; // true if already in the list, false if not
  genres: string[]; // Updated to string[] for clarity
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
  genres,
}) => {
  const [modal, setModal] = useState(false);
  const { setUserPrefrence, loading, user }: any =
    useContext(UserPrefrenceContext);

  const handleModal = () => {
    setModal(!modal);
  };

  const handleAction = async (
    funcType: "watched" | "watchlater" | "favorite",
    itemId: number,
    name: string,
    mediaType: string,
    imgUrl: string,
    adult: boolean
  ) => {
    if (loading) {
      toast.loading("Processing...");
      return;
    }
    if (!user) {
      toast.error("Please log in to perform this action");
      return handleModal();
    }

    const apiEndpoints = {
      watched: "/api/watchedButton",
      watchlater: "/api/watchlistButton",
      favorite: "/api/favoriteButton",
    };

    const deleteEndpoints = {
      watched: "/api/deletewatchedButton",
      watchlater: "/api/deletewatchlistButton",
      favorite: "/api/deletefavoriteButton",
    };

    const url = state ? deleteEndpoints[funcType] : apiEndpoints[funcType];
    const actionText = state ? "Removed from" : "Added to";
    const toastId = toast.loading(`${actionText} ${funcType}...`);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          itemId,
          name,
          mediaType,
          imgUrl,
          adult,
          genres,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "An error occurred");
      }

      // Update user preference state
      setUserPrefrence((prev: any) => {
        const updatedPrefrence = { ...prev };

        const updateList = (listKey: string, item: any, shouldAdd: boolean) => {
          if (!updatedPrefrence[listKey]) updatedPrefrence[listKey] = [];
          const index = updatedPrefrence[listKey].findIndex(
            (i: any) => i.item_id === item.item_id
          );

          if (shouldAdd && index === -1) {
            updatedPrefrence[listKey].push(item);
          } else if (!shouldAdd && index !== -1) {
            updatedPrefrence[listKey].splice(index, 1);
          }
        };

        const item = { item_id: itemId };

        switch (funcType) {
          case "watched":
            if (!state) {
              updateList("watchlater", item, false);
              updateList("watched", item, true);
            } else {
              updateList("watched", item, false);
              updateList("favorite", item, false);
            }
            break;
          case "favorite":
            if (!state) {
              updateList("watchlater", item, false);
              updateList("watched", item, true);
              updateList("favorite", item, true);
            } else {
              updateList("favorite", item, false);
            }
            break;
          case "watchlater":
            if (!state) {
              updateList("watched", item, false);
              updateList("favorite", item, false);
              updateList("watchlater", item, true);
            } else {
              updateList("watchlater", item, false);
            }
            break;
          default:
            break;
        }

        return updatedPrefrence;
      });

      toast.success(`${actionText} ${funcType} successfully`, { id: toastId });
    } catch (error: any) {
      toast.error(
        `Failed to ${actionText.toLowerCase()} ${funcType}: ${error.message}`,
        {
          id: toastId,
        }
      );
    }
  };

  return (
    <>
      {modal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-neutral-700 w-full h-fit max-w-3xl sm:rounded-lg p-5 shadow-xl">
            <div className="flex justify-between items-center p-4 border-b">
              <Link
                className="bg-blue-600 hover:bg-blue-700 rounded-md px-3 py-2 text-white text-lg font-semibold"
                href={"/login"}
              >
                Log in
              </Link>
              <button
                onClick={handleModal}
                className="text-white hover:text-gray-300"
              >
                ✖
              </button>
            </div>
            <div className="p-4">
              <p className="text-white">You need to log in to save.</p>
            </div>
          </div>
        </div>
      )}
      <button
        onClick={
          user
            ? () =>
                handleAction(funcType, itemId, name, mediaType, imgUrl, adult)
            : handleModal
        }
        title={funcType}
        className="h-full w-full flex items-center justify-center text-2xl bg-neutral-800 text-neutral-200 hover:bg-neutral-700 disabled:bg-neutral-600 disabled:cursor-not-allowed"
        disabled={loading}
      >
        {loading ? (
          <div className="w-fit m-auto animate-spin">
            <AiOutlineLoading3Quarters />
          </div>
        ) : (
          icon
        )}
      </button>
    </>
  );
};

export default CardMovieButton;
