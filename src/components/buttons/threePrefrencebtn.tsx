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
    if (Array.isArray(userPrefrence.userWatched)) {
      return userPrefrence.userWatched.some(
        (pref: any) => pref.item_id === itemId
      );
    } else if (
      typeof userPrefrence.userWatched === "object" &&
      userPrefrence.userWatched !== null
    ) {
      // If userPrefrence.userPrefrence is an object, check if it has the item_id as a key
      return Object.keys(userPrefrence.userWatched).includes(itemId.toString());
    } else {
      console.error(
        "Unexpected userPrefrence.userPrefrence type:",
        typeof userPrefrence.userWatched
      );
      return false;
    }
  };
  const isItemPreferred = (itemId: number): boolean => {
    if (Array.isArray(userPrefrence.userFavorites)) {
      return userPrefrence.userFavorites.some(
        (pref: any) => pref.item_id === itemId
      );
    } else if (
      typeof userPrefrence.userFavorites === "object" &&
      userPrefrence.userFavorites !== null
    ) {
      // If userPrefrence.userPrefrence is an object, check if it has the item_id as a key
      return Object.keys(userPrefrence.userFavorites).includes(
        itemId.toString()
      );
    } else {
      console.error(
        "Unexpected userPrefrence.userPrefrence type:",
        typeof userPrefrence.userFavorites
      );
      return false;
    }
  };

  return (
    <div>
      {" "}
      <div className=" w-full bg-neutral-900 rounded-md overflow-hidden my-2">
        <div className="w-full h-14 grid grid-cols-3 ">
          <CardMovieButton
            itemId={cardId}
            mediaType={cardType}
            name={cardName}
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
            funcType={"favorite"}
            adult={cardAdult}
            imgUrl={cardImg}
            icon={isItemPreferred(cardId) ? <FcLike /> : <CiHeart />}
          />
          <CardMovieButton
            itemId={cardId}
            mediaType={cardType}
            name={cardName}
            funcType={"watchlater"}
            adult={cardAdult}
            imgUrl={cardImg}
            icon={<CiSaveDown1 />}
          />
        </div>
      </div>
    </div>
  );
}

export default threePrefrencebtn;
