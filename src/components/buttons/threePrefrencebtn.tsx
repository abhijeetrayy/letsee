"use client";
import UserPrefrenceContext from "@/app/contextAPI/userPrefrence";
import { useContext } from "react";
import { CiHeart } from "react-icons/ci";
import { FcLike } from "react-icons/fc";
import { MdOutlineWatchLater } from "react-icons/md";
import { PiEyeBold } from "react-icons/pi";
import { RiEyeCloseLine } from "react-icons/ri";
import CardMovieButton from "./cardButtons";

export default function ThreePrefrencebtn({
  cardId,
  cardType,
  cardName,
  cardAdult,
  cardImg,
  genres,
}: any) {
  const { userPrefrence }: any = useContext(UserPrefrenceContext);

  const isItemWatched = (itemId: number): boolean => {
    if (!userPrefrence || !userPrefrence.watched) return false;
    return userPrefrence.watched.some((pref: any) => pref.item_id === itemId);
  };

  const isItemPreferred = (itemId: number): boolean => {
    if (!userPrefrence || !userPrefrence.favorite) return false;
    return userPrefrence.favorite.some((pref: any) => pref.item_id === itemId);
  };

  const isItemInWatchLater = (itemId: number): boolean => {
    if (!userPrefrence || !userPrefrence.watchlater) return false;
    return userPrefrence.watchlater.some(
      (pref: any) => pref.item_id === itemId
    );
  };

  return (
    <div>
      <div className="w-full bg-neutral-900 overflow-hidden">
        <div className="w-full h-14 grid grid-cols-3">
          <CardMovieButton
            genres={genres}
            itemId={cardId}
            mediaType={cardType}
            name={cardName}
            state={isItemWatched(cardId)}
            Wstate={isItemWatched(cardId)}
            Favstate={isItemPreferred(cardId)}
            WLstate={isItemInWatchLater(cardId)}
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
            genres={genres}
            itemId={cardId}
            mediaType={cardType}
            name={cardName}
            state={isItemPreferred(cardId)}
            Wstate={isItemWatched(cardId)}
            Favstate={isItemPreferred(cardId)}
            WLstate={isItemInWatchLater(cardId)}
            funcType={"favorite"}
            adult={cardAdult}
            imgUrl={cardImg}
            icon={isItemPreferred(cardId) ? <FcLike /> : <CiHeart />}
          />
          <CardMovieButton
            genres={genres}
            itemId={cardId}
            mediaType={cardType}
            name={cardName}
            state={isItemInWatchLater(cardId)}
            Wstate={isItemWatched(cardId)}
            Favstate={isItemPreferred(cardId)}
            WLstate={isItemInWatchLater(cardId)}
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
