import React from "react";
import { GenreList } from "@/staticData/genreList";
import Link from "next/link";

function genreConvert({ genreid }: any) {
  const GenreName = GenreList?.genres?.filter(
    (item: any) => item.id == genreid
  );
  return (
    <div className="inline-block mb-1">
      {GenreName.map((item: any) => (
        <Link
          key={item.id}
          className="rounded-sm mr-1 bg-gray-700 text-white break-words"
          href={`/app/genre/${genreid}`}
        >
          {item.name}
        </Link>
      ))}
    </div>
  );
}

export default genreConvert;
