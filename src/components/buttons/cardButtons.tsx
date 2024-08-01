"use client";

import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function CardMovieButton({
  icon,
  name,
  itemId,
  funcType,
  mediaType,
  imgUrl,
  adult,
}: any) {
  async function handleAction() {
    const toastit = toast.loading("Adding...");
    if (funcType == "watched") {
      try {
        const actionResult = await fetch("/api/watchedButton", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ itemId, name, mediaType, imgUrl, adult }),
        });
        const data = await actionResult.json();
        toast.update(toastit, {
          render: "Added to watched",
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
        console.log(data);
      } catch (error) {
        toast.update(toastit, {
          render: "An error occurred",
          type: "error",
          isLoading: false,
          autoClose: 5000,
        });
        console.error(error);
      }
    }
    if (funcType == "watchlater") {
      try {
        const actionResult = await fetch("/api/watchlistButton", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ itemId, name, mediaType, imgUrl, adult }),
        });
        const data = await actionResult.json();
        toast.update(toastit, {
          render: "Save to Watch Later",
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
        console.log(data);
      } catch (error) {
        toast.update(toastit, {
          render: "An error occurred",
          type: "error",
          isLoading: false,
          autoClose: 5000,
        });
        console.error(error);
      }
    }
    if (funcType == "favorite") {
      try {
        const actionResult = await fetch("/api/favoriteButton", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ itemId, name, mediaType, imgUrl, adult }),
        });
        const data = await actionResult.json();
        toast.update(toastit, {
          render: "Your favorite",
          type: "success",
          isLoading: false,
          autoClose: 2000,
        });
        console.log(data);
      } catch (error) {
        toast.update(toastit, {
          render: "An error occurred",
          type: "error",
          isLoading: false,
          autoClose: 5000,
        });
        console.error(error);
      }
    }
  }

  return (
    <>
      <button
        onClick={handleAction}
        title={funcType}
        className="h-full w-full flex items-center justify-center text-2xl bg-neutral-800 text-neutral-200 hover:bg-neutral-700"
      >
        {icon}
      </button>
    </>
  );
}

export default CardMovieButton;
