import Link from "next/link";
import React from "react";

async function getCredit(id: any, type: string) {
  const response = await fetch(
    type == "movie"
      ? `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${process.env.TMDB_API_KEY}`
      : `https://api.themoviedb.org/3/tv/${id}/credits?api_key=${process.env.TMDB_API_KEY}&language=en-US`
  );

  const data = await response.json();
  return data;
}

async function credits({ id, type }: any) {
  const { cast } = await getCredit(id, type);

  return (
    <>
      {cast?.length > 0 && (
        <div className="leading-tight">
          <p className="text-xs ">Staring: </p>
          {cast?.slice(0, 3).map((item: any, index: number) => (
            <span key={item.id}>
              <Link
                href={`/app/person/${item.id}`}
                className=" break-words text-xs hover:underline"
              >
                {item.name}
              </Link>
              {index < cast.slice(0, 3).length - 1 && ", "}
            </span>
          ))}
        </div>
      )}
    </>
  );
}

export default credits;
