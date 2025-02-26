"use client";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";

function MovieCast({ credits, id, type }: any) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const handleScroll = () => {
    const element = scrollRef.current;
    if (element) {
      const { scrollLeft, scrollWidth, clientWidth } = element;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(
        scrollWidth > clientWidth && scrollLeft < scrollWidth - clientWidth
      );
    }
  };

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const element = scrollRef.current;
    if (element) {
      element.addEventListener("scroll", handleScroll);
      handleScroll(); // Initialize button states
      return () => element.removeEventListener("scroll", handleScroll);
    }
  }, [credits]); // Add credits to re-run effect if credits change

  return (
    <div className="max-w-6xl w-full m-auto mb-5">
      <div className="mt-7">
        <h2 className="text-lg text-white px-2">Cast</h2>
        <div className="relative">
          <div
            ref={scrollRef}
            className="flex w-full flex-row gap-3 m-3 overflow-x-scroll no-scrollbar"
          >
            {credits?.slice(0, 6).map((item: any, index: number) => (
              <Link
                title={item.name}
                key={index}
                href={`/app/person/${item.id}-${item.name
                  .trim()
                  .replace(/[^a-zA-Z0-9]/g, "-")
                  .replace(/-+/g, "-")}`}
                className="flex flex-col items-center w-44 md:w-44 hover:opacity-80 transition-opacity duration-200"
              >
                {item.profile_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w185${item.profile_path}`}
                    alt={item.name}
                    className="rounded-md object-cover w-44 h-32 md:w-44 md:h-56"
                  />
                ) : (
                  <div className="w-24 h-32 md:w-44 md:h-56 bg-neutral-600 rounded-md flex items-center justify-center">
                    <span className="text-xs text-neutral-400">No Image</span>
                  </div>
                )}
                <p className="text-sm text-neutral-200 mt-2 text-center ">
                  {item.name}
                </p>
                <p className="text-xs text-neutral-400 text-center ">
                  {item.character}
                </p>
              </Link>
            ))}

            <div className="flex flex-col items-center w-24 md:w-44">
              <Link
                href={`/app/${type === "movie" ? "movie" : "tv"}/${id}/cast`}
                className="flex justify-center items-center w-24 h-32 md:w-44 md:h-56 border-2 border-neutral-500 hover:border-indigo-600 hover:bg-neutral-800 rounded-md text-neutral-200 text-sm"
              >
                More...
              </Link>
            </div>
          </div>
          {canScrollLeft && (
            <button
              onClick={scrollLeft}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-neutral-600 py-5 px-2 rounded-sm text-white"
            >
              {"<"}
            </button>
          )}
          {canScrollRight && (
            <button
              onClick={scrollRight}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-neutral-600 py-5 px-2 rounded-sm text-white"
            >
              {">"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default MovieCast;
