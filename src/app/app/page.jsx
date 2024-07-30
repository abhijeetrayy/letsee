// "use client";
// import { useState, useEffect } from "react";
// import axios from "axios";
// import Movie from "./api/genre/route";
// import Image from "next/image";
// import Link from "next/link";
import MovieCard from "@/components/cards/cardMovie";
import SearchForm from "@/components/homeDiscover/client/seachForm";

async function getData() {
  const res = await fetch(
    `https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.TMDB_API_KEY}`
  );

  if (!res.ok) {
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

export default async function Home() {
  const genre = await getData();

  return (
    <div className="">
      <div>
        <SearchForm />
      </div>
      <h1>Movie Genres</h1>
      <div className="grid grid-cols-6 gap-3 mx-5">
        {genre?.genres.map((genre) => (
          <button
            className=" h-24 min-w-32 text-sm border-2 rounded-md border-gray-700 text-white p-2 whitespace-nowrap"
            key={genre.id}
            // onClick={() => setSelectedGenre(genre.id)}
          >
            {genre.name}
          </button>
        ))}
      </div>
      {/* <div className="grid gap-2 mt-5">
        {genre?.genres.map((genre) => (
          <MovieCard key={genre.id} genre={genre} />
        ))}
      </div> */}
    </div>
  );
}
