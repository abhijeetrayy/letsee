import Link from "next/link";
import React from "react";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function page({ params }: PageProps) {
  const { id }: any = await params;

  async function getShowDetails(id: string) {
    const response = await fetch(
      `https://api.themoviedb.org/3/tv/${id}?api_key=${process.env.TMDB_API_KEY}`
    );

    const data = await response.json();
    return data;
  }
  async function getShowCredit(id: string) {
    const response = await fetch(
      `https://api.themoviedb.org/3/tv/${id}/credits?api_key=${process.env.TMDB_API_KEY}&language=en-US`
    );

    const data = await response.json();
    return data;
  }
  const show = await getShowDetails(id);

  const { cast, crew } = await getShowCredit(id);
  return (
    <div>
      <div className="relative w-full flex flex-col  overflow-y-clip justify-center items-center min-h-[590px]">
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
              show.backdrop_path && !show.adult
                ? `https://image.tmdb.org/t/p/w300${show.backdrop_path}`
                : "/backgroundjpeg.webp"
            }`}
            width={300}
            height={300}
            alt=""
          />
        </div>

        <div className="z-10 relative flex flex-row gap-5 py-3 px-6 w-full max-w-6xl">
          <div className="flex-1">
            <img
              className="min-h[500px] rounded-md"
              src={
                show.adult
                  ? "/pixeled.webp"
                  : `https://image.tmdb.org/t/p/w342${show.poster_path}`
              }
              alt={show.name}
            />
          </div>
          <div className="flex-[2]">
            <h1 className="text-4xl font-bold mb-4">
              {" "}
              {show?.adult && (
                <span className="text-sm px-3 py-1 rounded-md m-2 bg-red-600 text-white z-20">
                  Adult
                </span>
              )}
              <Link
                className="hover:text-neutral-200 hover:underline"
                href={`/app/tv/${show.id}-${show.name
                  .trim()
                  .replace(/[^a-zA-Z0-9]/g, "-")
                  .replace(/-+/g, "-")}}`}
              >
                <h1 className="text-xl font-bold">{show.name}</h1>
              </Link>
            </h1>

            <div className="text-6xl font-bold my-3">Cast ~ Prod.</div>
            {/* <div className="mb-4  text-gray-400">
              <span>Staring: </span>
              {cast?.slice(0, 5).map((item: any, index: number) =>
                cast?.slice(0, 5).length - 1 > index ? (
                  <Link
                    key={item.id}
                    className={
                      " inline-block hover:underline  px-1 whitespace-nowrap"
                    }
                    href={`/app/person/${item.id}`}
                  >
                    {item.name},
                  </Link>
                ) : (
                  <Link
                    key={item.id}
                    className={
                      " inline-block hover:underline px-1 whitespace-nowrap"
                    }
                    href={`/app/person/${item.id}`}
                  >
                    {item.name}
                  </Link>
                )
              )}
            </div> */}
          </div>
        </div>
      </div>
      <div className="max-w-5xl w-full m-auto my-3">
        {cast.length > 0 && <h2>Cast ~</h2>}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {cast?.map((item: any, index: number) => (
            <Link
              key={index}
              className="border border-neutral-900 bg-neutral-800 py-2 px-2 rounded-md hover:border-indigo-600"
              href={`/app/person/${item.id}-${item.name
                .trim()
                .replace(/[^a-zA-Z0-9]/g, "-")
                .replace(/-+/g, "-")}}`}
            >
              <div className="flex flex-col md:flex-row gap-4 mb-4 ">
                <img
                  className="max-w-[100px] object-cover rounded-md h-full"
                  src={
                    item.profile_path
                      ? `https://image.tmdb.org/t/p/w92${item.profile_path}`
                      : "/avatar.svg"
                  }
                  alt=""
                />

                <div className="flex flex-row gap-2">
                  <h1>{item.name}</h1> <span> - </span> <p>{item.character}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
        {crew.length > 0 && <h2 className="my-3 mt-10">Prod. ~ Crew</h2>}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {crew?.map((item: any, index: number) => (
            <Link
              className="flex flex-col items-center justify-center hover:opacity-75"
              key={index}
              href={`/app/person/${item.id}-${item.name
                .trim()
                .replace(/[^a-zA-Z0-9]/g, "-")
                .replace(/-+/g, "-")}}`}
            >
              <div>
                <img
                  className="w-32  md:min-h-44 h-full object-cover rounded-md"
                  src={
                    item.profile_path
                      ? `https://image.tmdb.org/t/p/w92${item.profile_path}`
                      : "/avatar.svg"
                  }
                  alt=""
                />
              </div>
              <div className="flex flex-col gap-2">
                <h1 className="text-center">{item.name}</h1>{" "}
                <p className="text-center text-xs">{item.department}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default page;
