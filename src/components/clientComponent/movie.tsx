"use client";
import React, { useState } from "react";
import ThreeUserPrefrenceBtn from "@components/buttons/threePrefrencebtn";
import { LiaImdb } from "react-icons/lia";
import Link from "next/link";
import MovieCast from "@components/movie/MovieCast";
import Video from "@components/movie/Video";
import { LuSend } from "react-icons/lu";
import SendMessageModal from "@components/message/sendCard";
import ImdbRating from "@components/movie/imdbRating";
import ImageViewer from "@components/clientComponent/ImaeViewer";

export default function Movie({
  CountryName,
  movie,
  Bimages,
  Pimages,
  credits,
  videos,
  id,
}: any) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cardData, setCardData] = useState([]) as any;
  const [showFullOverview, setShowFullOverview] = useState(false);

  const handleCardTransfer = (data: any) => {
    setCardData(data);
    setIsModalOpen(true);
  };

  const toggleOverview = () => {
    setShowFullOverview(!showFullOverview);
  };

  return (
    <div>
      <SendMessageModal
        media_type={"movie"}
        data={cardData}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      <div className="text-white relative w-full bg-neutral-900">
        {/* Background Image */}
        <div className="relative flex flex-col items-center justify-center w-full min-h-[550px] h-full">
          <div className="md:absolute w-full h-full overflow-hidden">
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
              className="hidden md:flex object-cover w-full h-full opacity-20"
              src={`${
                movie.backdrop_path && !movie.adult
                  ? `https://image.tmdb.org/t/p/w300${movie.backdrop_path}`
                  : "/backgroundjpeg.webp"
              }`}
              width={300}
              height={300}
              alt=""
            />
          </div>

          {/* Movie Content */}
          <div className="max-w-[1520px] w-full relative z-10 flex flex-col md:flex-row gap-8 my-4 px-4">
            {/* Poster */}
            <div className="flex-1 ">
              <img
                className="rounded-md w-fit h-full max-h-[600px] shadow-lg md:float-right"
                src={`${
                  movie.poster_path && !movie.adult
                    ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
                    : movie.adult
                    ? "/pixeled.webp"
                    : "/no-photo.webp"
                }`}
                width={500}
                height={500}
                alt={movie.title}
              />
            </div>

            {/* Movie Details */}
            <div className="flex-[2] w-full">
              <h1 className="text-4xl font-bold mb-4">
                {movie?.adult && (
                  <span className="text-sm px-3 py-1 rounded-md m-2 bg-red-600 text-white z-20">
                    Adult
                  </span>
                )}
                {movie.title}
                <span className="text-sm ml-1">-movie</span>
              </h1>

              {/* Country */}
              <div className="flex flex-row gap-2 my-2 text-sm text-neutral-300">
                <div>Country: </div>
                <div>
                  {CountryName.slice(0, 2).map((item: any, index: number) => (
                    <p key={index} className="">
                      {item[0].english_name}
                    </p>
                  ))}
                </div>
              </div>

              {/* Buttons */}
              <ThreeUserPrefrenceBtn
                genres={movie.genres.map((genre: any) => genre.name)}
                cardId={movie.id}
                cardType={"movie"}
                cardName={movie.name || movie.title}
                cardAdult={movie.adult}
                cardImg={movie.poster_path || movie.backdrop_path}
              />

              {/* Send Message Button */}
              <div className="py-2 border-t border-neutral-700 bg-neutral-700 hover:bg-neutral-600 transition-colors rounded-b-md">
                <button
                  className="w-full flex justify-center text-lg text-center hover:text-neutral-400 transition-colors"
                  onClick={() => handleCardTransfer(movie)}
                >
                  <LuSend />
                </button>
              </div>

              {/* Popularity */}
              {movie?.popularity && (
                <div className="my-4 text-neutral-300">
                  Popularity:{" "}
                  <span className="text-green-600 font-bold">
                    {movie.popularity}
                  </span>
                </div>
              )}

              {/* IMDb Link */}
              {movie?.imdb_id && (
                <div className="flex flex-row items-center gap-2 my-4 text-neutral-300">
                  <LiaImdb className="text-4xl" />
                  <Link
                    target="_blank"
                    href={`https://imdb.com/title/${movie.imdb_id}`}
                    className="hover:underline"
                  >
                    <ImdbRating id={movie.imdb_id} />
                  </Link>
                </div>
              )}

              {/* Runtime and Release Date */}
              <div className="flex flex-row gap-4 my-4 text-neutral-300">
                <p>{movie.runtime} min.</p>
                <p>{movie.release_date}</p>
              </div>

              {/* Director */}

              {credits?.crew
                ?.filter((credit: any) => credit.job === "Director")
                .map((item: any, index: number) => (
                  <div key={index} className="flex gap-2 my-4 text-neutral-300">
                    <span>Director: </span>
                    <Link
                      className="hover:underline"
                      href={`/app/person/${item.id}-${item.name
                        .trim()
                        .replace(/[^a-zA-Z0-9]/g, "-")
                        .replace(/-+/g, "-")}`}
                    >
                      {item.name}
                    </Link>
                  </div>
                ))}

              {/* Genres */}
              {
                <div className="my-4 flex flex-row gap-2">
                  <div className="text-neutral-300 mb-2">Genre:</div>
                  <div className="flex flex-wrap gap-1">
                    {movie?.genres?.map((item: any, index: number) => (
                      <Link
                        href={`/app/moviebygenre/list/${item.id}-${item.name
                          .trim()
                          .replace(/[^a-zA-Z0-9]/g, "-")
                          .replace(/-+/g, "-")}`}
                        key={index}
                        className="px-3 py-1 bg-blue-800 hover:bg-neutral-700 rounded-full text-sm transition-colors"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              }

              {/* Production Companies */}
              {movie?.production_companies.length !== 0 && (
                <div className="my-4 text-neutral-300">
                  <span>Production: </span>
                  <div className="flex flex-wrap gap-1">
                    {movie?.production_companies
                      ?.slice(0, 5)
                      .map((item: any, index: number) => (
                        <div
                          key={index}
                          className="inline-block hover:underline"
                        >
                          {item.name}
                          {index < movie.production_companies.length - 1 && ","}
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Overview */}
              <div className="my-4 text-neutral-300">
                <p>
                  {showFullOverview
                    ? movie.overview
                    : movie.overview.slice(0, 300)}
                  {movie.overview.length > 300 && !showFullOverview && "..."}
                </p>
                {movie.overview.length > 300 && (
                  <button
                    onClick={toggleOverview}
                    className="text-blue-500 hover:text-blue-400 mt-2"
                  >
                    {showFullOverview ? "Read Less" : "Read More"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Movie Cast */}
        <MovieCast credits={credits?.cast} id={id} type={"movie"} />

        {/* Videos */}
        <Video videos={videos} movie={movie} />

        <ImageViewer movie={movie} Bimages={Bimages} Pimages={Pimages} />
      </div>
    </div>
  );
}
