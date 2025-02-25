// components/Video.tsx
"use client";
import React, { useEffect, useRef, useState, useMemo } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

interface VideoItem {
  id: string;
  key: string;
  name: string;
  type: string;
}

interface VideoProps {
  videos: VideoItem[];
  movie: {
    title?: string;
    name?: string;
  };
}

function Video({ videos, movie }: VideoProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const [itemWidth, setItemWidth] = useState(200); // Default item width
  const [visibleItems, setVisibleItems] = useState(4); // Default number of visible items

  // Memoize filtered trailers
  const trailers = useMemo(
    () => videos.filter((item) => item.type === "Trailer"),
    [videos]
  );

  const handleScroll = () => {
    const element = scrollRef.current;
    if (element) {
      const { scrollLeft, scrollWidth, clientWidth } = element;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
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
    const calculateItemWidth = () => {
      const element = scrollRef.current;
      if (element) {
        const containerWidth = element.clientWidth;
        const baseItemWidth = 200; // Base width for each item
        const gap = 16; // Gap between items (adjust as needed)
        const peekWidth = containerWidth * 0.15; // 15% of container width for peek

        // Calculate the number of items that can fit in the container
        let itemsPerView = Math.floor(
          (containerWidth - peekWidth) / (baseItemWidth + gap)
        );

        // Ensure itemsPerView is always greater than 2
        if (itemsPerView < 1) {
          itemsPerView = 1; // Set a minimum of 2 items
        }

        // Adjust the item width to fit the calculated number of items
        const adjustedItemWidth =
          (containerWidth - peekWidth - gap * itemsPerView) / itemsPerView;

        setItemWidth(adjustedItemWidth);
        setVisibleItems(itemsPerView);
      }
    };
    calculateItemWidth();
    window.addEventListener("resize", calculateItemWidth);
    return () => window.removeEventListener("resize", calculateItemWidth);
  }, []);

  useEffect(() => {
    const element = scrollRef.current;
    if (element) {
      element.addEventListener("scroll", handleScroll);
      setTimeout(handleScroll, 100); // Initial check
      return () => element.removeEventListener("scroll", handleScroll);
    }
  }, [videos]);

  if (trailers.length === 0) return null;

  return (
    <>
      <div className="max-w-7xl w-full mx-auto mt-7 md:px-4">
        <h1 className="text-lg font-bold mb-4">
          {movie.title || movie.name}: Media
        </h1>
        <div className="relative overflow-hidden">
          <div
            ref={scrollRef}
            className="flex flex-row gap-4 py-2 overflow-x-auto no-scrollbar"
          >
            {trailers.slice(0, 4).map((item) => (
              <iframe
                style={{
                  width: `${itemWidth + 60} px`,
                  height: `${itemWidth}px`,
                }}
                key={item.id}
                className=" aspect-video rounded-lg flex-shrink-0 cursor-pointer"
                src={`https://www.youtube.com/embed/${item.key}`}
                title={item.name}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ))}
          </div>

          {/* Scroll Buttons */}
          {/* Left Fade Overlay */}
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
    </>
  );
}

export default Video;
