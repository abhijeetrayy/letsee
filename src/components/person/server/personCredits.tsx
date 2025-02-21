"use client";
import Link from "next/link";
import KnownFor from "../KnowFor";
import ThreePrefrenceBtn from "@/components/buttons/threePrefrencebtn";
import { useState } from "react";
import SendMessageModal from "@components/message/sendCard";
import { LuSend } from "react-icons/lu";
import { GenreList } from "@/staticData/genreList";

function PersonCredits({ cast, crew, name }: any) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cardData, setCardData] = useState([]) as any;

  // Sort cast by release date
  const sortedCast = cast?.slice().sort((a: any, b: any) => {
    const dateA = new Date(
      a.release_date || a.first_air_date || "1900-01-01"
    ).getTime();
    const dateB = new Date(
      b.release_date || b.first_air_date || "1900-01-01"
    ).getTime();
    return dateB - dateA;
  });

  const handleCardTransfer = (data: any) => {
    setCardData(data);
    setIsModalOpen(true);
  };

  return (
    <div>
      <SendMessageModal
        media_type={cardData.media_type}
        data={cardData}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <KnownFor castData={cast} />

      <div>
        <h1 className="my-3">Timeline - </h1>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {sortedCast.map((data: any, index: number) => (
            <div key={`movie-${index}`} className="relative">
              <div className="group flex flex-col justify-between rounded-md bg-black w-full h-full text-gray-300 overflow-hidden duration-300 lg:hover:scale-105">
                <Link
                  className="relative flex h-full"
                  href={`/app/${data.media_type}/${data.id}-${(
                    data.name || data.title
                  )
                    .trim()
                    .replace(/[^a-zA-Z0-9]/g, "-")
                    .replace(/-+/g, "-")}`}
                >
                  <div className="absolute top-0 left-0 z-10 lg:opacity-0 lg:group-hover:opacity-100">
                    {data.adult ? (
                      <p className="p-1 bg-red-600 text-white rounded-br-md text-sm">
                        Adult
                      </p>
                    ) : (
                      <p className="p-1 bg-black text-white rounded-br-md text-sm">
                        {data.media_type}
                      </p>
                    )}
                  </div>
                  <div className="absolute top-0 right-0 z-10">
                    {(data.release_date || data.first_air_date) && (
                      <p className="p-1 bg-indigo-600 text-white rounded-tr-sm rounded-bl-md text-sm">
                        {new Date(data.release_date).getFullYear() ||
                          new Date(data.first_air_date).getFullYear()}
                      </p>
                    )}
                  </div>
                  <img
                    className="h-full w-full object-cover"
                    src={
                      (data.poster_path || data.backdrop_path) && !data.adult
                        ? `https://image.tmdb.org/t/p/w342${
                            data.poster_path || data.backdrop_path
                          }`
                        : data.adult
                        ? "/pixeled.webp"
                        : "/no-photo.webp"
                    }
                    loading="lazy"
                    alt={data.title}
                  />
                </Link>
                <div className="flex flex-col gap-1 bottom-0 w-full bg-neutral-800 z-20">
                  <ThreePrefrenceBtn
                    genres={data.genre_ids
                      .map((id: number) => {
                        const genre = GenreList.genres.find(
                          (g: any) => g.id === id
                        );
                        return genre ? genre.name : null;
                      })
                      .filter(Boolean)}
                    cardId={data.id}
                    cardType={data.media_type}
                    cardName={data.name || data.title}
                    cardAdult={data.adult}
                    cardImg={data.poster_path || data.backdrop_path}
                  />
                  <div className="py-2 border-t border-neutral-950 hover:bg-neutral-700">
                    <button
                      className="w-full  flex justify-center text-lg text-center "
                      onClick={() => handleCardTransfer(data)}
                    >
                      <LuSend />
                    </button>
                  </div>
                  <div
                    title={data.name || data.title}
                    className="w-full py-2 flex flex-col gap-2  px-4 bg-indigo-700 text-gray-200"
                  >
                    <Link
                      href={`/app/${data.media_type}/${data.id}-${(
                        data.name || data.title
                      )
                        .trim()
                        .replace(/[^a-zA-Z0-9]/g, "-")
                        .replace(/-+/g, "-")}`}
                      className="h-full"
                    >
                      <span className="hover:underline">
                        {data?.title
                          ? data.title.length > 20
                            ? data.title?.slice(0, 20) + "..."
                            : data.title
                          : data.name.length > 20
                          ? data.name?.slice(0, 20) + "..."
                          : data.name}
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {crew.length >= 1 && (
        <h3 className="col-span-5 p-3 font-semibold">In prod. ~ crew</h3>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {crew?.map((data: any, index: number) => (
          <div className="rounded-md overflow-hidden" key={`movie-${index}`}>
            <div className="relative group flex flex-col bg-black w-full h-full text-gray-300">
              <div className="absolute top-0 left-0 z-30">
                <p className="p-1 bg-black text-white rounded-br-md text-sm">
                  {data.media_type}
                </p>
              </div>
              <div className="absolute top-0 right-0 z-30">
                <p className="p-1 bg-red-600 text-white rounded-bl-md text-sm">
                  In Prod.
                </p>
              </div>
              <div className="relative">
                <Link
                  href={`/app/${data.media_type}/${data.id}-${(
                    data.name || data.title
                  )
                    .trim()
                    .replace(/[^a-zA-Z0-9]/g, "-")
                    .replace(/-+/g, "-")}`}
                >
                  <img
                    className="w-full h-[270px] sm:h-[290px] md:h-[322px] object-cover duration-300 lg:group-hover:opacity-70"
                    src={
                      (data.poster_path || data.backdrop_path) && !data.adult
                        ? `https://image.tmdb.org/t/p/w185${
                            data.poster_path || data.backdrop_path
                          }`
                        : data.adult
                        ? "/pixeled.webp"
                        : "/no-photo.webp"
                    }
                    alt={data.title}
                  />
                </Link>
                <div className="bottom-0 w-full  bg-neutral-800 z-20">
                  <ThreePrefrenceBtn
                    genres={data.genre_ids
                      .map((id: number) => {
                        const genre = GenreList.genres.find(
                          (g: any) => g.id === id
                        );
                        return genre ? genre.name : null;
                      })
                      .filter(Boolean)}
                    cardId={data.id}
                    cardType={data.media_type}
                    cardName={data.name || data.title}
                    cardAdult={data.adult}
                    cardImg={data.poster_path || data.backdrop_path}
                  />
                  <div className="py-2 border-t border-neutral-950 hover:bg-neutral-700">
                    <button
                      className="w-full  flex justify-center text-lg text-center "
                      onClick={() => handleCardTransfer(data)}
                    >
                      <LuSend />
                    </button>
                  </div>
                </div>
              </div>
              <div className="flex flex-col h-full bg-purple-500 text-gray-100 px-2 py-2">
                <div className="relative">
                  <Link
                    className="text-lg font-semibold hover:underline"
                    href={`/app/${data.media_type}/${data.id}-${(
                      data.name || data.title
                    )
                      .trim()
                      .replace(/[^a-zA-Z0-9]/g, "-")
                      .replace(/-+/g, "-")}`}
                  >
                    {data.title || data.name}
                  </Link>
                  <p className="text-xs mb-1">
                    {data.release_date || data.first_air_date}
                  </p>
                  <div className="mt-auto">
                    <p className="text-xs">
                      {name}:{" "}
                      <span className="font-bold">
                        {data.department}-{data.job}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PersonCredits;
