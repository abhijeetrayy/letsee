"use client";
import React, { useEffect, useRef, useState, useMemo } from "react";

function Video({ videos, movie }: any) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Memoize filtered trailers
  const trailers = useMemo(
    () =>
      videos.filter(
        (item: any) => item.site === "YouTube" && item.type === "Trailer"
      ),
    [videos]
  );

  useEffect(() => {
    const element = scrollRef.current;
    if (!element) return;

    const handleScroll = () => {
      setCanScrollLeft(element.scrollLeft > 0);
      setCanScrollRight(
        element.scrollWidth > element.clientWidth &&
          element.scrollLeft < element.scrollWidth - element.clientWidth
      );
    };

    element.addEventListener("scroll", handleScroll);
    handleScroll(); // Initialize button states

    return () => element.removeEventListener("scroll", handleScroll);
  }, []);

  const scroll = (direction: "left" | "right") => {
    scrollRef.current?.scrollBy({
      left: direction === "left" ? -300 : 300,
      behavior: "smooth",
    });
  };

  if (trailers.length === 0) return null;

  return (
    <div className="max-w-6xl w-full mx-auto mt-7">
      <h1 className="text-sm lg:text-lg my-2">
        {movie.title || movie.name}: Media
      </h1>
      <div className="relative overflow-hidden">
        <div
          ref={scrollRef}
          className="flex flex-row m-3 overflow-x-scroll no-scrollbar"
        >
          {trailers.slice(0, 4).map((item: any) => (
            <iframe
              key={item.id}
              className="w-72 h-44 sm:w-80 sm:h-48 lg:w-96 lg:h-56 aspect-video"
              src={`https://www.youtube.com/embed/${item.key}`}
              title={item.name}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ))}
        </div>

        {/* Scroll Buttons */}
        <div className="flex flex-row gap-4 w-fit mx-auto">
          {canScrollLeft && (
            <button
              onClick={() => scroll("left")}
              className="bg-neutral-600 px-5 rounded-sm z-10"
            >
              {"<"}
            </button>
          )}
          {canScrollRight && (
            <button
              onClick={() => scroll("right")}
              className="bg-neutral-600 px-5 rounded-sm z-10"
            >
              {">"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Video;
