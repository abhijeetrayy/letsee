import Link from "next/link";
import React from "react";

async function page({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  async function getCredit(id: any) {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${process.env.TMDB_API_KEY}`
    );

    const data = await response.json();
    return data;
  }
  async function getMovieDetails(id: any) {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.TMDB_API_KEY}`
    );

    const data = await response.json();
    return data;
  }
  const { id }: any = await params;
  const movie = await getMovieDetails(id);
  const { cast, crew } = await getCredit(id);
  return (
    <div>
      <div className="relative flex flex-col items-center justify-center w-full min-h-[550px] h-full">
        <div className="absolute w-full  h-full overflow-hidden">
          <div
            className="absolute inset-0 z-10 bg-gradient-to-r from-neutral-900 via-transparent to-neutral-900"
            style={{
              background:
                "linear-gradient(to left,  #171717, transparent 60%, #171717, #171717)",
            }}
          ></div>
          <div
            className="absolute inset-0 z-10 bg-gradient-to-l from-neutral-900 via-transparent to-neutral-900"
            style={{
              background:
                "linear-gradient(to right,  #171717, transparent 60%, #171717, #171717)",
            }}
          ></div>
          <img
            className="object-cover max-w-[2100px] w-full h-full  m-auto opacity-20"
            src={`${
              movie.backdrop_path && !movie.adult
                ? `https://image.tmdb.org/t/p/w300${movie.backdrop_path}`
                : "/backgroundjpeg.jpeg"
            }`}
            width={300}
            height={300}
            alt=""
          />
        </div>

        <div className="max-w-6xl w-full relative  z-10  flex flex-row  gap-5">
          <div className=" flex-1 ">
            <img
              className="rounded-md object-cover h-full max-h-[500px]"
              src={`${
                movie.poster_path && !movie.adult
                  ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
                  : movie.adult
                  ? "/pixeled.jpg"
                  : "/no-photo.jpg"
              }`}
              width={500}
              height={500}
              alt=""
            />
          </div>
          <div className=" flex-[2] w-full ">
            <Link
              className="hover:text-neutral-200 hover:underline"
              href={`/app/movie/${movie.id}-${movie.title
                .trim()
                .replace(/[^a-zA-Z0-9]/g, "-")
                .replace(/-+/g, "-")}}`}
            >
              <h1 className="text-xl font-bold">{movie.title}</h1>
            </Link>
            <span className="text-4xl font-bold mt-10 ">Cast ~ Crew</span>
          </div>
        </div>
      </div>
      <div className="max-w-5xl w-full m-auto my-3">
        <h2>Cast ~</h2>
        <div className="grid grid-cols-2 gap-5">
          {cast.map((item: any) => (
            <Link
              className="border border-neutral-900 bg-neutral-800 py-2 px-2 rounded-md hover:border-indigo-600"
              href={`/app/person/${item.id}-${item.name
                .trim()
                .replace(/[^a-zA-Z0-9]/g, "-")
                .replace(/-+/g, "-")}}`}
            >
              <div className="flex flex-row gap-4 mb-4 ">
                <img
                  className="max-w-[100px] object-cover rounded-md h-full"
                  src={
                    item.profile_path
                      ? `https://image.tmdb.org/t/p/w92${item.profile_path}`
                      : "/avatar.svg"
                  }
                  alt=""
                />

                <h1>{item.name}</h1>
                <span>-</span>
                <p>{item.character}</p>
              </div>
            </Link>
          ))}
        </div>
        <h2 className="my-3">Prod. ~ Crew</h2>
        <div className="">
          {crew.map((item: any) => (
            <Link
              href={`/app/person/${item.id}-${item.name
                .trim()
                .replace(/[^a-zA-Z0-9]/g, "-")
                .replace(/-+/g, "-")}}`}
            >
              <div className="flex flex-row gap-4 mb-4">
                <img
                  className="max-w-[120px] min-h-44 h-full object-cover rounded-md"
                  src={
                    item.profile_path
                      ? `https://image.tmdb.org/t/p/w92${item.profile_path}`
                      : "/avatar.svg"
                  }
                  alt=""
                />

                <h1>{item.name}</h1>
                <span>-</span>
                <p>{item.department}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default page;
