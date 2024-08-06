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
    `https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.TMDB_API_KEY}`,
    { next: { revalidate: 86400 } }
  );

  if (!res.ok) {
    console.log(res);
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

async function getTvGenre() {
  const tvGenresResponse = await fetch(
    `https://api.themoviedb.org/3/genre/tv/list?api_key=${process.env.TMDB_API_KEY}&language=en-US`,
    { next: { revalidate: 86400 } }
  );
  const tvGenres = await tvGenresResponse.json();

  return { tvGenres: tvGenres };
}

async function getTrending() {
  const url = `https://api.themoviedb.org/3/trending/all/week?api_key=${process.env.TMDB_API_KEY}`;

  const res = await fetch(url, { next: { revalidate: 86400 } });

  return res.json();
}

async function getTrendingTV() {
  const url = `https://api.themoviedb.org/3/trending/tv/day?api_key=${process.env.TMDB_API_KEY}`;

  const res = await fetch(url, { next: { revalidate: 86400 } });

  return res.json();
}
export default async function Home() {
  const genre = await getData();
  const { tvGenres } = await getTvGenre();
  const data = await getTrending();
  const TrendingTv = await getTrendingTV();
  return (
    <div className="flex flex-col items-center gap-7">
      <div className="w-full">
        <SearchForm />
      </div>
      <div className="w-full max-w-7xl">
        <h1 className="text-lg font-semibold mb-2">Movie Genres</h1>
        <div className="flex flex-row overflow-x-scroll vone-scrollbar gap-1 mx-5">
          {genre?.genres.map((genre: any) => (
            <Link
              href={`/app/moviebygenre/list/${genre.id}`}
              className=" h-24 min-w-32 text-sm border-2 rounded-md border-gray-700 text-white p-2 text-center content-center"
              key={genre.id}
              // onClick={() => setSelectedGenre(genre.id)}
            >
              {genre.name}
            </Link>
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
            <div className="group relative w-full">
              <div className="absolute top-0 left-0">
                <p className="px-1 py-1 bg-neutral-950  text-white rounded-br-md">
                  {item.media_type}
                </p>
              </div>
              <Link
                className="min-h-[330px]  h-full"
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
                      itemId={item.id}
                      mediaType={item.media_type}
                      name={item.name || item.title}
                      funcType={"watched"}
                      adult={item.adult}
                      imgUrl={item.poster_path || item.backdrop_path}
                      icon={<IoEyeOutline />}
                    />
                    <CardMovieButton
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
      <div className="w-full max-w-7xl">
        <h1 className="text-lg font-semibold mb-2">Tv Show Genres</h1>
        <div className="flex flex-row overflow-x-scroll vone-scrollbar gap-1 mx-5">
          {tvGenres?.genres.map((genre: any) => (
            <Link
              href={`/app/tvbygenre/list/${genre.id}-${genre.name}`}
              className=" h-24 min-w-32 text-sm border-2 rounded-md border-gray-700 text-white p-2 text-center content-center"
              key={genre.id}
              // onClick={() => setSelectedGenre(genre.id)}
            >
              {genre.name}
            </Link>
          ))}
        </div>
      </div>
      <div>
        <h2 className="text-2xl my-4 font-bold">Trending Tv Show's</h2>
        <div className="grid grid-cols-5 gap-4 max-w-6xl w-full">
          {TrendingTv?.results.map((item: any) => (
            <div className="group relative w-full">
              <div className="absolute top-0 left-0">
                <p className="px-1 py-1 bg-neutral-950  text-white rounded-br-md">
                  {item.media_type}
                </p>
              </div>
              <Link
                className="min-h-[330px]  h-full"
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
                      itemId={item.id}
                      mediaType={item.media_type}
                      name={item.name || item.title}
                      funcType={"watched"}
                      adult={item.adult}
                      imgUrl={item.poster_path || item.backdrop_path}
                      icon={<IoEyeOutline />}
                    />
                    <CardMovieButton
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
