'use client'
import React from "react";
import { GenreList } from "@/staticData/genreList";
import Link from "next/link";

function genreConvert({ genreids }: any) {

  const genreMap = new Map(GenreList.genres.map((genre: { id: number; name: string }) => [genre.id, genre.name]));

  const idsName = genreids?.map((id: number) => genreMap.get(id) || 'Unknown Genre');
  console.log(idsName)
  return (
    <div className="inline-block mb-1">
      {idsName?.map((item: any) => (

        <Link
          key={item.id}
          className="rounded-sm mr-1 bg-gray-700 text-white break-words"
          href={`/app/genre/${item.id}`}
        >
          {item.name}
        </Link>


      ))
      }
    </div >
  );
}

export default genreConvert;
