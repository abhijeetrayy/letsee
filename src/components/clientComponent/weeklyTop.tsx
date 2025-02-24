// components/weeklyTop.tsx
"use client";
import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import ThreePrefrenceBtn from "@components/buttons/threePrefrencebtn";
import SendMessageModal from "@components/message/sendCard";
import { LuSend } from "react-icons/lu";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { GenreList } from "@/staticData/genreList";

interface WeeklyTopProps {
  data: {
    results: Array<{
      id: number;
      media_type: string;
      name?: string;
      title?: string;
      poster_path: string;
      adult: boolean;
      genre_ids: number[];
    }>;
  };
}

export default function WeeklyTop({ data }: WeeklyTopProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cardData, setCardData] = useState<any>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const handleCardTransfer = (data: any) => {
    setCardData(data);
    setIsModalOpen(true);
  };

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
  }, [data]);

  return (
    <div className="w-full  sm:px-6 mb-5">
      <SendMessageModal
        media_type={cardData?.media_type}
        data={cardData}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <div className="relative">
        <div
          ref={scrollRef}
          className="flex flex-row gap-4 py-3 overflow-x-auto no-scrollbar"
        >
          {data?.results.map((item: any) => (
            <div
              key={item.id}
              className="card-item max-w-[10rem] sm:max-w-[15rem] md:max-w-[20rem] bg-neutral-700 rounded-md overflow-hidden flex-shrink-0 flex flex-col justify-between h-full group relative"
            >
              <div className="absolute top-0 left-0">
                <p className="px-1 py-1 bg-neutral-950 text-white rounded-br-md text-xs sm:text-sm">
                  {item.media_type}
                </p>
              </div>
              <Link
                className="w-full h-full"
                href={`/app/${item.media_type}/${item.id}-${(
                  item?.name || item?.title
                )
                  .trim()
                  .replace(/[^a-zA-Z0-9]/g, "-")
                  .replace(/-+/g, "-")}`}
              >
                <img
                  className="h-fit w-full object-cover"
                  src={`https://image.tmdb.org/t/p/w342${item.poster_path}`}
                  alt={item.name || item.title}
                />
              </Link>
              <div className="lg:absolute lg:bottom-0 w-full lg:opacity-0 lg:group-hover:opacity-100 bg-neutral-900 transition-opacity duration-300">
                <ThreePrefrenceBtn
                  genres={item.genre_ids
                    .map((id: number) => {
                      const genre = GenreList.genres.find(
                        (g: any) => g.id === id
                      );
                      return genre ? genre.name : null;
                    })
                    .filter(Boolean)}
                  cardId={item.id}
                  cardType={item.media_type}
                  cardName={item.name || item.title}
                  cardAdult={item.adult}
                  cardImg={item.poster_path}
                />
                <div className="py-2 border-t border-neutral-950 bg-neutral-800 hover:bg-neutral-700">
                  <button
                    className="w-full flex justify-center text-lg text-center text-neutral-100"
                    onClick={() => handleCardTransfer(item)}
                  >
                    <LuSend />
                  </button>
                </div>
                <div className="min-h-14 flex flex-col justify-center px-3 pb-1 w-full bg-indigo-700 text-gray-100 text-sm sm:text-base">
                  <p className="line-clamp-2">
                    {(item.name || item.title).length > 40
                      ? `${(item.name || item.title).slice(0, 40)}...`
                      : item.name || item.title}
                  </p>
                </div>
              </div>
            </div>
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
    </div>
  );
}
