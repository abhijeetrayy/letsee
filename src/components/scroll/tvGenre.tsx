"use client";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
function tvGenre({ tvGenres }: any) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const handleScroll = () => {
    const element = scrollRef.current;
    if (element) {
      const { scrollLeft, scrollWidth, clientWidth } = element;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10); // Buffer
    }
  };

  const scrollLeft = () => {
    const element = scrollRef.current;
    if (element) {
      const itemWidth = element.querySelector(".card-item")?.clientWidth || 200; // Default 200px
      const shift = window.innerWidth < 640 ? itemWidth * 2 : itemWidth * 3; // 2 on mobile, 5 on desktop
      element.scrollBy({ left: -shift, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    const element = scrollRef.current;
    if (element) {
      const itemWidth = element.querySelector(".card-item")?.clientWidth || 200;
      const shift = window.innerWidth < 640 ? itemWidth * 2 : itemWidth * 3;
      element.scrollBy({ left: shift, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const element = scrollRef.current;
    if (element) {
      element.addEventListener("scroll", handleScroll);
      setTimeout(handleScroll, 100); // Initial check
      return () => element.removeEventListener("scroll", handleScroll);
    }
  }, [tvGenres]);
  return (
    <div className="relative">
      <div
        ref={scrollRef}
        className="relative flex flex-row overflow-x-auto no-scrollbar gap-2 py-3 z-10"
      >
        {tvGenres.map((genreItem: any) => (
          <Link
            href={`/app/tvbygenre/list/${genreItem.id}-${genreItem.name}`}
            className="card-item h-24 min-w-32 sm:min-w-40 md:min-w-48 rounded-md overflow-hidden flex-shrink-0 flex items-center justify-center bg-neutral-800 bg-opacity-80 hover:bg-opacity-100"
            key={genreItem.id}
          >
            <span className="text-white text-sm sm:text-base md:text-lg font-semibold drop-shadow-md">
              {genreItem.name}
            </span>
          </Link>
        ))}
      </div>
      {/* Left Fade Overlay */}
      <div
        className={`hidden md:block absolute top-0 left-0 h-full w-12 sm:w-16 bg-gradient-to-r from-black to-transparent pointer-events-none transition-opacity duration-300 ${
          canScrollLeft ? "opacity-80" : "opacity-0"
        }`}
      />

      {/* Right Fade Overlay */}
      <div
        className={`hidden md:block absolute top-0 right-0 h-full w-12 sm:w-16 bg-gradient-to-l from-black to-transparent pointer-events-none transition-opacity duration-300 ${
          canScrollRight ? "opacity-80" : "opacity-0"
        }`}
      />

      {/* Scroll Buttons */}
      {canScrollLeft && (
        <button
          onClick={scrollLeft}
          className="hidden md:block absolute left-2 top-1/2 transform -translate-y-1/2 bg-neutral-800 text-neutral-100 p-2 sm:p-3 rounded-full hover:bg-neutral-700 transition-colors duration-200 z-10 shadow-md"
        >
          <FaChevronLeft size={16} className="" />
        </button>
      )}
      {canScrollRight && (
        <button
          onClick={scrollRight}
          className="hidden md:block absolute right-2 top-1/2 transform -translate-y-1/2 bg-neutral-800 text-neutral-100 p-2 sm:p-3 rounded-full hover:bg-neutral-700 transition-colors duration-200 z-10 shadow-md"
        >
          <FaChevronRight size={16} className="" />
        </button>
      )}
    </div>
  );
}

export default tvGenre;
