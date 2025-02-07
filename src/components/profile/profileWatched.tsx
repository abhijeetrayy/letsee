"use client";

import ThreePrefrenceBtn from "@/components/buttons/threePrefrencebtn";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState, useCallback } from "react";

const WatchedMoviesList = ({ userId }: { userId: string }) => {
  const [movies, setMovies] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);

  console.log("Rendering WatchedMoviesList with userId:", userId);

  const fetchMovies = useCallback(
    async (page: number) => {
      if (loading) return; // Prevent multiple simultaneous fetches
      console.log("Fetching movies for page:", page);
      setLoading(true);

      try {
        const response = await fetch(`/api/UserWatchedPagination`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userID: userId, page }),
        });

        if (!response.ok) throw new Error("Failed to fetch");

        const data = await response.json();
        console.log("Fetched data:", data);

        setMovies((prevMovies) =>
          page === 1 ? data.data : [...prevMovies, ...data.data]
        );
        setTotalItems(data.totalItems);
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error("Error fetching watched movies:", error);
      } finally {
        setLoading(false);
      }
    },
    [userId]
  ); // Removed `loading` dependency to prevent stale closures

  useEffect(() => {
    console.log("useEffect triggered for currentPage:", currentPage);
    fetchMovies(currentPage);
  }, [currentPage]); // Ensures fetch only triggers when `currentPage` changes

  const memoizedMovies = useMemo(() => movies, [movies]);

  const handlePageChange = useCallback(() => {
    if (currentPage < totalPages && !loading) {
      console.log("Loading next page:", currentPage + 1);
      setCurrentPage((prev) => prev + 1);
    }
  }, [currentPage, totalPages, loading]);

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3 z-40">
        {memoizedMovies.map((item: any) => (
          <div
            className="z-40 relative group flex flex-col justify-between bg-black text-gray-300 rounded-md overflow-hidden duration-300 lg:hover:scale-105"
            key={item.id}
          >
            <Link
              className="relative"
              href={`/app/${item.item_type}/${item.item_id}-${item.item_name
                .trim()
                .replace(/[^a-zA-Z0-9]/g, "-")
                .replace(/-+/g, "-")}}`}
            >
              <div className="absolute top-0 left-0 z-10 lg:opacity-0 lg:group-hover:opacity-100">
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
              <Image
                className="relative object-cover h-full w-full"
                src={
                  item.item_adult
                    ? "/pixeled.webp"
                    : `https://image.tmdb.org/t/p/w185/${item.image_url}`
                }
                loading="lazy"
                alt={item.item_name}
                width={185}
                height={278}
              />
            </Link>
            <div className="w-full h-[100px] bg-indigo-700 z-10 flex flex-col justify-between">
              <ThreePrefrenceBtn
                cardId={item.item_id}
                cardType={item.item_type}
                cardName={item.item_name}
                cardAdult={item.item_adult}
                cardImg={item.image_url}
              />
              <div
                title={item.name || item.title}
                className="w-full flex flex-col gap-2 px-4 text-gray-200 pb-2"
              >
                <Link
                  href={`/app/${item.item_type}/${item.item_id}-${item.item_name
                    .trim()
                    .replace(/[^a-zA-Z0-9]/g, "-")
                    .replace(/-+/g, "-")}}`}
                >
                  <span className="">
                    {item?.item_name &&
                      (item.item_name.length > 16
                        ? item.item_name?.slice(0, 14) + ".."
                        : item.item_name)}
                  </span>
                </Link>
              </div>
            </div>
          </div>
        ))}

        {memoizedMovies.length < totalItems && (
          <div>
            <button
              className="w-full h-full text-gray-300 border min-h-[330px] bg-neutral-700 rounded-md hover:bg-neutral-800"
              onClick={handlePageChange}
              disabled={loading}
            >
              {loading ? "Loading..." : "More..."}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WatchedMoviesList;
