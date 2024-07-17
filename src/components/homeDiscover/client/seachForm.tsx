"use client";
import React, { Suspense, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import CardMovieButton from "@/components/buttons/cardMovieButton";
import { CiSaveDown1 } from "react-icons/ci";
import { FcLike } from "react-icons/fc";
import { DiVim } from "react-icons/di";
import pic from "../../../../public/no-photo.jpg";

const MovieSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const search = await fetch("/api/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query }),
    });

    const data = await search.json();

    setResults(data);
    setLoading(false);
    console.log(data);
  };

  return (
    <div className="text-white max-w-7xl w-full min-h-64 mx-auto p-8">
      <form onSubmit={handleSearch} className="mb-8">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="px-4 py-2 w-full bg-gray-800 text-white rounded-md"
          placeholder="Search for movies, tv shows and people..."
        />
        <button type="submit" className="mt-4 px-4 py-2 bg-blue-600 rounded-md">
          Search
        </button>
      </form>
      {results.length == 0 && (
        <p>Hello, search your favorate shows and movies.</p>
      )}
      {loading && (
        <div className="w-full min-h-52 flex justify-center items-center">
          loading..
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {results?.map(
          (data: any) =>
            data?.media_type !== "person" && (
              <div
                key={data.id}
                className=" relative group flex flex-col  bg-black mr-2.5 w-64 max-h-full text-gray-300 rounded-md border border-gray-800  duration-300  hover:scale-105 hover:z-50"
              >
                <div className="absolute top-0 left-0 z-50">
                  <p className="p-1 bg-black text-white rounded-br-md text-sm">
                    {data.media_type}
                  </p>
                </div>

                <Image
                  className="relative rounded-md object-cover max-w-full min-h-[382px] group-hover:opacity-40"
                  src={
                    data.poster_path || data.backdrop_path
                      ? `https://image.tmdb.org/t/p/original${
                          data.poster_path || data.backdrop_path
                        }`
                      : pic
                  }
                  width={500}
                  height={500}
                  quality={20}
                  alt={data.title}
                />
                <span className="opacity-0 flex flex-col gap-3  hlimitSearch px-4 absolute bottom-3  translate-y-0 duration-300 group-hover:opacity-100 group-hover:bottom-24 group-hover:bg-transparent  group-hover:text-gray-200 ">
                  <div className="mb-1">
                    <Link
                      className="group-hover:underline"
                      href={
                        data.media_type == "tv"
                          ? `/app/tv/${data.id}`
                          : `/app/movie/${data.id}`
                      }
                    >
                      {data.title || data.name}
                    </Link>
                  </div>
                  <p className="text-xs mb-1 ">
                    {data.release_date || data.first_air_date}
                  </p>
                  <p className=" text-xs ">{data.overview}</p>
                </span>
                <div className="p-4 flex flex-row gap-5 absolute bottom-4 right-3 transform  opacity-0 group-hover:-translate-x-32 group-hover:opacity-100 transition-transform duration-500">
                  <CardMovieButton
                    movieId={data.id}
                    text={"watched"}
                    icon={<FcLike />}
                  />
                  <CardMovieButton
                    movieId={data.id}
                    text={"save"}
                    icon={<CiSaveDown1 />}
                  />
                </div>
              </div>
            )
        )}
        {results?.map(
          (data: any) =>
            data?.media_type == "person" && (
              <div
                key={data.id}
                className=" relative group flex flex-col  bg-black mr-2.5 w-64 max-h-full text-gray-300 rounded-md border border-gray-800  duration-300  hover:scale-105 hover:z-50"
              >
                <div className="absolute top-0 left-0 z-50">
                  <p className="p-1 bg-black text-white rounded-br-md text-sm">
                    {data.media_type}
                  </p>
                </div>

                <Image
                  className="relative rounded-md object-cover max-w-full min-h-[382px] group-hover:opacity-40"
                  src={
                    data.profile_path
                      ? `https://image.tmdb.org/t/p/original${data.profile_path}`
                      : pic
                  }
                  width={500}
                  height={500}
                  quality={20}
                  alt={data.title}
                />
                <span className="opacity-0 flex flex-col gap-3  hlimitSearch px-4 absolute bottom-3  translate-y-0 duration-300 group-hover:opacity-100 group-hover:bottom-24 group-hover:bg-transparent  group-hover:text-gray-200 ">
                  <div className="mb-1">
                    <Link
                      className="group-hover:underline"
                      href={`/app/person/${data.id}`}
                    >
                      {data.name}
                    </Link>
                  </div>
                  <p className="text-xs mb-1 ">
                    {data.release_date || data.first_air_date}
                  </p>
                  <p className=" text-xs ">{data.known_for_department}</p>
                  {data?.known_for && (
                    <div className="mb-4 flex flex-row gap-1 text-xs">
                      <span>Works: </span>
                      <div className="">
                        {data.known_for
                          .slice(0, 5)
                          .map((item: any, index: number) =>
                            data.known_for.slice(0, 5).length - 1 > index ? (
                              <Link
                                key={item.id}
                                className={
                                  " inline-block hover:underline  px-1 "
                                }
                                href={`/app/${item.media_type}/${item.id}`}
                              >
                                {item.title || item.orignal_name || item.name},
                              </Link>
                            ) : (
                              <Link
                                key={item.id}
                                className={
                                  " inline-block hover:underline px-1 "
                                }
                                href={`/app/${item.media_type}/${item.id}`}
                              >
                                {item.title || item.original_name || item.name}
                              </Link>
                            )
                          )}
                      </div>
                    </div>
                  )}
                </span>
                <div className="p-4 flex flex-row gap-5 absolute bottom-4 right-3 transform  opacity-0 group-hover:-translate-x-32 group-hover:opacity-100 transition-transform duration-500">
                  <CardMovieButton
                    movieId={data.id}
                    text={"watched"}
                    icon={<FcLike />}
                  />
                  <CardMovieButton
                    movieId={data.id}
                    text={"save"}
                    icon={<CiSaveDown1 />}
                  />
                </div>
              </div>
            )
        )}
      </div>
    </div>
  );
};

export default MovieSearch;
