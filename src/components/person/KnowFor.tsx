"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import ThreePrefrenceBtn from "@/components/buttons/threePrefrencebtn";

function ScrollableCastList({ castData }: any) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const handleScroll = () => {
    const element = scrollRef.current;
    if (element) {
      const { scrollLeft, scrollWidth, clientWidth } = element;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth);
    }
  };

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -250, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 250, behavior: "smooth" });
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
    <div className="relative w-full mb-12">
      <div
        ref={scrollRef}
        className="w-full flex flex-row gap-5 overflow-x-scroll no-scrollbar"
      >
        {castData?.slice(0, 17).map((data: any) => (
          <div
            className="relative min-w-fit bg-black rounded-md overflow-hidden"
            key={data.id}
          >
            <div className="relative group flex flex-col bg-black text-gray-300">
              <div className="absolute top-0 left-0 z-10 lg:opacity-0 lg:group-hover:opacity-100">
                {data.adult ? (
                  <p className="p-1 bg-red-600 text-white rounded-br-md text-sm">
                    Adult
                  </p>
                ) : (
                  <p className="p-1 bg-black text-white rounded-br-md text-sm">
                    {data.media_type}
                  </p>
                )}
              </div>
              <div className="absolute top-0 right-0 z-10">
                {(data.release_date || data.first_air_date) && (
                  <p className="p-1 bg-indigo-600 text-white rounded-tr-sm rounded-bl-md text-sm">
                    {new Date(data.release_date).getFullYear() ||
                      new Date(data.first_air_date).getFullYear()}
                  </p>
                )}
              </div>
              <Link
                className=" h-[250px] md:h-[330px] max-w-56 w-full"
                href={`/app/${data.media_type}/${data.id}-${(
                  data.name || data.title
                )
                  .trim()
                  .replace(/[^a-zA-Z0-9]/g, "-")
                  .replace(/-+/g, "-")}`}
              >
                <img
                  className="w-full h-full object-cover"
                  src={
                    (data.poster_path || data.backdrop_path) && !data.adult
                      ? `https://image.tmdb.org/t/p/w342${
                          data.poster_path || data.backdrop_path
                        }`
                      : data.adult
                      ? "/pixeled.jpg"
                      : "/no-photo.jpg"
                  }
                  loading="lazy"
                  alt={data.title}
                />
              </Link>
              <div className="lg:absolute bottom-0 w-full bg-neutral-900 lg:opacity-0 lg:group-hover:opacity-100 z-10">
                <ThreePrefrenceBtn
                  cardId={data.id}
                  cardType={data.media_type}
                  cardName={data.name || data.title}
                  cardAdult={data.adult}
                  cardImg={data.poster_path || data.backdrop_path}
                />
                <div
                  title={data.name || data.title}
                  className="w-full flex flex-col gap-2 px-4 bg-indigo-700 text-gray-200"
                >
                  <Link
                    href={`/app/${data.media_type}/${data.id}-${(
                      data.name || data.title
                    )
                      .trim()
                      .replace(/[^a-zA-Z0-9]/g, "-")
                      .replace(/-+/g, "-")}`}
                    className="mb-1"
                  >
                    <span className="">
                      {data?.title
                        ? data.title.length > 20
                          ? data.title?.slice(0, 20) + "..."
                          : data.title
                        : data.name.length > 20
                        ? data.name?.slice(0, 20) + "..."
                        : data.name}
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
          className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-neutral-600 p-2 py-5 rounded-sm z-10"
          style={{
            boxShadow: "0 4px 15px rgba(0, 0, 0, 0.9)", // Outer shadow
          }}
        >
          {"<"}
        </button>
      )}
      {canScrollRight && (
        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-neutral-600 p-2 py-5 rounded-sm z-10"
          style={{
            boxShadow: "0 4px 15px rgba(0, 0, 0, .9)", // Outer shadow
          }}
        >
          {">"}
        </button>
      )}
    </div>
  );
}

export default ScrollableCastList;
