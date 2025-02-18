"use client";

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
  genres: [];
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
  const { setUserPrefrence, loading }: any = useContext(UserPrefrenceContext);

  const handleAction = async (
    funcType: "watched" | "watchlater" | "favorite",
    itemId: number,
    name: string,
    mediaType: string,
    imgUrl: string,
    adult: boolean
  ) => {
    if (loading) return;

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

    try {
      // Perform the main action (add/remove)
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

      // Update user preference state based on the action
      setUserPrefrence((prev: any) => {
        const updatedPrefrence = { ...prev };

        // Helper function to add/remove items from a list
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

        // Handle coordination logic
        switch (funcType) {
          case "watched":
            if (!state) {
              // Addition to watched: delete from watchlist and add to watched
              updateList("watchlater", { item_id: itemId }, false);
              updateList("watched", { item_id: itemId }, true);
            } else {
              // Deletion of watched: delete from watched and delete from favorites
              updateList("watched", { item_id: itemId }, false);
              updateList("favorite", { item_id: itemId }, false);
            }
            break;

          case "favorite":
            if (!state) {
              // Addition to favorites: delete from watchlist, add to watched, and add to favorites
              updateList("watchlater", { item_id: itemId }, false);
              updateList("watched", { item_id: itemId }, true);
              updateList("favorite", { item_id: itemId }, true);
            } else {
              // Deletion of favorites: delete from favorites
              updateList("favorite", { item_id: itemId }, false);
            }
            break;

          case "watchlater":
            if (!state) {
              // Addition to watchlist: delete from watched, delete from favorites, and add to watchlist
              updateList("watched", { item_id: itemId }, false);
              updateList("favorite", { item_id: itemId }, false);
              updateList("watchlater", { item_id: itemId }, true);
            } else {
              // Deletion of watchlist: delete from watchlist
              updateList("watchlater", { item_id: itemId }, false);
            }
            break;

          default:
            break;
        }

        return updatedPrefrence;
      });

      console.log(data.message || "Action completed successfully");
    } catch (error: any) {
      console.error("Error:", error.message || "An error occurred");
    }
  };

  return (
    <button
      onClick={() =>
        handleAction(funcType, itemId, name, mediaType, imgUrl, adult)
      }
      title={funcType}
      className="h-full w-full flex items-center justify-center text-2xl bg-neutral-800 text-neutral-200 hover:bg-neutral-700"
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
  );
};

export default CardMovieButton;
