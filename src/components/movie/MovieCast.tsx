"use client";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

function MovieCast({
  credits,
  id,
  type,
}: {
  credits: any[];
  id: string;
  type: string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const handleScroll = () => {
    const element = scrollRef.current;
    if (element) {
      const { scrollLeft, scrollWidth, clientWidth } = element;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10); // Small buffer for precision
    }
  };

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -240, behavior: "smooth" }); // Adjusted for new item width
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 240, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const element = scrollRef.current;
    if (element) {
      element.addEventListener("scroll", handleScroll);
      handleScroll(); // Initialize button states
      return () => element.removeEventListener("scroll", handleScroll);
    }
  }, [credits]);

  return (
    <div className="max-w-6xl w-full mx-auto mb-5">
      <div className="mt-7">
        <h2 className="text-lg text-white px-2 mb-4">Cast</h2>
        <div className="relative">
          <div
            ref={scrollRef}
            className="flex w-full flex-row gap-4  overflow-x-scroll no-scrollbar snap-x snap-mandatory"
          >
            {credits?.slice(0, 6).map((item: any, index: number) => (
              <Link
                title={item.name}
                key={index}
                href={`/app/person/${item.id}-${item.name
                  .trim()
                  .replace(/[^a-zA-Z0-9]/g, "-")
                  .replace(/-+/g, "-")}`}
                className="flex-shrink-0 w-24 md:w-36 snap-start flex flex-col items-center hover:opacity-80 transition-opacity duration-200"
              >
                {item.profile_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w185${item.profile_path}`}
                    alt={item.name}
                    className="rounded-md object-cover w-24 h-32 md:w-36 md:h-54"
                  />
                ) : (
                  <div className="w-full h-full bg-neutral-600 rounded-md flex items-center justify-center">
                    <span className="text-xs text-neutral-400">No Image</span>
                  </div>
                )}
                <p className="text-sm text-neutral-200 mt-2 text-center truncate w-full">
                  {item.name}
                </p>
                <p className="text-xs text-neutral-400 text-center truncate w-full">
                  {item.character}
                </p>
              </Link>
            ))}
            <div className="flex-shrink-0 w-24 md:w-36 snap-start flex flex-col items-center">
              <Link
                href={`/app/${type === "movie" ? "movie" : "tv"}/${id}/cast`}
                className="flex justify-center items-center w-full h-32 md:h-56 border-2 border-neutral-500 hover:border-indigo-600 hover:bg-neutral-800 rounded-md text-neutral-200 text-sm transition-colors duration-200"
              >
                More...
              </Link>
            </div>
          </div>
          {canScrollLeft && (
            <button
              onClick={scrollLeft}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-neutral-800 text-white p-2 rounded-full hover:bg-neutral-700 transition-colors duration-200 shadow-md"
            >
              <FaChevronLeft size={20} className="" />
            </button>
          )}
          {canScrollRight && (
            <button
              onClick={scrollRight}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-neutral-800 text-white p-2 rounded-full hover:bg-neutral-700 transition-colors duration-200 shadow-md"
            >
              <FaChevronRight size={20} className="" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default MovieCast;
