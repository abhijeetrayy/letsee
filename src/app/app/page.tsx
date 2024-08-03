// "use client";
// import { useState, useEffect } from "react";
// import axios from "axios";
// import Movie from "./api/genre/route";
// import Image from "next/image";
// import Link from "next/link";
import CardMovieButton from "@/components/buttons/cardButtons";
import MovieCard from "@/components/cards/cardMovie";
import SearchForm from "@/components/homeDiscover/client/seachForm";
import Link from "next/link";
import { CiSaveDown1 } from "react-icons/ci";
import { FcLike } from "react-icons/fc";
import { IoEyeOutline } from "react-icons/io5";

async function getData() {
  const res = await fetch(
    `https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.TMDB_API_KEY}`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

async function getTrending() {
  const url = "https://api.themoviedb.org/3/trending/all/week?language=en-US";
  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjZWQxNDU3OTIyYzBmZmQ4OGVkNmM2ZGVjN2RlMGRjNyIsIm5iZiI6MTcyMjU4MjEzMS40Nzk3NjcsInN1YiI6IjY2ODgyNTQxNjBhN2U0ZmQ1YTYxYTk1OSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.EmVoL7vy0Lms5tFYw1MKBCRmYmrWIQShH8tR2YHvDyo",
    },
  };

  const res = await fetch(url, options);

  return res.json();
}
export default async function Home() {
  const genre = await getData();
  const data = await getTrending();
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="w-full">
        <SearchForm />
      </div>
      <div className="w-full max-w-7xl">
        <h1 className="text-lg font-semibold mb-2">Movie Genres</h1>
        <div className="flex flex-row overflow-x-scroll vone-scrollbar gap-1 mx-5">
          {genre?.genres.map((genre: any) => (
            <button
              className=" h-24 min-w-32 text-sm border-2 rounded-md border-gray-700 text-white p-2 whitespace-nowrap"
              key={genre.id}
              // onClick={() => setSelectedGenre(genre.id)}
            >
              {genre.name}
            </button>
          ))}
        </div>
      </div>
      {/* <div className="grid gap-2 mt-5">
        {genre?.genres.map((genre) => (
          <MovieCard key={genre.id} genre={genre} />
        ))}
      </div> */}
      <div>
        <h2 className="text-2xl my-4 font-bold">Weekly Top 20</h2>
        <div className="grid grid-cols-5 gap-4 max-w-6xl w-full">
          {data?.results.map((item: any) => (
            <div className="group relative">
              <div className="absolute top-0 left-0">
                <p className="px-1 py-1 bg-neutral-950  text-white rounded-br-md">
                  {item.media_type}
                </p>
              </div>
              <Link
                className="max-h-[330px]  h-full"
                href={`/app/${item.media_type}/${item.id}`}
              >
                <img
                  className="h-full"
                  src={`https://image.tmdb.org/t/p/w342${item.poster_path}`}
                  alt={item.id}
                />
              </Link>
              <div className="absolute bottom-0 w-full opacity-0 group-hover:opacity-100">
                <div className="  bg-neutral-900 ">
                  <div className="w-full h-14 grid grid-cols-3 ">
                    <CardMovieButton
                      className="border-r border-neutral-400"
                      itemId={item.id}
                      mediaType={item.media_type}
                      name={item.name || item.title}
                      funcType={"watched"}
                      adult={item.adult}
                      imgUrl={item.poster_path || item.backdrop_path}
                      icon={<IoEyeOutline />}
                    />
                    <CardMovieButton
                      className="border-r  border-neutral-400"
                      itemId={item.id}
                      mediaType={item.media_type}
                      name={item.name || item.title}
                      funcType={"favorite"}
                      adult={item.adult}
                      imgUrl={item.poster_path || item.backdrop_path}
                      icon={<FcLike />}
                    />
                    <CardMovieButton
                      itemId={item.id}
                      mediaType={item.media_type}
                      name={item.name || item.title}
                      funcType={"watchlater"}
                      adult={item.adult}
                      imgUrl={item.poster_path || item.backdrop_path}
                      icon={<CiSaveDown1 />}
                    />
                  </div>
                </div>
                <div className=" min-h-14 flex flex-col justify-center px-3 pb-1   w-full bg-indigo-600 text-gray-100 ">
                  <p className="">
                    {item.name?.length > 40 || item.title?.length > 40 ? (
                      <span>
                        {item.name?.slice(0, 40) || item.title?.slice(0, 40)}..
                      </span>
                    ) : (
                      item.name || item.title
                    )}{" "}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
