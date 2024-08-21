"use client";
import React, { useEffect, useRef, useState } from "react";

function Video({ videos, movie }: any) {
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
      scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
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
    <>
      <div className="max-w-6xl w-full m-auto">
        {videos.filter((item: any) => item.site === "YouTube").length > 0 && (
          <div className="mt-7">
            <h1 className="text-sm lg:text-lg my-2">
              {movie.title || movie.name}: Media
            </h1>
            <div className="relative">
              <div
                ref={scrollRef}
                className="flex flex-row m-3 overflow-x-scroll no-scrollbar"
              >
                {videos
                  .filter((item: any) => item.site === "YouTube")
                  ?.slice(0, 4)
                  .map((item: any) => (
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
              <div className="flex flex-row gap-4 w-fit m-auto">
                {canScrollLeft && (
                  <button
                    onClick={scrollLeft}
                    className=" bg-neutral-600  px-5  rounded-sm z-10"
                  >
                    {"<"}
                  </button>
                )}
                {canScrollRight && (
                  <button
                    onClick={scrollRight}
                    className=" bg-neutral-600  px-5  rounded-sm z-10"
                  >
                    {">"}
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Video;
