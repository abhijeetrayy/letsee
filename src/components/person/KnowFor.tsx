"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import ThreePrefrenceBtn from "@/components/buttons/threePrefrencebtn";
import SendMessageModal from "@components/message/sendCard";
import { LuSend } from "react-icons/lu";
import { GenreList } from "@/staticData/genreList";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

interface CastData {
  id: string;
  adult: boolean;
  media_type: string;
  title?: string;
  name?: string;
  poster_path?: string;
  backdrop_path?: string;
  release_date?: string;
  first_air_date?: string;
  genre_ids?: any;
}

interface ScrollableCastListProps {
  castData: CastData[] | undefined;
}

const ScrollableCastList: React.FC<ScrollableCastListProps> = ({
  castData,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cardData, setCardData] = useState<any>(null);

  const handleScroll = () => {
    const element = scrollRef.current;
    if (element) {
      const { scrollLeft, scrollWidth, clientWidth } = element;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10); // Small buffer for precision
    }
  };

  const scrollLeft = () => {
    const element = scrollRef.current;
    if (element) {
      const itemWidth =
        element.querySelector(".image-item")?.clientWidth || 300;
      element.scrollBy({ left: -itemWidth * 2, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    const element = scrollRef.current;
    if (element) {
      const itemWidth =
        element.querySelector(".image-item")?.clientWidth || 300;
      element.scrollBy({ left: itemWidth * 2, behavior: "smooth" });
    }
  };
  useEffect(() => {
    handleScroll(); // Initialize scroll state

    const element = scrollRef.current;
    if (element) {
      element.addEventListener("scroll", handleScroll);
      // Check initial scroll state after content loads
      const timer = setTimeout(() => handleScroll(), 100); // Delay to ensure rendering
      return () => {
        element.removeEventListener("scroll", handleScroll);
        clearTimeout(timer);
      };
    }
  }, [castData]); // Re-run if castData changes

  const handleCardTransfer = (data: any) => {
    setCardData(data);
    setIsModalOpen(true);
  };

  return (
    <div className="relative w-full mb-12">
      <SendMessageModal
        media_type={cardData?.media_type}
        data={cardData}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <div className="relative">
        <div
          ref={scrollRef}
          className="w-full flex flex-row gap-5 overflow-x-scroll no-scrollbar snap-x snap-mandatory"
        >
          {castData
            ?.filter((data) => data && data.adult !== true)
            .slice(0, 17)
            .map((data) => {
              if (!data) return null;
              const {
                id,
                adult,
                media_type,
                title,
                name,
                poster_path,
                backdrop_path,
                release_date,
                first_air_date,
                genre_ids,
              } = data;

              const displayTitle = title ?? name ?? "";
              const displayImage = poster_path ?? backdrop_path;
              const year = new Date(
                release_date ?? first_air_date ?? ""
              ).getFullYear();

              return (
                <div
                  key={id}
                  className="relative min-w-[200px] sm:min-w-[250px] bg-black rounded-md overflow-hidden snap-start"
                >
                  <div className="relative group flex flex-col bg-black text-gray-300">
                    <div className="absolute top-0 left-0 z-10 lg:opacity-0 lg:group-hover:opacity-100">
                      <p
                        className={`p-1 text-white rounded-br-md text-sm ${
                          adult ? "bg-red-600" : "bg-black"
                        }`}
                      >
                        {adult ? "Adult" : media_type}
                      </p>
                    </div>
                    <div className="absolute top-0 right-0 z-10">
                      {year > 0 && (
                        <p className="p-1 bg-indigo-600 text-white rounded-tr-sm rounded-bl-md text-sm">
                          {year}
                        </p>
                      )}
                    </div>
                    <Link
                      href={`/app/${media_type}/${id}-${displayTitle
                        .trim()
                        .replace(/[^a-zA-Z0-9]/g, "-")
                        .replace(/-+/g, "-")}`}
                      className="h-[250px] md:h-[330px] w-full"
                    >
                      <Image
                        className="w-full h-full object-cover"
                        src={
                          displayImage
                            ? `https://image.tmdb.org/t/p/w342${displayImage}`
                            : adult
                            ? "/pixeled.webp"
                            : "/no-photo.webp"
                        }
                        alt={displayTitle}
                        width={342}
                        height={513}
                        loading="lazy"
                      />
                    </Link>
                    <div className="lg:absolute bottom-0 w-full bg-neutral-800 lg:opacity-0 lg:group-hover:opacity-100 z-10">
                      <ThreePrefrenceBtn
                        genres={genre_ids
                          .map((id: number) => {
                            const genre = GenreList.genres.find(
                              (g: any) => g.id === id
                            );
                            return genre ? genre.name : null;
                          })
                          .filter(Boolean)}
                        cardId={id}
                        cardType={media_type}
                        cardName={displayTitle}
                        cardAdult={adult}
                        cardImg={displayImage}
                      />
                      <div className="py-2 border-t border-neutral-950 hover:bg-neutral-700">
                        <button
                          className="w-full flex justify-center text-lg text-center text-gray-300 hover:text-white"
                          onClick={() => handleCardTransfer(data)}
                        >
                          <LuSend />
                        </button>
                      </div>
                      <div
                        title={displayTitle}
                        className="w-full flex flex-col gap-2 px-4 bg-indigo-700 text-gray-200"
                      >
                        <Link
                          href={`/app/${media_type}/${id}-${displayTitle
                            .trim()
                            .replace(/[^a-zA-Z0-9]/g, "-")
                            .replace(/-+/g, "-")}`}
                          className="mb-1 hover:underline"
                        >
                          <span>
                            {displayTitle.length > 20
                              ? `${displayTitle.slice(0, 20)}...`
                              : displayTitle}
                          </span>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
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
    </div>
  );
};

export default ScrollableCastList;
