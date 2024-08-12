"use client";
import Link from "next/link";
import React, { useState } from "react";
// import CardMovieButton from "@/components/buttons/cardMovieButton";
import ThreePrefrenceBtn from "@/components/buttons/threePrefrencebtn";

const MovieSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]) as any;
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    const search = await fetch("/api/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, page: 1 }),
    });

    const data = await search.json();
    console.log(data);
    setResults(data);
    setLoading(false);
  };

  const nextPage = async () => {
    setLoading(true);
    setPage(page + 1);

    const search = await fetch("/api/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, page: page + 1 }),
    });

    const data = await search.json();
    console.log(data);
    setResults(data);
    setLoading(false);
  };
  const lastPage = async () => {
    setLoading(true);
    setPage(page - 1);

    const search = await fetch("/api/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ query, page: page - 1 }),
    });

    const data = await search.json();
    console.log(data);
    setResults(data);
    setLoading(false);
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
      {loading ? (
        <div className="w-full min-h-52 flex justify-center items-center">
          loading..
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {results?.results?.map(
            (data: any) =>
              data?.media_type !== "person" && (
                <div
                  key={data.id}
                  className=" overflow-hidden relative group flex flex-col  bg-black w-full text-gray-300 rounded-md   duration-300  hover:scale-105 hover:z-50"
                >
                  <div className="absolute  top-0 left-0 flex flex-row justify-between w-full z-50">
                    <p className="p-1 bg-black text-white rounded-br-md text-sm">
                      {data.media_type}
                    </p>
                    {(data.release_date || data.first_air_date) && (
                      <p className="p-1 bg-indigo-600 text-white rounded-bl-md text-sm">
                        {new Date(data.release_date).getFullYear() ||
                          new Date(data.first_air_date).getFullYear()}
                      </p>
                    )}
                  </div>
                  <Link
                    href={`/app/${data.media_type}/${data.id}--${(
                      data.name || data.title
                    )
                      .trim()
                      .replace(/[^a-zA-Z0-9]/g, "-")
                      .replace(/-+/g, "-")}`}
                    className="min-h-[342px] h-full w-full"
                  >
                    <img
                      className="relative object-cover w-full h-full "
                      src={
                        data.poster_path || data.backdrop_path
                          ? `https://image.tmdb.org/t/p/w342${
                              data.poster_path || data.backdrop_path
                            }`
                          : "/no-photo.jpg"
                      }
                      width={400}
                      height={400}
                      alt={data.title}
                    />
                  </Link>

                  <div className="lg:absolute bottom-0 w-full bg-neutral-900 lg:opacity-0 lg:group-hover:opacity-100 ">
                    <ThreePrefrenceBtn
                      cardId={data.id}
                      cardType={data.media_type}
                      cardName={data.name || data.title}
                      cardAdult={data.adult}
                      cardImg={data.poster_path || data.backdrop_path}
                    />

                    <div
                      title={data.name || data.title}
                      className="w-full flex flex-col gap-2  px-4  bg-indigo-700  text-gray-200 "
                    >
                      <Link
                        href={`/app/${data.media_type}/${data.id}-${(
                          data.name || data.title
                        )
                          .trim()
                          .replace(/[^a-zA-Z0-9]/g, "-")
                          .replace(/-+/g, "-")}}`}
                        className="mb-1"
                      >
                        <span className="">
                          {data?.title
                            ? data.title.length > 20
                              ? data.title?.slice(0, 20) + "..."
                              : data.title
                            : data.name.length > 20
                            ? data.name?.slice(0, 20) + "..."
                            : data.name}
                        </span>
                      </Link>
                    </div>
                  </div>
                </div>
              )
          )}
          {results?.results?.map(
            (data: any) =>
              data?.media_type == "person" && (
                <div
                  key={data.id}
                  className=" relative group flex flex-col  bg-black mr-2.5  text-gray-300 rounded-md   duration-300  hover:scale-105 hover:z-50"
                >
                  <div className="absolute top-0 left-0 z-50">
                    <p className="p-1 bg-black text-white rounded-br-md text-sm">
                      {data.media_type}
                    </p>
                  </div>
                  <img
                    className="relative rounded-md object-cover min-h-[342px] h-full w-full  group-hover:opacity-20"
                    src={
                      data.profile_path
                        ? `https://image.tmdb.org/t/p/h632${data.profile_path}`
                        : "/no-photo.jpg"
                    }
                    width={400}
                    height={400}
                    alt={data.title}
                  />
                  <span className="opacity-0 flex flex-col gap-3   hlimitSearch px-4 absolute bottom-3  translate-y-0 duration-300 group-hover:opacity-100 group-hover:bottom-24 group-hover:bg-transparent  group-hover:text-gray-200 ">
                    <div className="mb-1">
                      <Link
                        className="group-hover:underline"
                        href={`/app/person/${data.id}-${data.name
                          .trim()
                          .replace(/[^a-zA-Z0-9]/g, "-")
                          .replace(/-+/g, "-")}`}
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
                                  href={`/app/${item.media_type}/${item.id}-${(
                                    item.name || item.title
                                  )
                                    .trim()
                                    .replace(/[^a-zA-Z0-9]/g, "-")
                                    .replace(/-+/g, "-")}`}
                                >
                                  {item.title || item.orignal_name || item.name}
                                  ,
                                </Link>
                              ) : (
                                <Link
                                  key={item.id}
                                  className={
                                    " inline-block hover:underline px-1 "
                                  }
                                  href={`/app/${item.media_type}/${item.id}-${(
                                    item.name || item.title
                                  )
                                    .trim()
                                    .replace(/[^a-zA-Z0-9]/g, "-")
                                    .replace(/-+/g, "-")}`}
                                >
                                  {item.title ||
                                    item.original_name ||
                                    item.name}
                                </Link>
                              )
                            )}
                        </div>
                      </div>
                    )}
                  </span>
                  <div className="p-4 flex flex-row gap-5 absolute bottom-4 right-3 transform  opacity-0 group-hover:-translate-x-32 group-hover:opacity-100 transition-transform duration-500">
                    {/* <CardMovieButton
                    movieId={data.id}
                    text={"watched"}
                    icon={<FcLike />}
                  />
                  <CardMovieButton
                    movieId={data.id}
                    text={"save"}
                    icon={<CiSaveDown1 />}
                  /> */}
                  </div>
                </div>
              )
          )}
        </div>
      )}

      {results?.total_pages > 1 && (
        <div className=" w-full flex flex-row gap-2 justify-center items-center my-4">
          <button
            className="px-4 py-2 bg-neutral-700 rounded-md hover:bg-neutral-600"
            onClick={lastPage}
            disabled={results.page === 1}
          >
            Last
          </button>
          page: <span>{results.page}</span> of {results?.total_pages}
          <button
            className="px-4 py-2  bg-neutral-700 rounded-md hover:bg-neutral-600"
            onClick={nextPage}
            disabled={results.page === results.total_pages}
          >
            next
          </button>
        </div>
      )}
    </div>
  );
};

export default MovieSearch;
