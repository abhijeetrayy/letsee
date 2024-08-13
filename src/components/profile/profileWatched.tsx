"use client";

import Link from "next/link";
import React, { useState, useEffect, useContext } from "react";
import CardMovieButton from "../buttons/cardButtons";
import { IoEyeOutline, IoEyeSharp } from "react-icons/io5";
import { FcAlarmClock, FcLike } from "react-icons/fc";
import { CiHeart, CiSaveDown1 } from "react-icons/ci";
import userPrefrenceContext from "@/app/contextAPI/userPrefrence";
import { FaRegEyeSlash } from "react-icons/fa";
import { RiEyeCloseLine } from "react-icons/ri";
import { GiBleedingEye } from "react-icons/gi";
import { PiEyeBold } from "react-icons/pi";
import ThreePrefrenceBtn from "@/components/buttons/threePrefrencebtn";
// Assuming you're using Supabase Auth
interface UserPreference {
  item_id: number;
}

const WatchedMoviesList = ({ userId }: any): any => {
  const [movies, setMovies] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const { userPrefrence }: any = useContext(userPrefrenceContext);
  console.log(userPrefrence);

  const [loading, setLoading] = useState(false);
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

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  // const renderPageOptions = () => {
  //   const options = [];
  //   for (let i = 1; i <= totalPages; i++) {
  //     options.push(
  //       <option key={i} value={i}>
  //         Page {i}
  //       </option>
  //     );
  //   }
  //   return options;
  // };

  const isItemPreferred = (itemId: number): boolean => {
    if (Array.isArray(userPrefrence.userFavorites)) {
      return userPrefrence.userFavorites.some(
        (pref: any) => pref.item_id === itemId
      );
    } else if (
      typeof userPrefrence.userFavorites === "object" &&
      userPrefrence.userFavorites !== null
    ) {
      // If userPrefrence.userPrefrence is an object, check if it has the item_id as a key
      return Object.keys(userPrefrence.userFavorites).includes(
        itemId.toString()
      );
    } else {
      console.error(
        "Unexpected userPrefrence.userPrefrence type:",
        typeof userPrefrence.userFavorites
      );
      return false;
    }
  };
  const isItemWatched = (itemId: number): boolean => {
    if (Array.isArray(userPrefrence.userWatched)) {
      return userPrefrence.userWatched.some(
        (pref: any) => pref.item_id === itemId
      );
    } else if (
      typeof userPrefrence.userWatched === "object" &&
      userPrefrence.userWatched !== null
    ) {
      // If userPrefrence.userPrefrence is an object, check if it has the item_id as a key
      return Object.keys(userPrefrence.userWatched).includes(itemId.toString());
    } else {
      console.error(
        "Unexpected userPrefrence.userPrefrence type:",
        typeof userPrefrence.userWatched
      );
      return false;
    }
  };

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-3">
        {movies?.map((item: any) => (
          <div className="" key={item.id}>
            <div className=" relative group flex flex-col rounded-md bg-black mr-2.5 w-full  text-gray-300 overflow-hidden duration-300  hover:scale-105 ">
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
              {/* <div className="absolute top-0 right-0 z-10">
                  {(item.release_date || item.first_air_date) && (
                    <p className="p-1 bg-indigo-600 text-white rounded-tr-sm rounded-bl-md text-sm">
                      {new Date(item.release_date).getFullYear() ||
                        new Date(item.first_air_date).getFullYear()}
                    </p>
                  )}
                </div> */}
              <Link
                className="h-[270px]"
                href={`/app/${item.item_type}/${item.item_id}-${item.item_name
                  .trim()
                  .replace(/[^a-zA-Z0-9]/g, "-")
                  .replace(/-+/g, "-")}}`}
              >
                <img
                  className="relative object-cover h-full w-full  "
                  src={
                    item.item_adult
                      ? "/pixeled.jpg"
                      : `https://image.tmdb.org/t/p/w185/${item.image_url}`
                  }
                  loading="lazy"
                  alt={item.item_name}
                />
              </Link>
              <div className=" w-full bg-neutral-900 z-10">
                <ThreePrefrenceBtn
                  cardId={item.item_id}
                  cardType={item.item_type}
                  cardName={item.item_name}
                  cardAdult={item.item_adult}
                  cardImg={item.item_img}
                />
                <div
                  title={item.name || item.title}
                  className="w-full flex flex-col gap-2  px-4  bg-indigo-700  text-gray-200 "
                >
                  <Link
                    href={`/app/${item.item_type}/${
                      item.item_id
                    }-${item.item_name
                      .trim()
                      .replace(/[^a-zA-Z0-9]/g, "-")
                      .replace(/-+/g, "-")}}`}
                    className="mb-1"
                  >
                    <span className="">
                      {item?.item_name &&
                        (item.item_name.length > 16
                          ? item.item_name?.slice(0, 14) + ".."
                          : item.item_name)}
                    </span>
                  </Link>
                  {/* <p className="text-xs mb-2 ">
                {data.release_date || data.first_air_date}
              </p>
              <div className=" mb-4 text-xs">
                <GenreName genreids={data.genre_ids} />
              </div> */}
                  {/* <div className="mt-1 ">
                <Staring id={data.id} type={data.media_type} />
              </div> */}
                </div>
              </div>
            </div>
          </div>
        ))}

        <div>
          {/* <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <select
          value={currentPage}
          onChange={(e) => handlePageChange(Number(e.target.value))}
          >
          {renderPageOptions()}
          </select> */}

          {movies.length < totalItems && (
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
