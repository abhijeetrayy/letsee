"use client";

import Link from "next/link";
// import { useState } from "react";

import ThreePrefrenceBtn from "@/components/buttons/threePrefrencebtn";

function personCredits({ orginalCast, cast, crew, name }: any) {
  return (
    <div>
      <div className="flex flex-row gap-5 overflow-x-scroll vone-scrollbar ">
        {orginalCast?.slice(0, 7).map((data: any) => (
          <div className="w-full" key={data.id}>
            <div className=" relative group flex flex-col rounded-md bg-black mr-2.5 min-w-44 w-full  text-gray-300 overflow-hidden ">
              <div className="absolute top-0 left-0 z-10 opacity-0 group-hover:opacity-100">
                {data.adult ? (
                  <p className="p-1 bg-red-600 text-white rounded-br-md text-sm">
                    Adult
                  </p>
                ) : (
                  <p className="p-1 bg-black text-white rounded-br-md text-sm">
                    {data.media_type}
                  </p>
                )}
              </div>
              <div className="absolute top-0 right-0 z-10">
                {(data.release_date || data.first_air_date) && (
                  <p className="p-1 bg-indigo-600 text-white rounded-tr-sm rounded-bl-md text-sm">
                    {new Date(data.release_date).getFullYear() ||
                      new Date(data.first_air_date).getFullYear()}
                  </p>
                )}
              </div>
              <Link
                className="h-[320px] w-full"
                href={`/app/${data.media_type}/${data.id}-${(
                  data.name || data.title
                )
                  .trim()
                  .replace(/[^a-zA-Z0-9]/g, "-")
                  .replace(/-+/g, "-")}`}
              >
                <img
                  className="relative object-cover min-w-full h-full "
                  src={
                    (data.poster_path || data.backdrop_path) && !data.adult
                      ? `https://image.tmdb.org/t/p/w342${
                          data.poster_path || data.backdrop_path
                        }`
                      : data.adult
                      ? "/pixeled.jpg"
                      : "/no-photo.jpg"
                  }
                  loading="lazy"
                  alt={data.title}
                />
              </Link>
              <div className="absolute bottom-0 w-full bg-neutral-900 opacity-0 group-hover:opacity-100 z-10">
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
          </div>
        ))}
      </div>
      <div>
        <h1 className="my-3">Timeline - </h1>
        <div className="grid grid-cols-5 gap-3 ">
          {cast
            ?.sort((a: any, b: any) => {
              // Get the dates, defaulting to a very old date if not present
              const dateA = new Date(
                a.release_date || a.first_air_date || "1900-01-01"
              );
              const dateB = new Date(
                b.release_date || b.first_air_date || "1900-01-01"
              );

              // Compare the dates, most recent first
              return dateB.getTime() - dateA.getTime();
            })
            .map((data: any) => (
              <div className="" key={data.id}>
                <div className=" relative group flex flex-col rounded-md bg-black mr-2.5 w-full  text-gray-300 overflow-hidden duration-300  hover:scale-105 ">
                  <div className="absolute top-0 left-0 z-10 opacity-0 group-hover:opacity-100">
                    {data.adult ? (
                      <p className="p-1 bg-red-600 text-white rounded-br-md text-sm">
                        Adult
                      </p>
                    ) : (
                      <p className="p-1 bg-black text-white rounded-br-md text-sm">
                        {data.media_type}
                      </p>
                    )}
                  </div>
                  <div className="absolute top-0 right-0 z-10">
                    {(data.release_date || data.first_air_date) && (
                      <p className="p-1 bg-indigo-600 text-white rounded-tr-sm rounded-bl-md text-sm">
                        {new Date(data.release_date).getFullYear() ||
                          new Date(data.first_air_date).getFullYear()}
                      </p>
                    )}
                  </div>
                  <Link
                    className="h-[320px] "
                    href={`/app/${data.media_type}/${data.id}-${(
                      data.name || data.title
                    )
                      .trim()
                      .replace(/[^a-zA-Z0-9]/g, "-")
                      .replace(/-+/g, "-")}`}
                  >
                    <img
                      className="relative object-cover w-full h-full "
                      src={
                        (data.poster_path || data.backdrop_path) && !data.adult
                          ? `https://image.tmdb.org/t/p/w342${
                              data.poster_path || data.backdrop_path
                            }`
                          : data.adult
                          ? "/pixeled.jpg"
                          : "/no-photo.jpg"
                      }
                      loading="lazy"
                      alt={data.title}
                    />
                  </Link>
                  <div className="absolute bottom-0 w-full bg-neutral-900 opacity-0 group-hover:opacity-100 z-10">
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
              </div>
            ))}
        </div>
      </div>

      {crew.length >= 1 && (
        <h3 className=" col-span-5 p-3 font-semibold">In prod. ~ crew</h3>
      )}
      <div className="grid grid-cols-5 gap-3 ">
        {crew?.map((data: any) => (
          <div className="" key={data.id}>
            <div className=" relative group flex flex-col  bg-black mr-2.5 w-full h-[320px] text-gray-300 rounded-md  duration-300  hover:scale-105 hover:z-50">
              <div className="absolute top-0 left-0 z-50">
                <p className="p-1 bg-black text-white rounded-br-md text-sm">
                  {data.media_type}
                </p>
              </div>
              <div className="absolute top-0 right-0 z-50">
                <p className="p-1 bg-red-600 text-white rounded-bl-md text-sm">
                  In Prod.
                </p>
              </div>
              <img
                className="relative rounded-md object-cover w-full h-full group-hover:opacity-20"
                src={
                  (data.poster_path || data.backdrop_path) && !data.adult
                    ? `https://image.tmdb.org/t/p/w185${
                        data.poster_path || data.backdrop_path
                      }`
                    : data.adult
                    ? "/pixeled.jpg"
                    : "/no-photo.jpg"
                }
                alt={data.title}
              />
              <span className="opacity-0 flex flex-col gap-3 break-all hlimitSearch px-4 absolute bottom-3  translate-y-0 duration-300 group-hover:opacity-100 group-hover:bottom-24 group-hover:bg-transparent  group-hover:text-gray-200 ">
                <div className="mb-1">
                  <Link
                    className="group-hover:underline text-lg"
                    href={`/app/${data.media_type}/${data.id}-${(
                      data.name || data.title
                    )
                      .trim()
                      .replace(/[^a-zA-Z0-9]/g, "-")
                      .replace(/-+/g, "-")}`}
                  >
                    {data.title || data.name}
                  </Link>
                </div>
                <p className="text-xs mb-1 ">
                  {data.release_date || data.first_air_date}
                </p>

                <p className=" text-xs ">
                  {name}:{" "}
                  <span className="">
                    {data.department}-{data.job}
                  </span>
                </p>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default personCredits;
