"use client";

import ThreePrefrenceBtn from "@/components/buttons/threePrefrencebtn";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";

const genreList = [
  "Action",
  "Adventure",

  "Comedy",
  "Crime",
  "Documentary",
  "Drama",
  "Family",
  "Fantasy",
  "Romance",
  "Science Fiction",
  "TV Movie",
  "Thriller",
  "Action & Adventure",
  "Reality",
  "Sci-Fi & Fantasy",
  "Soap",
  "War",
  "War & Politics",
];

const WatchedMoviesList = ({ userId }: { userId: string }) => {
  const [movies, setMovies] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);
  const [genreFilter, setGenreFilter] = useState<string | null>(null);

  console.log("Rendering WatchedMoviesList with userId:", userId);

  const fetchMovies = useCallback(
    async (page: number, genre: string | null = null) => {
      if (loading) return; // Prevent multiple simultaneous fetches
      console.log("Fetching movies for page:", page, "with genre:", genre);
      setLoading(true);

      try {
        const response = await fetch(`/api/UserWatchedPagination`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userID: userId, page, genre }),
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
  );

  useEffect(() => {
    console.log("useEffect triggered for currentPage:", currentPage);
    fetchMovies(currentPage, genreFilter);
  }, [currentPage, genreFilter]); // Fetch movies when `currentPage` or `genreFilter` changes

  const memoizedMovies = useMemo(() => movies, [movies]);

  const handlePageChange = useCallback(() => {
    if (currentPage < totalPages && !loading) {
      console.log("Loading next page:", currentPage + 1);
      setCurrentPage((prev) => prev + 1);
    }
  }, [currentPage, totalPages, loading]);

  const handleGenreFilter = useCallback((genre: string) => {
    setGenreFilter(genre); // Set the genre filter
    setCurrentPage(1); // Reset to the first page
  }, []);

  const handleClearFilter = useCallback(() => {
    setGenreFilter(null); // Clear the genre filter
    setCurrentPage(1); // Reset to the first page
  }, []);

  return (
    <div>
      {/* Genre Filter Buttons */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          onClick={handleClearFilter}
          className={`px-4 py-2 rounded-md ${
            !genreFilter
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          All
        </button>
        <button
          onClick={() => handleGenreFilter("Animation")}
          className={`px-4 py-2 rounded-md ${
            genreFilter === "Animation"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Anime/Animation
        </button>
        {genreList.map((genre, index) => (
          <button
            key={index}
            onClick={() => handleGenreFilter(genre)}
            className={`px-4 py-2 rounded-md ${
              genreFilter === genre
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {genre}
          </button>
        ))}
      </div>

      {/* Movie Grid */}
      {loading && (
        <div className="w-full   p-10">
          <h1 className="m-auto w-fit">Loading..</h1>
        </div>
      )}
      {!loading && memoizedMovies.length === 0 ? (
        <div className="w-full   p-10">
          <h1 className="m-auto w-fit">no result found.</h1>
        </div>
      ) : (
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
                <img
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
                  genres={item.genres}
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
                    href={`/app/${item.item_type}/${
                      item.item_id
                    }-${item.item_name
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

          {/* Show "More..." button only if there are more items to load */}
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
      )}
    </div>
  );
};

export default WatchedMoviesList;
