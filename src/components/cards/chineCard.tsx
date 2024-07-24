import React from 'react'
import CardMovieButton from '../buttons/cardMovieButton'
import { FcLike } from 'react-icons/fc'
import { CiSaveDown1 } from 'react-icons/ci'
import { IoEyeOutline } from "react-icons/io5";

import Image from 'next/image'
import Link from 'next/link'



function chineCard({ movie }: any) {
    return (
        <div><div
            key={movie.id}
            className=" relative group flex flex-col  bg-black mr-2.5 max-w-72 min-h-64 text-gray-300 rounded-md border border-gray-800  duration-300  hover:scale-105 hover:z-50"
        >
            <img
                className="rounded-md w-full h-full group-hover:opacity-30"
                src={`https://image.tmdb.org/t/p/original${movie.file_path}`}

                alt={movie.name}
            />
            <span className=" flex flex-col gap-3  hlimit px-4 absolute bottom-3  translate-y-0 duration-300 group-hover:bottom-20 group-hover:text-white group-hover:text-sm">
                <div className="mb-1">
                    <Link
                        className="group-hover:underline"
                        href={`/app/movie/${movie.name}`}
                    >
                        {movie.name}
                    </Link>
                </div>
                <p className="text-xs mb-1 group-hover:text-[10px]">
                    {movie.date}
                </p>
                {/* <p className=" text-xs group-hover:text-[10px]">
                    {movie.overview}
                </p> */}
            </span>
            <div className="p-4 flex flex-row gap-5 absolute bottom-4 right-3 transform  opacity-0 group-hover:-translate-x-28 group-hover:opacity-100 transition-transform duration-500">
                <CardMovieButton
                    movieId={movie.id}
                    text={"watched"}
                    icon={<IoEyeOutline />}
                />
                <CardMovieButton
                    movieId={movie.id}
                    text={"watched"}
                    icon={<FcLike />}
                />
                <CardMovieButton
                    movieId={movie.id}
                    text={"save"}
                    icon={<CiSaveDown1 />}
                />
            </div>
        </div></div>
    )
}

export default chineCard