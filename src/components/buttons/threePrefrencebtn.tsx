"use client";
import UserPrefrenceContext from "@/app/contextAPI/userPrefrence";
import { useContext } from "react";
import { CiHeart } from "react-icons/ci";
import { FcLike } from "react-icons/fc";
import { MdOutlineWatchLater } from "react-icons/md";
import { PiEyeBold } from "react-icons/pi";
import { RiEyeCloseLine } from "react-icons/ri";
import CardMovieButton from "./cardButtons";

function threePrefrencebtn({
  cardId,
  cardType,
  cardName,
  cardAdult,
  cardImg,
}: any) {
  const { userPrefrence }: any = useContext(UserPrefrenceContext);
  const isItemWatched = (itemId: number): boolean => {
    if (!userPrefrence || !userPrefrence.watched) {
      return false;
    }

    if (Array.isArray(userPrefrence.watched)) {
      return userPrefrence.watched.some((pref: any) => pref.item_id === itemId);
    } else if (typeof userPrefrence.watched === "object") {
      return Object.keys(userPrefrence.watched).includes(itemId.toString());
    }

    return false;
  };

  const isItemPreferred = (itemId: number): boolean => {
    if (!userPrefrence || !userPrefrence.favorite) {
      return false;
    }

    if (Array.isArray(userPrefrence.favorite)) {
      return userPrefrence.favorite.some(
        (pref: any) => pref.item_id === itemId
      );
    } else if (typeof userPrefrence.favorite === "object") {
      return Object.keys(userPrefrence.favorite).includes(itemId.toString());
    }

    return false;
  };

  const isItemInWatchLater = (itemId: number): boolean => {
    if (!userPrefrence || !userPrefrence.watchlater) {
      return false;
    }

    if (Array.isArray(userPrefrence.watchlater)) {
      return userPrefrence.watchlater.some(
        (pref: any) => pref.item_id === itemId
      );
    } else if (typeof userPrefrence.watchlater === "object") {
      return Object.keys(userPrefrence.watchlater).includes(itemId.toString());
    }

    return false;
  };

  return (
    <div>
      <div className=" w-full bg-neutral-900 overflow-hidden ">
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
                <MdOutlineWatchLater className="font-bold text-green-500" />
              ) : (
                <MdOutlineWatchLater />
              )
            }
          />
        </div>
      </div>
    </div>
  );
}

export default threePrefrencebtn;
