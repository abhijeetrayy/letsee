"use client";
import React, { useEffect, useRef, useState } from "react";
import ThreePrefrenceBtn from "@components/buttons/threePrefrencebtn";
import { LiaImdb } from "react-icons/lia";
import Link from "next/link";
import MovieCast from "@components/movie/MovieCast";
import Video from "@components/movie/Video";
import SendMessageModal from "@components/message/sendCard";
import { LuSend } from "react-icons/lu";
import ImageViewer from "@components/clientComponent/ImaeViewer";
import ImdbRating from "@components/movie/imdbRating";
import Image from "next/image";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

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
  const [cardData, setCardData] = useState<any>([]);
  const [showFullOverview, setShowFullOverview] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [itemWidth, setItemWidth] = useState(200); // Default item width
  const [visibleItems, setVisibleItems] = useState(4); // Default number of visible items

  const handleScroll = () => {
    const element = scrollRef.current;
    if (element) {
      const { scrollLeft, scrollWidth, clientWidth } = element;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
    }
  };

  const scrollLeft = () => {
    const element = scrollRef.current;
    if (element) {
      const itemWidth = element.querySelector(".card-item")?.clientWidth || 300;
      element.scrollBy({ left: -itemWidth * 2, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    const element = scrollRef.current;
    if (element) {
      const itemWidth = element.querySelector(".card-item")?.clientWidth || 300;
      element.scrollBy({ left: itemWidth * 2, behavior: "smooth" });
    }
  };
  useEffect(() => {
    const calculateItemWidth = () => {
      const element = scrollRef.current;
      if (element) {
        const containerWidth = element.clientWidth;
        const baseItemWidth = 200; // Base width for each item
        const gap = 16; // Gap between items (adjust as needed)
        const peekWidth = containerWidth * 0.15; // 15% of container width for peek

        // Calculate the number of items that can fit in the container
        let itemsPerView = Math.floor(
          (containerWidth - peekWidth) / (baseItemWidth + gap)
        );

        // Ensure itemsPerView is always greater than 2
        if (itemsPerView < 2) {
          itemsPerView = 2; // Set a minimum of 2 items
        }

        // Adjust the item width to fit the calculated number of items
        const adjustedItemWidth =
          (containerWidth - peekWidth - gap * itemsPerView) / itemsPerView;

        setItemWidth(adjustedItemWidth);
        setVisibleItems(itemsPerView);
      }
    };
    calculateItemWidth();
    window.addEventListener("resize", calculateItemWidth);
    return () => window.removeEventListener("resize", calculateItemWidth);
  }, []);

  useEffect(() => {
    const element = scrollRef.current;
    if (element) {
      element.addEventListener("scroll", handleScroll);
      setTimeout(handleScroll, 100); // Initial check
      return () => element.removeEventListener("scroll", handleScroll);
    }
  }, [show]);

  const handleCardTransfer = (data: any) => {
    setCardData(data);
    setIsModalOpen(true);
  };

  const toggleOverview = () => {
    setShowFullOverview(!showFullOverview);
  };

  // Filter out "Specials" and get seasons
  const seasons = show.seasons.filter((item: any) => item.name !== "Specials");
  const firstSeason = seasons[0];
  const otherSeasons = seasons.slice(1);

  return (
    <div>
      <SendMessageModal
        media_type={"tv"}
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
                  "linear-gradient(to left, #171717, transparent 60%, #171717, #171717)",
              }}
            ></div>
            <div
              className="absolute inset-0 z-10 bg-gradient-to-l from-neutral-900 via-transparent to-neutral-900"
              style={{
                background:
                  "linear-gradient(to right, #171717, transparent 60%, #171717, #171717)",
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
          <div className="max-w-[1520px] w-full relative z-10 flex flex-col md:flex-row gap-8 my-4 px-4">
            {/* Poster */}
            <div className="flex-1">
              <img
                className="rounded-md w-fit h-full max-h-[600px] shadow-lg md:float-right"
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
              <div className="w-full bg-neutral-800 overflow-hidden my-4">
                <ThreePrefrenceBtn
                  genres={show.genres.map((genre: any) => genre.name)}
                  cardId={show.id}
                  cardType={"tv"}
                  cardName={show.name || show.title}
                  cardAdult={show.adult}
                  cardImg={show.poster_path || show.backdrop_path}
                />
                <div className="py-2 border-t border-neutral-700 bg-neutral-700 hover:bg-neutral-600 transition-colors rounded-b-md">
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
                    <ImdbRating id={ExternalIDs.imdb_id} />
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
        {seasons.length > 0 && (
          <div className="max-w-7xl w-full mx-auto my-8 px-4 ">
            <h2 className="text-2xl font-bold mb-4">Seasons</h2>
            {/* First Season */}
            {firstSeason && (
              <div className="mb-8 bg-neutral-800 rounded-lg p-4">
                <Link
                  href={`/app/tv/${id}/season/${firstSeason.season_number}`}
                  className="flex flex-col sm:flex-row gap-4 hover:opacity-75 transition-opacity duration-200"
                >
                  <img
                    src={
                      firstSeason.poster_path && !show.adult
                        ? `https://image.tmdb.org/t/p/w342${firstSeason.poster_path}`
                        : "/no-photo.webp"
                    }
                    alt={firstSeason.name}
                    className="rounded-md object-cover w-full max-w-72"
                  />
                  <div className="flex-1">
                    <h3 className="text-xl sm:text-2xl font-semibold text-neutral-100">
                      {firstSeason.name}
                    </h3>
                    <p className="text-sm text-neutral-400 mt-1">
                      {firstSeason.air_date || "TBA"} • Episodes:{" "}
                      {firstSeason.episode_count}
                    </p>
                    <p className="text-sm text-neutral-300 mt-2 line-clamp-3">
                      {firstSeason.overview || "No overview available."}
                    </p>
                  </div>
                </Link>
              </div>
            )}

            {/* Other Seasons */}
            {otherSeasons.length > 0 && (
              <div className="relative">
                <div
                  ref={scrollRef}
                  className=" flex flex-row gap-4 overflow-x-auto no-scrollbar"
                >
                  {otherSeasons.map((season: any) => (
                    <Link
                      href={`/app/tv/${id}/season/${season.season_number}`}
                      key={season.id}
                      className=" flex flex-col gap-2 hover:opacity-75 transition-opacity duration-200"
                    >
                      <img
                        src={
                          season.poster_path && !show.adult
                            ? `https://image.tmdb.org/t/p/w185${season.poster_path}`
                            : "/no-photo.webp"
                        }
                        alt={season.name}
                        className={`min-w-44 max-w-44 h-full object-cover rounded-md ${itemWidth}`}
                      />
                      <div>
                        <h4 className="text-sm md:text-base font-bold">
                          {season.name}
                        </h4>
                        <p className="text-sm text-neutral-400">
                          {season.air_date || "TBA"}
                        </p>
                        <p className="text-sm text-neutral-400">
                          Episodes: {season.episode_count}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
                {/* Left Fade Overlay */}
                <div
                  className={`hidden md:block absolute top-0 left-0 h-full w-12 sm:w-20 bg-gradient-to-r from-black to-transparent pointer-events-none transition-opacity duration-300 ${
                    canScrollLeft ? "opacity-80" : "opacity-0"
                  }`}
                />

                {/* Right Fade Overlay */}
                <div
                  className={`hidden md:block absolute top-0 right-0 h-full w-12 sm:w-20 bg-gradient-to-l from-black to-transparent pointer-events-none transition-opacity duration-300 ${
                    canScrollRight ? "opacity-80" : "opacity-0"
                  }`}
                />

                {/* Scroll Buttons */}
                {canScrollLeft && (
                  <button
                    onClick={scrollLeft}
                    className="hidden md:block absolute left-2 top-1/2 transform -translate-y-1/2 bg-neutral-800 text-neutral-100 p-2 sm:p-3 rounded-full hover:bg-neutral-700 transition-colors duration-200 z-10 shadow-md"
                  >
                    <FaChevronLeft size={20} className="" />
                  </button>
                )}
                {canScrollRight && (
                  <button
                    onClick={scrollRight}
                    className="hidden md:block absolute right-2 top-1/2 transform -translate-y-1/2 bg-neutral-800 text-neutral-100 p-2 sm:p-3 rounded-full hover:bg-neutral-700 transition-colors duration-200 z-10 shadow-md"
                  >
                    <FaChevronRight size={20} className="" />
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Videos */}
        <Video videos={videos} movie={show} />

        {/* Images */}
        <ImageViewer movie={show} Bimages={Bimages} Pimages={Pimages} />
      </div>
    </div>
  );
}
