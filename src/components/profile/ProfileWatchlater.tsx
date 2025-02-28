"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link"; // Assuming you are using Next.js
import ThreePrefrenceBtn from "../buttons/threePrefrencebtn";
import { IoIosArrowForward } from "react-icons/io";
import { IoIosArrowBack } from "react-icons/io";

function WatchLaterList({ watchlist, watchlistCount }: any) {
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
    <div className="my-10">
      <div className="my-3">
        <h1 className="text-2xl font-bold mb-4">
          WatchLater &quot;{watchlistCount}&quot;
        </h1>
      </div>
      <div className="relative w-full">
        <div
          ref={scrollRef}
          className="w-full flex flex-row overflow-x-scroll thin-scroll gap-3  pb-3"
        >
          {watchlist?.map((item: any) => (
            <div key={item.id}>
              <div className="relative group flex flex-col rounded-md bg-black w-full text-gray-300 overflow-hidden">
                <div className="absolute top-0 left-0  lg:opacity-0 lg:group-hover:opacity-100">
                  {item.item_adult ? (
                    <p className="p-1 bg-red-600 text-white rounded-br-md text-sm">
                      Adult
                    </p>
                  ) : (
                    <p className="p-1 bg-black text-white rounded-br-md text-sm">
                      {item.item_type}
                    </p>
                  )}
                </div>
                <Link
                  className="h-32 md:h-[270px] w-28 md:w-[200px]"
                  href={`/app/${item.item_type}/${item.item_id}`}
                >
                  <img
                    className="h-full w-full object-cover"
                    src={
                      item.item_adult
                        ? "/pixeled.webp"
                        : `https://image.tmdb.org/t/p/w185/${item.image_url}`
                    }
                    loading="lazy"
                    alt={item.item_name}
                  />
                </Link>
                <div className="w-full  bg-neutral-800 text-xs md:text-base">
                  {/* Assuming ThreePrefrenceBtn is a valid component */}
                  <ThreePrefrenceBtn
                    genres={item.genres}
                    cardId={item.item_id}
                    cardType={item.item_type}
                    cardName={item.item_name}
                    cardAdult={item.item_adult}
                    cardImg={item.image_url}
                  />
                  <div
                    title={item.name || item.title}
                    className="w-full full flex flex-col gap-2 px-4 bg-indigo-700 text-gray-200"
                  >
                    <Link
                      href={`/app/${item.item_type}/${item.item_id}`}
                      className="mb-1"
                    >
                      <span className="">
                        {item?.item_name &&
                          (item.item_name.length > 16
                            ? item.item_name.slice(0, 14) + ".."
                            : item.item_name)}
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {canScrollLeft && (
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-neutral-600 p-2 py-5 rounded-sm "
            style={{
              boxShadow: "0 4px 15px rgba(0, 0, 0, 0.9)", // Outer shadow
            }}
          >
            <IoIosArrowBack />
          </button>
        )}
        {canScrollRight && (
          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-neutral-600 p-2 py-5 rounded-sm "
            style={{
              boxShadow: "0 4px 15px rgba(0, 0, 0, .9)", // Outer shadow
            }}
          >
            <IoIosArrowForward />
          </button>
        )}
      </div>
    </div>
  );
}

export default WatchLaterList;
