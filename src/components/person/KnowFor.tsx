"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import ThreePrefrenceBtn from "@/components/buttons/threePrefrencebtn";
import SendMessageModal from "@components/message/sendCard";
import { LuSend } from "react-icons/lu";

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
}

interface ScrollableCastListProps {
  castData: CastData[] | undefined; // castData can be undefined
}

const ScrollableCastList: React.FC<ScrollableCastListProps> = ({
  castData,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cardData, setCardData] = useState([]) as any;

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
    scrollRef.current?.scrollBy({ left: -250, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 250, behavior: "smooth" });
  };

  useEffect(() => {
    handleScroll(); // Check scrollability on initial render

    const element = scrollRef.current;
    if (element) {
      element.addEventListener("scroll", handleScroll);
      return () => element.removeEventListener("scroll", handleScroll);
    }
  }, []);

  const handleCardTransfer = (data: any) => {
    setCardData(data);
    setIsModalOpen(true);
  };

  return (
    <div className="relative w-full mb-12">
      <SendMessageModal
        data={cardData}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <div
        ref={scrollRef}
        className="w-full flex flex-row gap-5 overflow-x-scroll no-scrollbar"
      >
        {castData
          ?.filter((data) => data.adult !== true)
          .slice(0, 17)
          .map((data) => {
            if (!data) return null; // Ensure data is not undefined
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
            } = data;

            const displayTitle = title ?? name ?? ""; // Ensure title or name exists
            const displayImage = poster_path ?? backdrop_path;
            const year = new Date(
              release_date ?? first_air_date ?? ""
            ).getFullYear(); // Handle undefined date

            return (
              <div
                key={id}
                className="relative min-w-fit bg-black rounded-md overflow-hidden"
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
                    {year > 0 && ( // Ensure year is valid
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
                    className="h-[250px] md:h-[330px] max-w-56 w-full"
                  >
                    <img
                      className="w-full h-full object-cover"
                      src={
                        displayImage
                          ? `https://image.tmdb.org/t/p/w342${displayImage}`
                          : adult
                          ? "/pixeled.webp"
                          : "/no-photo.webp"
                      }
                      loading="lazy"
                      alt={displayTitle}
                    />
                  </Link>
                  <div className="lg:absolute bottom-0 w-full bg-neutral-800 lg:opacity-0 lg:group-hover:opacity-100 z-10">
                    <ThreePrefrenceBtn
                      cardId={id}
                      cardType={media_type}
                      cardName={displayTitle}
                      cardAdult={adult}
                      cardImg={displayImage}
                    />
                    <div className="py-2 border-t border-neutral-950 hover:bg-neutral-700">
                      <button
                        className="w-full  flex justify-center text-lg text-center "
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
                        className="mb-1"
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
      {canScrollLeft && (
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-neutral-600 p-2 py-5 rounded-sm z-10 shadow-lg"
        >
          {"<"}
        </button>
      )}
      {canScrollRight && (
        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-neutral-600 p-2 py-5 rounded-sm z-10 shadow-lg"
        >
          {">"}
        </button>
      )}
    </div>
  );
};

export default ScrollableCastList;
