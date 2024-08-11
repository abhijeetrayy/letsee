"use client";
import React, { useContext } from "react";
import { CiHeart, CiSaveDown1 } from "react-icons/ci";
import { FcLike } from "react-icons/fc";
import { IoEyeOutline } from "react-icons/io5";
import CardMovieButton from "./cardButtons";
import UserPrefrenceContext from "@/app/contextAPI/userPrefrence";
import { PiEyeBold } from "react-icons/pi";
import { RiEyeCloseLine } from "react-icons/ri";

function threePrefrencebtn({
  cardId,
  cardType,
  cardName,
  cardAdult,
  cardImg,
}: any) {
  const { userPrefrence }: any = useContext(UserPrefrenceContext);
  const isItemWatched = (itemId: number): boolean => {
    if (Array.isArray(userPrefrence.watched)) {
      return userPrefrence.watched.some((pref: any) => pref.item_id === itemId);
    } else if (
      typeof userPrefrence.watched === "object" &&
      userPrefrence.watched !== null
    ) {
      // If userPrefrence.userPrefrence is an object, check if it has the item_id as a key
      return Object.keys(userPrefrence.watched).includes(itemId.toString());
    } else {
      console.error(
        "Unexpected userPrefrence.userPrefrence type:",
        typeof userPrefrence.watched
      );
      return false;
    }
  };
  const isItemPreferred = (itemId: number): boolean => {
    if (Array.isArray(userPrefrence.favorite)) {
      return userPrefrence.favorite.some(
        (pref: any) => pref.item_id === itemId
      );
    } else if (
      typeof userPrefrence.favorite === "object" &&
      userPrefrence.favorite !== null
    ) {
      // If userPrefrence.userPrefrence is an object, check if it has the item_id as a key
      return Object.keys(userPrefrence.favorite).includes(itemId.toString());
    } else {
      console.error(
        "Unexpected userPrefrence.userPrefrence type:",
        typeof userPrefrence.favorite
      );
      return false;
    }
  };
  const isItemInWatchLater = (itemId: number): boolean => {
    if (Array.isArray(userPrefrence.watchlater)) {
      return userPrefrence.watchlater.some(
        (pref: any) => pref.item_id === itemId
      );
    } else if (
      typeof userPrefrence.watchlater === "object" &&
      userPrefrence.watchlater !== null
    ) {
      // If userPrefrence.userPrefrence is an object, check if it has the item_id as a key
      return Object.keys(userPrefrence.watchlater).includes(itemId.toString());
    } else {
      console.error(
        "Unexpected userPrefrence.userPrefrence type:",
        typeof userPrefrence.watchlater
      );
      return false;
    }
  };

  return (
    <div>
      <div className=" w-full bg-neutral-900 rounded-md overflow-hidden ">
        <div className="w-full h-14 grid grid-cols-3 ">
          <CardMovieButton
            itemId={cardId}
            mediaType={cardType}
            name={cardName}
            state={isItemWatched(cardId) ? true : false}
            Wstate={isItemWatched(cardId) ? true : false}
            Favstate={isItemPreferred(cardId) ? true : false}
            WLstate={isItemInWatchLater(cardId) ? true : false}
            funcType={"watched"}
            adult={cardAdult}
            imgUrl={cardImg}
            icon={
              isItemWatched(cardId) ? (
                <PiEyeBold className="text-green-600" />
              ) : (
                <RiEyeCloseLine />
              )
            }
          />
          <CardMovieButton
            itemId={cardId}
            mediaType={cardType}
            name={cardName}
            state={isItemPreferred(cardId) ? true : false}
            Wstate={isItemWatched(cardId) ? true : false}
            Favstate={isItemPreferred(cardId) ? true : false}
            WLstate={isItemInWatchLater(cardId) ? true : false}
            funcType={"favorite"}
            adult={cardAdult}
            imgUrl={cardImg}
            icon={isItemPreferred(cardId) ? <FcLike /> : <CiHeart />}
          />
          <CardMovieButton
            itemId={cardId}
            mediaType={cardType}
            name={cardName}
            state={isItemInWatchLater(cardId) ? true : false}
            Wstate={isItemWatched(cardId) ? true : false}
            Favstate={isItemPreferred(cardId) ? true : false}
            WLstate={isItemInWatchLater(cardId) ? true : false}
            funcType={"watchlater"}
            adult={cardAdult}
            imgUrl={cardImg}
            icon={
              isItemInWatchLater(cardId) ? (
                <CiSaveDown1 className="font-bold text-green-500" />
              ) : (
                <CiSaveDown1 />
              )
            }
          />
        </div>
      </div>
    </div>
  );
}

export default threePrefrencebtn;
