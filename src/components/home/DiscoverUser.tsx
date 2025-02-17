"use client";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";

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
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient();

      const { data: Users, error } = await supabase
        .from("users")
        .select(
          `username,
          about,
          user_cout_stats (
            watched_count,
            favorites_count,
            watchlist_count
          )
        `
        )
        .order("updated_at", { ascending: false })
        .limit(10);

      console.log(Users);

      if (!error && Users) {
        setUsers(
          Users.map((user) => {
            const stats: any = user.user_cout_stats || {}; // Extract first object or empty object
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
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth);
    }
  };

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -200, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: 200, behavior: "smooth" });
  };

  useEffect(() => {
    const element = scrollRef.current;
    if (element) {
      element.addEventListener("scroll", handleScroll);
      setTimeout(handleScroll, 100);
      return () => element.removeEventListener("scroll", handleScroll);
    }
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto mb-5">
      <div className="mt-7">
        <Link
          href="/app/profile"
          className="text-lg font-semibold mb-2 underline"
        >
          Discover Users
        </Link>
        <div className="relative">
          <div
            ref={scrollRef}
            className="flex flex-row gap-4 px-4 py-3 overflow-x-auto no-scrollbar"
          >
            {loading
              ? [...Array(5)].map((_, index) => (
                  <div
                    key={index}
                    className="w-48 md:w-56 h-64 bg-neutral-800 rounded-xl shadow-lg animate-pulse flex-shrink-0"
                  />
                ))
              : users.map((item) => (
                  <Link
                    key={item.username}
                    href={`/app/profile/${item.username}`}
                    className="group min-w-72 bg-neutral-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-neutral-700 hover:border-neutral-500 overflow-hidden flex-shrink-0 flex flex-col h-full"
                  >
                    <div className="p-6 flex flex-col h-full">
                      <div className="flex items-center gap-4">
                        <img
                          className="w-16 h-16 rounded-full object-cover border-2 border-neutral-700 group-hover:border-neutral-500 transition-colors duration-300"
                          src="/avatar.svg"
                          alt="User Avatar"
                        />
                        <div>
                          <h2 className="text-xl font-semibold text-neutral-100 group-hover:text-neutral-400 transition-colors duration-300">
                            @{item.username.slice(0, 10)}..
                          </h2>
                          <p className="text-sm text-neutral-400">
                            {item.about}
                          </p>
                        </div>
                      </div>

                      {/* Stats */}
                      <div className="mt-6 space-y-3 flex-grow">
                        <div className="flex justify-between items-center p-3 bg-neutral-700 rounded-lg group-hover:bg-neutral-900 transition-colors duration-300">
                          <p className="text-sm text-neutral-200 group-hover:text-neutral-100">
                            Watched
                          </p>
                          <span className="text-sm font-semibold text-neutral-200 group-hover:text-neutral-100">
                            {item.watched_count}
                          </span>
                        </div>

                        <div className="flex justify-between items-center p-3 bg-neutral-700 rounded-lg group-hover:bg-neutral-900 transition-colors duration-300">
                          <p className="text-sm text-neutral-200 group-hover:text-neutral-100">
                            Favorites
                          </p>
                          <span className="text-sm font-semibold text-neutral-200 group-hover:text-neutral-100">
                            {item.favorites_count}
                          </span>
                        </div>

                        <div className="flex justify-between items-center p-3 bg-neutral-700 rounded-lg group-hover:bg-neutral-900 transition-colors duration-300">
                          <p className="text-sm text-neutral-200 group-hover:text-neutral-100">
                            Watchlist
                          </p>
                          <span className="text-sm font-semibold text-neutral-200 group-hover:text-neutral-100">
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
                className="min-w-72 h-auto bg-neutral-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-neutral-700 hover:border-neutral-500 overflow-hidden flex items-center justify-center flex-shrink-0 flex-col"
              >
                <div className="">more</div>
              </Link>
            )}
          </div>

          {canScrollLeft && (
            <button
              onClick={scrollLeft}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-neutral-600 py-3 px-2 rounded-full"
            >
              {"<"}
            </button>
          )}
          {canScrollRight && (
            <button
              onClick={scrollRight}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-neutral-600 py-3 px-2 rounded-full"
            >
              {">"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default DiscoverUsers;
