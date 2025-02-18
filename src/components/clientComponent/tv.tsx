"use client";
import React, { useState } from "react";
import ThreePrefrenceBtn from "@components/buttons/threePrefrencebtn";
import { LiaImdb } from "react-icons/lia";
import Link from "next/link";
import MovieCast from "@components/movie/MovieCast";
import Video from "@components/movie/Video";
import SendMessageModal from "@components/message/sendCard";
import { LuSend } from "react-icons/lu";

export default function Tv({
  cast,
  crew,
  videos,
  ExternalIDs,
  show,
  id,
  Pimages,
  Bimages,
}: any) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cardData, setCardData] = useState([]) as any;
  const [showFullOverview, setShowFullOverview] = useState(false);

  const handleCardTransfer = (data: any) => {
    setCardData(data);
    setIsModalOpen(true);
  };

  const toggleOverview = () => {
    setShowFullOverview(!showFullOverview);
  };

  return (
    <div>
      <SendMessageModal
        data={cardData}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <div className="text-white relative w-full bg-neutral-900">
        {/* Background Image */}
        <div className="relative flex flex-col items-center justify-center w-full min-h-[550px] h-full">
          <div className="md:absolute w-full h-full overflow-hidden">
            <div
              className="absolute inset-0 z-10 bg-gradient-to-r from-neutral-900 via-transparent to-neutral-900"
              style={{
                background:
                  "linear-gradient(to left,  #171717, transparent 60%, #171717, #171717)",
              }}
            ></div>
            <div
              className="absolute inset-0 z-10 bg-gradient-to-l from-neutral-900 via-transparent to-neutral-900"
              style={{
                background:
                  "linear-gradient(to right,  #171717, transparent 60%, #171717, #171717)",
              }}
            ></div>
            <img
              className="hidden md:flex object-cover w-full h-full opacity-20"
              src={`${
                show.backdrop_path && !show.adult
                  ? `https://image.tmdb.org/t/p/w300${show.backdrop_path}`
                  : "/backgroundjpeg.webp"
              }`}
              width={300}
              height={300}
              alt=""
            />
          </div>

          {/* Show Content */}
          <div className="max-w-6xl w-full relative z-10 flex flex-col md:flex-row gap-8 my-8 px-4">
            {/* Poster */}
            <div className="flex-1">
              <img
                className="rounded-md object-cover h-full max-h-[500px] shadow-lg"
                src={
                  show.adult
                    ? "/pixeled.webp"
                    : `https://image.tmdb.org/t/p/w342${show.poster_path}`
                }
                alt={show.name}
              />
            </div>

            {/* Show Details */}
            <div className="flex-[2] w-full">
              <h1 className="text-4xl font-bold mb-4">
                {show?.adult && (
                  <span className="text-sm px-3 py-1 rounded-md m-2 bg-red-600 text-white z-20">
                    Adult
                  </span>
                )}
                {show.name}
                <span className="text-sm ml-1">-Tv</span>
              </h1>

              {/* Buttons */}
              <div className="w-full bg-neutral-800  overflow-hidden my-4">
                <ThreePrefrenceBtn
                  genres={show.genres.map((genre: any) => genre.name)}
                  cardId={show.id}
                  cardType={"tv"}
                  cardName={show.name || show.title}
                  cardAdult={show.adult}
                  cardImg={show.poster_path || show.backdrop_path}
                />
                <div className="py-2 border-t  border-neutral-700 bg-neutral-700 hover:bg-neutral-600 transition-colors rounded-b-md">
                  <button
                    className="w-full flex justify-center text-lg text-center hover:text-neutral-400 transition-colors"
                    onClick={() => handleCardTransfer(show)}
                  >
                    <LuSend />
                  </button>
                </div>
              </div>

              {/* Popularity */}
              {show?.popularity && (
                <div className="my-4 text-neutral-300">
                  Popularity:{" "}
                  <span className="text-green-600 font-bold">
                    {show.popularity}
                  </span>
                </div>
              )}

              {/* IMDb Link */}
              {ExternalIDs?.imdb_id && (
                <div className="flex flex-row items-center gap-2 my-4 text-neutral-300">
                  <LiaImdb className="text-4xl" />
                  <Link
                    target="_blank"
                    href={`https://imdb.com/title/${ExternalIDs.imdb_id}`}
                    className="hover:underline"
                  >
                    {show.name}
                  </Link>
                </div>
              )}

              {/* Overview */}
              <div className="my-4 text-neutral-300">
                <p>
                  {showFullOverview
                    ? show.overview
                    : show.overview.slice(0, 300)}
                  {show.overview.length > 300 && !showFullOverview && "..."}
                </p>
                {show.overview.length > 300 && (
                  <button
                    onClick={toggleOverview}
                    className="text-blue-500 hover:text-blue-400 mt-2"
                  >
                    {showFullOverview ? "Read Less" : "Read More"}
                  </button>
                )}
              </div>

              {/* Show Details */}
              <div className="my-2 flex flex-col gap-1 text-neutral-300">
                <p>First Air Date: {show.first_air_date}</p>
                <p>Last Air Date: {show.last_air_date}</p>
                <p>Status: {show.status}</p>
                <p>Number of Seasons: {show.number_of_seasons}</p>
                <p>Number of Episodes: {show.number_of_episodes}</p>
              </div>

              {/* Genres */}
              <div className="my-4 flex flex-row gap-2">
                <div className="text-neutral-300 mb-2">Genre:</div>
                <div className="flex flex-wrap gap-1">
                  {show.genres.map((genre: any) => (
                    <Link
                      href={`/app/tvbygenre/list/${genre.id}-${genre.name}`}
                      key={genre.id}
                      className="px-3 py-1 bg-blue-800 hover:bg-neutral-700 rounded-full text-sm transition-colors"
                    >
                      {genre.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Created By */}
              {show.created_by.length !== 0 && (
                <div className="my-4 text-neutral-300">
                  <span>Created by: </span>
                  {show.created_by.map((creator: any, index: number) => (
                    <Link
                      className="hover:underline"
                      href={`/app/person/${creator.id}-${creator.name
                        .trim()
                        .replace(/[^a-zA-Z0-9]/g, "-")
                        .replace(/-+/g, "-")}`}
                      key={creator.id}
                    >
                      {creator.name}
                      {index < show.created_by.length - 1 && ", "}
                    </Link>
                  ))}
                </div>
              )}
              {/* Production Companies */}
              {show.production_companies.length !== 0 && (
                <div className="my-4 text-neutral-300">
                  <span>Production Companies: </span>
                  {show.production_companies.map(
                    (company: any, index: number) => (
                      <span className="break-words" key={index}>
                        {company.name}
                        {index < show.production_companies.length - 1 && ", "}
                      </span>
                    )
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Show Cast */}
        <MovieCast credits={cast} id={show.id} type={"tv"} />

        {/* Seasons */}
        {show.seasons && (
          <div className="max-w-6xl w-full mx-auto my-8 px-4">
            <h2 className="text-2xl font-bold mb-4">Seasons</h2>
            <div className="flex flex-row gap-4 overflow-x-auto no-scrollbar">
              {show.seasons
                .filter((item: any) => item.name !== "Specials")
                .map((season: any, index: number) => (
                  <div key={index} className="flex flex-col gap-2">
                    <img
                      src={`${
                        season.poster_path
                          ? show.adult
                            ? "/pixeled.webp"
                            : `https://image.tmdb.org/t/p/w185${season.poster_path}`
                          : "/no-photo.webp"
                      }`}
                      className="min-w-44 max-w-44 h-full object-cover border border-indigo-600 rounded-md"
                      alt={season.name}
                    />
                    <div>
                      <h2 className="text-sm md:text-base font-bold">
                        {season.name}
                      </h2>
                      <p className="text-sm text-neutral-400">
                        {season.air_date}
                      </p>
                      <p className="text-sm text-neutral-400">
                        Episodes: {season.episode_count}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Videos */}
        <Video videos={videos} movie={show} />

        {/* Images */}
        {(Bimages.length > 0 || Pimages.length > 0) && (
          <div className="max-w-6xl w-full mx-auto my-8 px-4">
            <h1 className="text-lg font-bold mb-4">{show.name}: Images</h1>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {(Bimages.length > 0 ? Bimages : Pimages)
                ?.slice(0, 12)
                .map((item: any, index: number) => (
                  <div key={index} className="rounded-lg overflow-hidden">
                    <img
                      className="w-full h-auto object-cover"
                      src={
                        show.adult
                          ? "/pixeled.webp"
                          : `https://image.tmdb.org/t/p/w300${item.file_path}`
                      }
                      alt={item.name}
                    />
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
