"use client";
import Link from "next/link";
import KnownFor from "../KnowFor";
import ThreePrefrenceBtn from "@/components/buttons/threePrefrencebtn";
import SendMessageModal from "@components/message/sendCard";
import { useState } from "react";
import { LuSend } from "react-icons/lu";
import { GenreList } from "@/staticData/genreList";

function PersonCredits({
  cast,
  crew,
  name,
}: {
  cast: any[];
  crew: any[];
  name: string;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cardData, setCardData] = useState<any>(null);
  const [mediaFilter, setMediaFilter] = useState<string>("all"); // all, movie, tv
  const [excludeTalkShow, setExcludeTalkShow] = useState<boolean>(false);

  // Sort and group cast by year
  const sortedCast = cast?.slice().sort((a: any, b: any) => {
    const dateA = new Date(
      a.release_date || a.first_air_date || "1900-01-01"
    ).getTime();
    const dateB = new Date(
      b.release_date || b.first_air_date || "1900-01-01"
    ).getTime();
    return dateB - dateA;
  });

  // Group by year
  const timelineData = sortedCast.reduce((acc: any, item: any) => {
    const year = new Date(
      item.release_date || item.first_air_date || "1900-01-01"
    ).getFullYear();
    if (!acc[year]) acc[year] = [];
    acc[year].push(item);
    return acc;
  }, {});

  // Filter cast based on media type and role
  const filteredCast = sortedCast.filter((item: any) => {
    const matchesMedia =
      mediaFilter === "all" || item.media_type === mediaFilter;
    const matchesRole = excludeTalkShow
      ? item.character !== "Talk Show Host"
      : true;
    return matchesMedia && matchesRole;
  });

  const handleCardTransfer = (data: any) => {
    setCardData(data);
    setIsModalOpen(true);
  };

  // Render card for cast or crew
  const renderCard = (data: any, isCrew: boolean = false, index: number) => {
    const title = data.title || data.name || "Unknown";
    const imageUrl =
      (data.poster_path || data.backdrop_path) && !data.adult
        ? `https://image.tmdb.org/t/p/w342${
            data.poster_path || data.backdrop_path
          }`
        : data.adult
        ? "/pixeled.webp"
        : "/no-photo.webp";
    const year = new Date(
      data.release_date || data.first_air_date || "1900-01-01"
    ).getFullYear();

    return (
      <div
        key={index}
        className={`relative group flex flex-col rounded-md overflow-hidden bg-neutral-900 text-gray-300 w-36 h-full transition-all duration-300 hover:shadow-lg`}
      >
        <div className="absolute top-0 left-0 z-10">
          <p
            className={`p-1 text-white rounded-br-md text-sm ${
              data.adult ? "bg-red-600" : "bg-black"
            }`}
          >
            {data.media_type}
          </p>
        </div>
        {isCrew && (
          <div className="absolute top-0 right-0 z-10">
            <p className="p-1 bg-red-600 text-white rounded-bl-md text-sm">
              In Prod.
            </p>
          </div>
        )}
        <Link
          href={`/app/${data.media_type}/${data.id}-${title
            .trim()
            .replace(/[^a-zA-Z0-9]/g, "-")
            .replace(/-+/g, "-")}`}
          className="h-full w-full" // 2:3 aspect ratio with w-36
        >
          <img
            className="object-cover w-full h-full transition-opacity duration-300 group-hover:opacity-70"
            src={imageUrl}
            alt={title}
            loading="lazy"
          />
        </Link>
        <div className="flex flex-col ">
          {!isCrew && (
            <>
              <ThreePrefrenceBtn
                genres={
                  data.genre_ids
                    ?.map(
                      (id: number) =>
                        GenreList.genres.find((g: any) => g.id === id)?.name
                    )
                    .filter(Boolean) || []
                }
                cardId={data.id}
                cardType={data.media_type}
                cardName={title}
                cardAdult={data.adult}
                cardImg={data.poster_path || data.backdrop_path}
              />
              <div className="py-2 border-t border-neutral-950 bg-neutral-800 hover:bg-neutral-700">
                <button
                  className="w-full flex justify-center text-lg text-gray-300 hover:text-white"
                  onClick={() => handleCardTransfer(data)}
                >
                  <LuSend />
                </button>
              </div>
            </>
          )}
          <div className="bg-indigo-700 p-2 text-gray-200 h-full">
            <Link
              href={`/app/${data.media_type}/${data.id}-${title
                .trim()
                .replace(/[^a-zA-Z0-9]/g, "-")
                .replace(/-+/g, "-")}`}
              className="hover:underline"
            >
              <span className="text-sm truncate block">{title}</span>
            </Link>
            {!isCrew && data.character && (
              <p className="text-xs">character - {data.character}</p>
            )}
            {isCrew && (
              <p className="text-xs mt-1 flex flex-col gap-1">
                {name}:{" "}
                <span className="font-bold">
                  {data.job} ({data.department})
                </span>
                <span>{data.release_date}</span>
              </p>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto py-6  text-white">
      <SendMessageModal
        media_type={cardData?.media_type}
        data={cardData}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <h1 className="text-lg font-bold my-3">Known for</h1>
      <KnownFor castData={cast} />

      {/* Filters */}
      <div className="bg-neutral-800 p-4 rounded-md mb-6">
        <h2 className="text-lg font-semibold mb-4">Filter Credits</h2>
        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <select
            value={mediaFilter}
            onChange={(e) => setMediaFilter(e.target.value)}
            className="px-4 py-2 bg-neutral-700 rounded-md text-white w-full sm:w-auto"
          >
            <option value="all">All Media</option>
            <option value="movie">Movies</option>
            <option value="tv">TV Shows</option>
          </select>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={excludeTalkShow}
              onChange={(e) => setExcludeTalkShow(e.target.checked)}
              className="w-5 h-5"
            />
            <span className="text-sm">Exclude Talk Show Host</span>
          </label>
        </div>
      </div>

      {/* Timeline */}
      <div>
        <h1 className="text-2xl font-bold my-6">Timeline</h1>
        {Object.keys(timelineData).length > 0 ? (
          <div className="space-y-8">
            {Object.entries(timelineData)
              .sort(([yearA], [yearB]) => Number(yearB) - Number(yearA))
              .map(([year, items]: [string, any], index: number) => (
                <div key={index} className="relative">
                  <div className="flex items-center mb-4">
                    <span className="text-xl font-semibold bg-indigo-700 px-4 py-2 rounded-full">
                      {year}
                    </span>
                    <div className="flex-1 h-px bg-neutral-700 ml-4"></div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {items
                      .filter(
                        (item: any) =>
                          (mediaFilter === "all" ||
                            item.media_type === mediaFilter) &&
                          (!excludeTalkShow ||
                            item.character !== "Talk Show Host")
                      )
                      .map((item: any, index: number) =>
                        renderCard(item, false, index)
                      )}
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <p className="text-center text-neutral-400">
            No acting credits available.
          </p>
        )}
      </div>

      {/* Crew Section */}
      {crew.length > 0 && (
        <div className="mt-10">
          <h3 className="text-xl font-semibold my-6">In Production - Crew</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {crew.map((item: any, index: number) =>
              renderCard(item, true, index)
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default PersonCredits;
