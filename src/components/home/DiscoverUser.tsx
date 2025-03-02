"use client";
import { supabase } from "@/utils/supabase/client";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

interface User {
  username: string;
  about?: string;
  watched_count: number;
  favorites_count: number;
  watchlist_count: number;
}

function DiscoverUsers() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const getUser = async () => {
      const { data: Users, error } = await supabase
        .from("users")
        .select(
          `username,
          about,
          user_cout_stats (
            watched_count,
            favorites_count,
            watchlist_count
          )`
        )
        .not("username", "is", null) // Filter out null usernames
        .neq("username", "") // Filter out empty usernames
        .order("updated_at", { ascending: false })
        .limit(10);

      if (!error && Users) {
        setUsers(
          Users.map((user) => {
            const stats: any = user.user_cout_stats || {};
            return {
              username: user.username,
              about: user.about || "",
              watched_count: stats.watched_count || 0,
              favorites_count: stats.favorites_count || 0,
              watchlist_count: stats.watchlist_count || 0,
            };
          })
        );
      } else {
        console.error("Error fetching users:", error);
      }
      setLoading(false);
    };

    getUser();
  }, []);

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
      const itemWidth = element.querySelector(".user-card")?.clientWidth || 300;
      const shift = window.innerWidth < 640 ? itemWidth * 2 : itemWidth * 4;
      element.scrollBy({ left: -shift, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    const element = scrollRef.current;
    if (element) {
      const itemWidth = element.querySelector(".user-card")?.clientWidth || 300;
      const shift = window.innerWidth < 640 ? itemWidth * 2 : itemWidth * 4;
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
  }, [users, loading]);

  return (
    <div className="w-full mx-auto mb-5 md:px-4 ">
      <div className="mt-7">
        <Link
          href="/app/profile"
          className="text-lg font-semibold mb-2 underline text-neutral-100"
        >
          Discover People
        </Link>
        <div className="relative">
          <div
            ref={scrollRef}
            className="flex flex-row gap-4 py-3 overflow-x-auto no-scrollbar"
          >
            {loading
              ? [...Array(5)].map((_, index) => (
                  <div
                    key={index}
                    className="w-48 sm:w-56 md:w-72 h-64 bg-neutral-800 rounded-xl shadow-lg animate-pulse flex-shrink-0"
                  />
                ))
              : users.map((item) => (
                  <Link
                    key={item.username}
                    href={`/app/profile/${item.username}`}
                    className="user-card min-w-[12rem] sm:min-w-[14rem] md:min-w-[18rem] bg-neutral-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300  hover:bg-[#1d1d1d] overflow-hidden flex-shrink-0 flex flex-col h-full"
                  >
                    <div className="p-4 sm:p-6 flex flex-col h-full">
                      <div className="flex items-center gap-3 sm:gap-4">
                        <img
                          className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-neutral-700 group-hover:border-neutral-500 transition-colors duration-300"
                          src="/avatar.svg"
                          alt="User Avatar"
                        />
                        <div>
                          <h2 className="text-base sm:text-lg md:text-xl font-semibold text-neutral-100 group-hover:text-neutral-400 transition-colors duration-300">
                            @{item.username.slice(0, 10)}...
                          </h2>
                          <p className="text-xs sm:text-sm text-neutral-400 line-clamp-2">
                            {item.about}
                          </p>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="mt-4 sm:mt-6 space-y-2 sm:space-y-3 flex-grow">
                        <div className="flex justify-between items-center p-2 sm:p-3 bg-neutral-700 rounded-lg group-hover:bg-neutral-900 transition-colors duration-300">
                          <p className="text-xs sm:text-sm text-neutral-200 group-hover:text-neutral-100">
                            Watched
                          </p>
                          <span className="text-xs sm:text-sm font-semibold text-neutral-200 group-hover:text-neutral-100">
                            {item.watched_count}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-2 sm:p-3 bg-neutral-700 rounded-lg group-hover:bg-neutral-900 transition-colors duration-300">
                          <p className="text-xs sm:text-sm text-neutral-200 group-hover:text-neutral-100">
                            Favorites
                          </p>
                          <span className="text-xs sm:text-sm font-semibold text-neutral-200 group-hover:text-neutral-100">
                            {item.favorites_count}
                          </span>
                        </div>
                        <div className="flex justify-between items-center p-2 sm:p-3 bg-neutral-700 rounded-lg group-hover:bg-neutral-900 transition-colors duration-300">
                          <p className="text-xs sm:text-sm text-neutral-200 group-hover:text-neutral-100">
                            Watchlist
                          </p>
                          <span className="text-xs sm:text-sm font-semibold text-neutral-200 group-hover:text-neutral-100">
                            {item.watchlist_count}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
            {!loading && (
              <Link
                href="/app/profile"
                className="min-w-[12rem] sm:min-w-[14rem] md:min-w-[18rem] h-auto bg-neutral-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-neutral-700 hover:border-neutral-500 overflow-hidden flex items-center justify-center flex-shrink-0"
              >
                <div className="text-neutral-100 font-semibold text-sm sm:text-base">
                  More
                </div>
              </Link>
            )}
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
    </div>
  );
}

export default DiscoverUsers;
