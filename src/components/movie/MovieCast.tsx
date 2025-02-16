"use client";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";

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
  }, []);
  return (
    <div className="max-w-6xl w-full m-auto mb-5">
      <div className="mt-7">
        <h2 className="text-lg">Cast</h2>
        <div className="relative">
          <div
            ref={scrollRef}
            className="flex flex-row gap-3 m-3 overflow-x-scroll no-scrollbar"
          >
            {credits?.slice(0, 6).map((item: any) => (
              <Link
                title={item.name}
                key={item.id}
                href={`/app/person/${item.id}-${item.name
                  .trim()
                  .replace(/[^a-zA-Z0-9]/g, "-")
                  .replace(/-+/g, "-")}`}
                className="group min-w-fit rounded-md overflow-hidden  bg-indigo-600 lg:bg-inherit lg:hover:bg-indigo-600"
              >
                <img
                  className="w-24 md:w-44 rounded-md h-32 md:h-56 object-cover"
                  src={
                    item.profile_path
                      ? `https://image.tmdb.org/t/p/w185${item.profile_path}`
                      : "/avatar.svg"
                  }
                  alt={item.name}
                />
                <span>
                  {item.name.length > 15 ? (
                    <p className="hidden md:block break-words lg:opacity-0 group-hover:opacity-100 ml-2 mt-1">
                      {item.name.slice(0, 13)}..
                    </p>
                  ) : (
                    <p className="hidden md:block break-words lg:opacity-0 group-hover:opacity-100 ml-2 mt-1">
                      {item.name}
                    </p>
                  )}
                  {item.name.length > 12 ? (
                    <p className="text-xs md:hidden break-words lg:opacity-0 group-hover:opacity-100 ml-2 mt-1">
                      {item.name.slice(0, 10)}..
                    </p>
                  ) : (
                    <p className="text-xs md:hidden break-words lg:opacity-0 group-hover:opacity-100 ml-2 mt-1">
                      {item.name}
                    </p>
                  )}
                </span>
              </Link>
            ))}

            <div className="">
              <Link
                href={`/app/${type == "movie" ? "movie" : "tv"}/${id}/cast`}
                className="flex justify-center items-center w-24 md:w-44 h-32 md:h-56 border-2 border-neutral-500 hover:border-indigo-600 hover:bg-neutral-800 rounded-md"
              >
                more..
              </Link>
            </div>
          </div>
          {canScrollLeft && (
            <button
              onClick={scrollLeft}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-neutral-600 py-5 px-2 rounded-sm"
            >
              {"<"}
            </button>
          )}
          {canScrollRight && (
            <button
              onClick={scrollRight}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-neutral-600 py-5 px-2 rounded-sm"
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
