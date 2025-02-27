// app/users/SearchAndFilters.tsx
"use client";

import Link from "next/link";
import { useState } from "react";

const SearchAndFilters = ({ users }: { users: any[] }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<
    "watched" | "favorites" | "watchlist" | null
  >(null);

  // Filter users based on search and filter criteria
  const filteredUsers = users
    .filter((item) => item.username !== null) // Exclude null usernames
    .filter((item) =>
      item.username.toLowerCase().includes(searchQuery.toLowerCase())
    ) // Search by username
    .sort((a, b) => {
      if (filter === "watched") {
        return (
          (b.user_cout_stats?.watched_count || 0) -
          (a.user_cout_stats?.watched_count || 0)
        );
      } else if (filter === "favorites") {
        return (
          (b.user_cout_stats?.favorites_count || 0) -
          (a.user_cout_stats?.favorites_count || 0)
        );
      } else if (filter === "watchlist") {
        return (
          (b.user_cout_stats?.watchlist_count || 0) -
          (a.user_cout_stats?.watchlist_count || 0)
        );
      } else {
        return 0; // No sorting
      }
    });

  return (
    <>
      {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by username..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-3 rounded-lg bg-neutral-700 text-neutral-100 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-500"
        />
      </div>

      {/* Filters */}
      <div className="mb-6 flex gap-4 overflow-x-scroll no-scrollbar">
        <button
          onClick={() => setFilter("watched")}
          className={`px-4 py-2 rounded-lg transition-colors duration-300 ${
            filter === "watched"
              ? "bg-neutral-500 text-neutral-100"
              : "bg-neutral-700 text-neutral-300 hover:bg-neutral-600"
          }`}
        >
          Most Watched
        </button>
        <button
          onClick={() => setFilter("favorites")}
          className={`px-4 py-2 rounded-lg transition-colors duration-300 ${
            filter === "favorites"
              ? "bg-neutral-500 text-neutral-100"
              : "bg-neutral-700 text-neutral-300 hover:bg-neutral-600"
          }`}
        >
          Most Favorites
        </button>
        <button
          onClick={() => setFilter("watchlist")}
          className={`px-4 py-2 rounded-lg transition-colors duration-300 ${
            filter === "watchlist"
              ? "bg-neutral-500 text-neutral-100"
              : "bg-neutral-700 text-neutral-300 hover:bg-neutral-600"
          }`}
        >
          Most Watchlist
        </button>
        <button
          onClick={() => setFilter(null)}
          className={`px-4 py-2 rounded-lg transition-colors duration-300 ${
            filter === null
              ? "bg-neutral-500 text-neutral-100"
              : "bg-neutral-700 text-neutral-300 hover:bg-neutral-600"
          }`}
        >
          Clear Filters
        </button>
      </div>

      {/* User Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredUsers.map((item) => (
          <Link
            key={item.username}
            href={`/app/profile/${item.username}`}
            className="group bg-neutral-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-neutral-700 hover:border-neutral-500 overflow-hidden"
          >
            <div className="p-6">
              {/* Avatar */}
              <div className="flex items-center gap-4">
                <img
                  className="w-16 h-16 rounded-full object-cover border-2 border-neutral-700 group-hover:border-neutral-500 transition-colors duration-300"
                  src="/avatar.svg"
                  alt="User Avatar"
                />
                <div>
                  <h2 className="text-xl font-semibold text-neutral-100 group-hover:text-neutral-400 transition-colors duration-300">
                    @{item.username}
                  </h2>
                  <p className="text-sm text-neutral-400">{item.about}</p>
                </div>
              </div>

              {/* Stats */}
              <div className="mt-6 space-y-3">
                <div className="flex justify-between items-center p-3 bg-neutral-700 rounded-lg group-hover:bg-neutral-900 transition-colors duration-300">
                  <p className="text-sm text-neutral-200 group-hover:text-neutral-100">
                    Watched
                  </p>
                  <span className="text-sm font-semibold text-neutral-200 group-hover:text-neutral-100">
                    {item.user_cout_stats?.watched_count || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-neutral-700 rounded-lg group-hover:bg-neutral-900 transition-colors duration-300">
                  <p className="text-sm text-neutral-200 group-hover:text-neutral-100">
                    Favorites
                  </p>
                  <span className="text-sm font-semibold text-neutral-200 group-hover:text-neutral-100">
                    {item.user_cout_stats?.favorites_count || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-neutral-700 rounded-lg group-hover:bg-neutral-900 transition-colors duration-300">
                  <p className="text-sm text-neutral-200 group-hover:text-neutral-100">
                    Watchlist
                  </p>
                  <span className="text-sm font-semibold text-neutral-200 group-hover:text-neutral-100">
                    {item.user_cout_stats?.watchlist_count || 0}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
};

export default SearchAndFilters;
