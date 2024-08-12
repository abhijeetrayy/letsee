"use client";
import CardMovieButton from "@/components/buttons/cardButtons";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { CiSaveDown1 } from "react-icons/ci";
import { FcLike } from "react-icons/fc";
import { IoEyeOutline } from "react-icons/io5";
import ThreePrefrenceBtn from "@/components/buttons/threePrefrencebtn";

function Page() {
  const [Sresults, setSResults] = useState([]) as any;
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const { query } = params;

  const page = Number(searchParams.get("page")) || 1;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/search", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query, page }),
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setSResults(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setLoading(false);
    };

    fetchData();
  }, [query, page]);

  const changePage = (newPage: number) => {
    setLoading(true);
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("page", newPage.toString());
    router.push(`/app/search/${query}?${newSearchParams.toString()}`);
  };

  return (
    <div className="min-h-screen mx-auto w-full max-w-7xl">
      <div>
        <p>
          Search Results: {decodeURIComponent(query as string)} '
          {Sresults?.total_results}' items
        </p>
      </div>
      {loading ? (
        <div className="min-h-screen w-full flex justify-center items-center">
          Loading..
        </div>
      ) : (
        <div>
          <div className="text-white  w-full   p-8">
            <div className="w-fit m-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {Sresults?.results?.map(
                (data: any) =>
                  data?.media_type !== "person" && (
                    <div
                      key={data.id}
                      className="relative group flex flex-col bg-black w-full h-full text-gray-300 rounded-sm duration-300 hover:scale-105 hover:z-10"
                    >
                      <div className="absolute top-0 left-0 flex flex-row justify-between w-full z-10">
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
                        href={`/app/${data.media_type}/${data.id}-${(
                          data.name || data.title
                        )
                          .trim()
                          .replace(/[^a-zA-Z0-9]/g, "-")
                          .replace(/-+/g, "-")}`}
                        className="h-full w-full"
                      >
                        <img
                          className="w-full h-full object-cover"
                          src={
                            data.poster_path || data.backdrop_path
                              ? `https://image.tmdb.org/t/p/w342${
                                  data.poster_path || data.backdrop_path
                                }`
                              : "/no-photo.jpg"
                          }
                          alt={data.title}
                        />
                      </Link>

                      <div className=" lg:absolute lg:bottom-0 w-full bg-neutral-900 lg:opacity-0 lg:group-hover:opacity-100">
                        <ThreePrefrenceBtn
                          cardId={data.id}
                          cardType={data.media_type}
                          cardName={data.name || data.title}
                          cardAdult={data.adult}
                          cardImg={data.poster_path || data.backdrop_path}
                        />

                        <div
                          title={data.name || data.title}
                          className="w-full flex flex-col gap-2 px-4 bg-indigo-700 text-gray-200 lg:opacity-0 lg:group-hover:opacity-100"
                        >
                          <Link
                            href={`/app/${data.media_type}/${data.id}-${(
                              data.name || data.title
                            )
                              .trim()
                              .replace(/[^a-zA-Z0-9]/g, "-")
                              .replace(/-+/g, "-")}`}
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
              {Sresults?.results?.map(
                (data: any) =>
                  data?.media_type == "person" && (
                    <div
                      key={data.id}
                      className="relative group flex flex-col bg-black w-full h-full text-gray-300 rounded-sm duration-300 hover:scale-105 hover:z-50"
                    >
                      <div className="absolute top-0 left-0 flex flex-row justify-between w-full z-10">
                        <p className="p-1 bg-black text-white rounded-br-md text-sm">
                          {data.media_type}
                        </p>
                      </div>
                      <Link
                        className="h-full w-full"
                        href={`/app/person/${data.id}-${data.name
                          .trim()
                          .replace(/[^a-zA-Z0-9]/g, "-")
                          .replace(/-+/g, "-")}`}
                      >
                        <img
                          className="w-full h-full object-cover "
                          src={
                            data.profile_path
                              ? `https://image.tmdb.org/t/p/h632${data.profile_path}`
                              : "/no-photo.jpg"
                          }
                          width={400}
                          height={400}
                          alt={data.title}
                        />
                      </Link>
                      <span className="bg-indigo-600  flex flex-col gap-3   hlimitSearch p-2 text-gray-300 ">
                        <div className="">
                          <Link
                            className="group-hover:underline"
                            href={`/app/person/${data.id}-${data.name
                              .trim()
                              .replace(/[^a-zA-Z0-9]/g, "-")
                              .replace(/-+/g, "-")}`}
                          >
                            {data.name.length > 16
                              ? data.name.slice(0, 14) + ".."
                              : data.name}
                          </Link>
                        </div>

                        <div className=" text-xs underline ">
                          {data.known_for_department}
                        </div>
                        {/* {data?.known_for && (
                          <div className="mb-4 flex flex-row  text-xs">
                            <div className="flex-1">Known for: </div>
                            <div className=" flex-[2]">
                              {data.known_for
                                .slice(0, 5)
                                .map((item: any, index: number) =>
                                  data.known_for.slice(0, 5).length - 1 >
                                  index ? (
                                    <Link
                                      key={item.id}
                                      className={
                                        " inline-block hover:underline  px-1 "
                                      }
                                      href={`/app/${item.media_type}/${
                                        item.id
                                      }-${(data.name || data.title)
                                        .trim()
                                        .replace(/[^a-zA-Z0-9]/g, "-")
                                        .replace(/-+/g, "-")}`}
                                    >
                                      {item.title ||
                                        item.orignal_name ||
                                        item.name}
                                      ,
                                    </Link>
                                  ) : (
                                    <Link
                                      key={item.id}
                                      className={
                                        " inline-block hover:underline px-1 "
                                      }
                                      href={`/app/${item.media_type}/${
                                        item.id
                                      }-${(data.name || data.title)
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
                        )} */}
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
          </div>
        </div>
      )}
      {Sresults?.total_pages > 1 && (
        <div className="flex flex-row justify-center items-center ">
          <div className=" my-3 ">
            <button
              className="px-4 py-2 bg-neutral-700 rounded-md hover:bg-neutral-600"
              onClick={() => changePage(page - 1)}
              disabled={page === 1}
            >
              Last
            </button>
            <span className="mx-4">
              Page {page} of {Sresults.total_pages}
            </span>
            <button
              className="px-4 py-2 bg-neutral-700 rounded-md hover:bg-neutral-600"
              onClick={() => changePage(page + 1)}
              disabled={page === Sresults.total_pages}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Page;
