import React from "react";
import Image from "next/image";
import Link from "next/link";
import NoPhoto from "../../../../public/no-photo.jpg";
import GenreName from "@/components/server/genreConvert";
import CardMovieButton from "@/components/buttons/cardMovieButton";
import { CiSaveDown1 } from "react-icons/ci";
import { FcLike } from "react-icons/fc";
import Staring from "@/components/person/server/staringCredit";
function personCredits({ cast, crew, name }: any) {
  return (
    <div className="grid grid-cols-5 gap-3 ">
      {cast?.map((data: any) => (
        <div className="" key={data.id}>
          <div className=" relative group flex flex-col  bg-black mr-2.5 w-full h-[320px] text-gray-300 rounded-md border border-gray-800  duration-300  hover:scale-105 hover:z-50">
            <div className="absolute top-0 left-0 z-50">
              <p className="p-1 bg-black text-white rounded-br-md text-sm">
                {data.media_type}
              </p>
            </div>
            <div className="absolute top-0 right-0 z-50">
              <p className="p-1 bg-indigo-500 text-white rounded-bl-md text-sm">
                Staring
              </p>
            </div>
            <Image
              className="relative rounded-md object-cover w-full h-full group-hover:opacity-20"
              src={
                data.poster_path || data.backdrop_path
                  ? `https://image.tmdb.org/t/p/original${
                      data.poster_path || data.backdrop_path
                    }`
                  : NoPhoto
              }
              width={200}
              height={200}
              quality={40}
              alt={data.title}
            />
            <span className="opacity-0 flex flex-col gap-2  hlimitSearch px-4 absolute bottom-3  translate-y-0 duration-300 group-hover:opacity-100 group-hover:bottom-24 group-hover:bg-transparent  group-hover:text-gray-200 ">
              <div className="mb-1">
                <Link
                  className="group-hover:underline"
                  href={
                    data.media_type == "tv"
                      ? `/app/tv/${data.id}`
                      : `/app/movie/${data.id}`
                  }
                >
                  {data.title || data.name}
                </Link>
              </div>
              <p className="text-xs mb-2 ">
                {data.release_date || data.first_air_date}
              </p>
              <div className=" mb-4 text-xs">
                {data.genre_ids.map((item: any) => (
                  <GenreName genreid={item} />
                ))}
              </div>
              <div className="mt-1">
                <Staring id={data.id} type={data.media_type} />
              </div>
            </span>
            <div className="p-4 flex flex-row gap-5 absolute bottom-4 right-3 transform  opacity-0 group-hover:-translate-x-20 group-hover:opacity-100 transition-transform duration-500">
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
            </div>
          </div>
        </div>
      ))}
      {crew.length >= 1 && (
        <h3 className=" col-span-5 p-3 font-semibold">In prod. ~ crew</h3>
      )}
      {crew?.map((data: any) => (
        <div className="" key={data.id}>
          <div className=" relative group flex flex-col  bg-black mr-2.5 w-full h-[320px] text-gray-300 rounded-md border border-gray-800  duration-300  hover:scale-105 hover:z-50">
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
            <Image
              className="relative rounded-md object-cover w-full h-full group-hover:opacity-20"
              src={
                data.poster_path || data.backdrop_path
                  ? `https://image.tmdb.org/t/p/original${
                      data.poster_path || data.backdrop_path
                    }`
                  : NoPhoto
              }
              width={200}
              height={200}
              quality={40}
              alt={data.title}
            />
            <span className="opacity-0 flex flex-col gap-3  hlimitSearch px-4 absolute bottom-3  translate-y-0 duration-300 group-hover:opacity-100 group-hover:bottom-24 group-hover:bg-transparent  group-hover:text-gray-200 ">
              <div className="mb-1">
                <Link
                  className="group-hover:underline text-lg"
                  href={
                    data.media_type == "tv"
                      ? `/app/tv/${data.id}`
                      : `/app/movie/${data.id}`
                  }
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
            <div className="p-4 flex flex-row gap-5 absolute bottom-4 right-3 transform  opacity-0 group-hover:-translate-x-20 group-hover:opacity-100 transition-transform duration-500">
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
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default personCredits;
