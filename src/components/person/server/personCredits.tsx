"use client";

import Link from "next/link";
import { CiHeart, CiSaveDown1 } from "react-icons/ci";
import { FcLike } from "react-icons/fc";
// import { useState } from "react";

import userPrefrenceContext from "@/app/contextAPI/userPrefrence";
import CardMovieButton from "@/components/buttons/cardButtons";
import { useContext } from "react";
import { PiEyeBold } from "react-icons/pi";
import { RiEyeCloseLine } from "react-icons/ri";
import ThreePrefrenceBtn from "@/components/buttons/threePrefrencebtn";

function personCredits({ cast, crew, name }: any) {
  // const [limit, setlimit] = useState(19);
  // const [crewlimit, setcrewlimit] = useState(0);
  // const [loaded, setLoaded] = useState(false);
  // function getAllCredits() {
  //   setlimit(cast.length);
  // }

  // function getAllCrewCredits() {
  //   setcrewlimit(crew.length);
  // }

  const { userPrefrence }: any = useContext(userPrefrenceContext);
  const excludedCharacters = [
    "Self",
    "Herself",
    "Host",
    "Self - Host",
    "",
    "Guest Star",
    "Himself",
    "Self - Special Guest",
    "Self - Guest",
  ];

  return (
    <div className="grid grid-cols-5 gap-3 ">
      {cast?.map((data: any) => (
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
                {/* <p className="text-xs mb-2 ">
                {data.release_date || data.first_air_date}
              </p>
              <div className=" mb-4 text-xs">
                <GenreName genreids={data.genre_ids} />
              </div> */}
                {/* <div className="mt-1 ">
                <Staring id={data.id} type={data.media_type} />
              </div> */}
              </div>
            </div>
          </div>
        </div>
      ))}
      {/* {filteredCast.length <= limit ? (
        <div className="col-span-5 px-3 py-2 rounded bg-neutral-800">end.</div>
      ) : (
        <button
          className="col-span-5 px-3 py-2 rounded bg-neutral-800 hover:bg-neutral-700"
          onClick={getAllCredits}
        >
          More..
        </button>
      )} */}
      {crew.length >= 1 && (
        <h3 className=" col-span-5 p-3 font-semibold">In prod. ~ crew</h3>
      )}
      {/* {crew.length > crewlimit ? (
        <button
          className="col-span-5 px-3 py-2 rounded bg-neutral-800 hover:bg-neutral-700"
          onClick={getAllCrewCredits}
        >
          Off Staring Credits
        </button>
      ) : (
        <></>
      )} */}

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
            {/* <div className="p-4 flex flex-row gap-5 absolute bottom-4 right-3 transform  opacity-0 group-hover:-translate-x-11 group-hover:opacity-100 transition-transform duration-500">
              <CardMovieButton
                movieId={data.id}
                text={"watched"}
                icon={<IoEyeOutline />}
              />
              <CardMovieButton
                movieId={data.id}
                text={"watched"}
                icon={<FcLike />}
              />
              <CardMovieButton
                movieId={data.id}
                text={"save"}
                icon={<CiSaveDown1 />}
              />
            </div> */}
          </div>
        </div>
      ))}
    </div>
  );
}

export default personCredits;
