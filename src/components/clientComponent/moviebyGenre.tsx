"use client";

import Link from "next/link";
import React, { useState } from "react";

import ThreeUserPrefrenceBtn from "@components/buttons/threePrefrencebtn";
import SendMessageModal from "@components/message/sendCard";
import { LuSend } from "react-icons/lu";

interface Movie {
  id: number;
  title: string;
  name: string;
  release_date: string;
  first_air_date: string;
  poster_path: string;
  backdrop_path: string;
  media_type: string;
  adult: boolean;
  genres: any;
}

interface MovieByGenreProps {
  Sresults: {
    results: Movie[];
  };
}

function MovieByGenre({ Sresults }: MovieByGenreProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cardData, setCardData] = useState<Movie | null>(null);

  const handleCardTransfer = (data: Movie) => {
    setCardData(data);
    setIsModalOpen(true);
  };

  return (
    <div>
      <SendMessageModal
        data={cardData ? { ...cardData, id: cardData.id.toString() } : null}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <div>
        <div className="text-white w-full my-4">
          <div className="w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Sresults?.results?.map((data: Movie) => (
              <div
                key={data.id}
                className="overflow-hidden relative group flex flex-col bg-indigo-700 w-full h-full text-gray-300 rounded-sm duration-300 lg:hover:scale-105 hover:z-30"
              >
                <div className="absolute top-0 left-0 flex flex-row justify-between w-full z-20">
                  <p className="p-1 bg-black text-white rounded-br-md text-sm">
                    movie
                  </p>
                  {(data.release_date || data.first_air_date) && (
                    <p className="p-1 bg-indigo-600 text-white rounded-bl-md text-sm">
                      {new Date(data.release_date).getFullYear() ||
                        new Date(data.first_air_date).getFullYear()}
                    </p>
                  )}
                </div>
                <Link
                  href={`/app/movie/${data.id}-${(data.name || data.title)
                    .trim()
                    .replace(/[^a-zA-Z0-9]/g, "-")
                    .replace(/-+/g, "-")}`}
                  className="w-full"
                >
                  <img
                    className="relative object-cover max-w-full h-[270px] sm:h-[300px] md:h-[330px]"
                    src={
                      data.poster_path || data.backdrop_path
                        ? `https://image.tmdb.org/t/p/w342${
                            data.poster_path || data.backdrop_path
                          }`
                        : "/no-photo.webp"
                    }
                    width={400}
                    height={400}
                    alt={data.title}
                  />
                </Link>
                <div className="lg:absolute bottom-0 w-full lg:opacity-0 lg:group-hover:opacity-100 z-10">
                  <ThreeUserPrefrenceBtn
                    genres={data.genres.map((genre: any) => genre.name)}
                    cardId={data.id}
                    cardType={"movie"}
                    cardName={data.name || data.title}
                    cardAdult={data.adult}
                    cardImg={data.poster_path || data.backdrop_path}
                  />
                  <div className="py-2 border-t border-neutral-950 bg-neutral-800 hover:bg-neutral-700">
                    <button
                      className="w-full flex justify-center text-lg text-center"
                      onClick={() => handleCardTransfer(data)}
                    >
                      <LuSend />
                    </button>
                  </div>
                  <div
                    title={data.name || data.title}
                    className="w-full flex flex-col gap-2 px-4 bg-indigo-700 text-gray-200"
                  >
                    <Link
                      href={`/app/${data.media_type}/${data.id}-${(
                        data.name || data.title
                      )
                        .trim()
                        .replace(/[^a-zA-Z0-9]/g, "-")
                        .replace(/-+/g, "-")}`}
                      className="mb-1"
                    >
                      <span className="">
                        {data?.title
                          ? data.title.length > 20
                            ? data.title.slice(0, 20) + "..."
                            : data.title
                          : data.name.length > 20
                          ? data.name.slice(0, 20) + "..."
                          : data.name}
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MovieByGenre;
