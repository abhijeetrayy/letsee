"use client";

import userPrefrenceContext from "@/app/contextAPI/userPrefrence";
import ThreePrefrenceBtn from "@/components/buttons/threePrefrencebtn";
import Link from "next/link";
import { useContext, useEffect, useMemo, useState } from "react";

const WatchedMoviesList = ({ userId }: any): any => {
  const [movies, setMovies] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);

  const { userPrefrence }: any = useContext(userPrefrenceContext);
  console.log(userPrefrence);

  const userID = userId;

  useEffect(() => {
    fetchMovies(currentPage);
  }, [currentPage]);

  const fetchMovies = async (page: number) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/UserWatchedPagination`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userID, page }),
      });
      const data = await response.json();

      setMovies((previous) => [...previous, ...data.data]);

      setTotalItems(data.totalItems);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error("Error fetching watched movies:", error);
    }
    setLoading(false);
  };

  const memoizedMovies = useMemo(() => movies, [movies]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3 z-40">
        {memoizedMovies?.map((item: any) => (
          <div
            className="z-40 relative group flex flex-col justify-between  bg-black  text-gray-300 rounded-md overflow-hidden duration-300 lg:hover:scale-105"
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
                    ? "/pixeled.jpg"
                    : `https://image.tmdb.org/t/p/w185/${item.image_url}`
                }
                loading="lazy"
                alt={item.item_name}
              />
            </Link>
            <div className="w-full h-[100px] bg-indigo-700 z-10  flex flex-col justify-between">
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

        <div>
          {memoizedMovies.length < totalItems && (
            <div>
              <button
                className="w-full h-full text-gray-300 border min-h-[330px] bg-neutral-700 rounded-md hover:bg-neutral-800"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={loading}
              >
                {loading ? "Loading.." : "More.."}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WatchedMoviesList;
