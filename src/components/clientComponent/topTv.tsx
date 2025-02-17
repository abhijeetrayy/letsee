"use client";
import Link from "next/link";
import React, { useState } from "react";
import ThreePrefrenceBtn from "@components/buttons/threePrefrencebtn";
import SendMessageModal from "@components/message/sendCard";
import { LuSend } from "react-icons/lu";

export default function tvTop({ TrendingTv }: any) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cardData, setCardData] = useState([]) as any;

  const handleCardTransfer = (data: any) => {
    setCardData(data);
    setIsModalOpen(true);
  };
  return (
    <div>
      <SendMessageModal
        data={cardData}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />{" "}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-w-6xl w-full m-auto">
        {TrendingTv?.results.map((item: any) => (
          <div
            key={item.id}
            className="group relative flex flex-col justify-between w-full h-full bg-neutral-700 rounded-md overflow-hidden "
          >
            <div className="absolute top-0 left-0">
              <p className="px-1 py-1 bg-neutral-950  text-white rounded-br-md">
                {item.media_type}
              </p>
            </div>
            <Link
              className="w-full  h-full"
              href={`/app/${item.media_type}/${item.id}-${(
                item?.name || item?.title
              )
                .trim()
                .replace(/[^a-zA-Z0-9]/g, "-")
                .replace(/-+/g, "-")}`}
            >
              <img
                className="h-fit w-full"
                src={`https://image.tmdb.org/t/p/w342${item.poster_path}`}
                alt={item.name}
              />
            </Link>
            <div className="lg:absolute lg:bottom-0  w-full lg:opacity-0 lg:group-hover:opacity-100">
              <div className="  bg-neutral-900 ">
                <ThreePrefrenceBtn
                  genres={item.genres.map((genre: any) => genre.name)}
                  cardId={item.id}
                  cardType={item.media_type}
                  cardName={item.name || item.title}
                  cardAdult={item.adult}
                  cardImg={item.poster_path || item.backdrop_path}
                />
                <div className="py-2 border-t border-neutral-950 bg-neutral-800 hover:bg-neutral-700">
                  <button
                    className="w-full  flex justify-center text-lg text-center "
                    onClick={() => handleCardTransfer(item)}
                  >
                    <LuSend />
                  </button>
                </div>
              </div>
              <div className=" min-h-14 flex flex-col justify-center px-3 pb-1   w-full bg-indigo-700 text-gray-100 ">
                <p className="">
                  {item.name?.length > 40 || item.title?.length > 40 ? (
                    <span>
                      {item.name?.slice(0, 40) || item.title?.slice(0, 40)}..
                    </span>
                  ) : (
                    item.name || item.title
                  )}{" "}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
