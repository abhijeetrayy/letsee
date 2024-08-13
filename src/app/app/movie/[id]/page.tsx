import CardMovieButton from "@/components/buttons/cardButtons";
import Link from "next/link";
import { CiSaveDown1 } from "react-icons/ci";
import { FcLike } from "react-icons/fc";
import { IoEyeOutline } from "react-icons/io5";
import ThreeUserPrefrenceBtn from "@/components/buttons/threePrefrencebtn";
import { Countrydata } from "@/staticData/countryName";

// import { likedButton as LikedButton } from "@/components/buttons/intrectionButton";
async function getMovieDetails(id: any) {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.TMDB_API_KEY}`
  );

  const data = await response.json();
  return data;
}

async function getCredit(id: any) {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${process.env.TMDB_API_KEY}`
  );

  const data = await response.json();
  return data;
}
async function getVideos(id: any) {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${process.env.TMDB_API_KEY}`
  );

  const data = await response.json();
  return data;
}
async function getImages(id: any) {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${id}/images
?api_key=${process.env.TMDB_API_KEY}`
  );

  const data = await response.json();
  return data;
}

const MovieDetails = async ({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {
  const { id }: any = params;
  const movie = await getMovieDetails(id);
  const credits = await getCredit(id);
  const { results: videos } = await getVideos(id);
  const { posters: Pimages, backdrops: Bimages } = await getImages(id);
  const CountryName: any = Countrydata.filter(
    (item: any) => item.iso_3166_1 == movie.origin_country
  );

  return (
    <div className="flex flex-col items-center justify-center text-white relative  w-full">
      {/* Poster Image as Background */}

      {/* Content */}
      <div className="relative flex flex-col items-center justify-center w-full min-h-[550px] h-full">
        <div className="md:absolute w-full  h-full overflow-hidden">
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
                : "/backgroundjpeg.jpeg"
            }`}
            width={300}
            height={300}
            alt=""
          />
        </div>
        <div className="max-w-6xl w-full relative  z-10  flex flex-col md:flex-row  gap-5">
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
            <div>
              <h1 className="text-4xl font-bold  mb-4">
                {movie?.adult && (
                  <span className="text-sm px-3 py-1 rounded-md m-2 bg-red-600 text-white z-20">
                    Adult
                  </span>
                )}
                {movie.title}
              </h1>
              <p className="my-2 text-sm">
                country: {CountryName[0].english_name}
              </p>
              <ThreeUserPrefrenceBtn
                cardId={movie.id}
                cardType={"movie"}
                cardName={movie.name || movie.title}
                cardAdult={movie.adult}
                cardImg={movie.poster_path || movie.backdrop_path}
              />
              <p className="text-md my-2 text-neutral-300">
                {movie.runtime} min.
              </p>
              <p className="text-base mb-2" text-neutral-300>
                {movie.release_date}
              </p>
              <div className="flex gap-2 mb-4 text-neutral-300">
                <span>Director: </span>
                {credits?.crew
                  ?.filter((credit: any) => credit.job === "Director")
                  .map((item: any) => (
                    <Link
                      className={"hover:underline"}
                      href={`/app/person/${item.id}-${item.name
                        .trim()
                        .replace(/[^a-zA-Z0-9]/g, "-")
                        .replace(/-+/g, "-")}`}
                      key={item.id}
                    >
                      {item.name}
                    </Link>
                  ))}
              </div>
              <div className=" mb-4 text-neutral-300">
                <div className="mb-2 mr-2 inline-block">Genre:</div>
                {movie?.genres?.map((item: any) => (
                  <Link
                    href={`/app/moviebygenre/list/${item.id}-${item.name
                      .trim()
                      .replace(/[^a-zA-Z0-9]/g, "-")
                      .replace(/-+/g, "-")}`}
                    key={item.id}
                    className="inline-block mr-2 bg-gray-800 hover:bg-gray-700 px-2 py-1 rounded"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>

              <div className="mb-4 flex flex-row gap-1 text-neutral-300">
                <span>Production: </span>
                <div className="">
                  {movie?.production_companies
                    ?.slice(0, 5)
                    .map((item: any, index: number) =>
                      movie?.production_companies?.slice(0, 5).length - 1 >
                      index ? (
                        <div
                          key={item.id}
                          className={" inline-block  px-1 whitespace-nowrap"}
                        >
                          {item.name},
                        </div>
                      ) : (
                        <div
                          key={item.id}
                          className={" inline-block px-1 whitespace-nowrap"}
                        >
                          {item.name}
                        </div>
                      )
                    )}
                </div>
              </div>

              <p className="mb-4 text-neutral-300">
                {movie.overview.slice(0, 300)}
                {movie.overview.slice(0, 300) && ".."}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl w-full">
        <div className="mt-7">
          <h2 className="text-lg ">Cast</h2>
          <div className="overflow-x-scroll vone-scrollbar">
            <div className="flex flex-row gap-3 m-3 rounded-md">
              {credits?.cast.slice(0, 6).map((item: any) => (
                <Link
                  title={item.name}
                  key={item.id}
                  href={`/app/person/${item.id}-${item.name
                    .trim()
                    .replace(/[^a-zA-Z0-9]/g, "-")
                    .replace(/-+/g, "-")}`}
                  className="group rounded-md h-full max-w-44 lg:max-w-56 w-full  bg-indigo-600 lg:bg-inherit lg:hover:bg-indigo-600"
                >
                  <img
                    className=" min-w-44 lg:min-w-52 h-56 rounded-md object-cover"
                    src={
                      item.profile_path
                        ? `https://image.tmdb.org/t/p/w185${item.profile_path}`
                        : "/avatar.svg"
                    }
                    alt={item.name}
                  />

                  {item.name.length > 14 ? (
                    <p className="break-words lg:opacity-0 group-hover:opacity-100 ml-2">
                      {item.name.slice(0, 13)}..
                    </p>
                  ) : (
                    <p className=" lg:opacity-0 group-hover:opacity-100 ml-2">
                      {item.name}
                    </p>
                  )}
                </Link>
              ))}

              <div className="   ml-3">
                <Link
                  href={`/app/movie/${id}/cast`}
                  className="flex justify-center items-center w-44   h-56 border-2 border-neutral-500 hover:border-indigo-600 hover:bg-neutral-800 rounded-md"
                >
                  more..
                </Link>
                <p className=" opacity-0 ml-2">""</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {videos.filter((item: any) => item.site === "YouTube").length > 0 && (
        <div className="max-w-7xl w-full   ">
          <h1 className="text-sm lg:text-lg my-2 ">{movie.title}: Media</h1>

          <div className="w-full max-w-7xl m-auto flex flex-row overflow-x-scroll vone-scrollbar my-3">
            {videos
              .filter((item: any) => item.site === "YouTube")
              ?.slice(0, 4)
              .map((item: any) => (
                <iframe
                  key={item.id} // Add a key to avoid React warnings
                  className="min-w-96 max-w-96 w-full  aspect-video mb-6"
                  src={`https://www.youtube.com/embed/${item.key}`} // Use item.key instead of item.id
                  title={item.name}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ))}
          </div>
        </div>
      )}
      {(Bimages.length > 0 || Pimages.length > 0) && (
        <div className="max-w-7xl w-full   ">
          <h1 className="text-md md:text-lg my-2 ">{movie.title}: Images</h1>

          <div className="w-full max-w-7xl m-auto flex flex-row gap-3 overflow-x-scroll vone-scrollbar my-3">
            {Bimages.length > 0
              ? Bimages?.slice(0, 15).map((item: any) => (
                  <img
                    key={item.id} // Add a key to avoid React warnings
                    className="max-h-96 min-h-64 h-full w-fit"
                    src={
                      movie.adult
                        ? "/pixeled.jpg"
                        : `https://image.tmdb.org/t/p/w300${item.file_path}`
                    } // Use item.key instead of item.id
                    alt={item.name}
                  />
                ))
              : Pimages?.slice(0, 15).map((item: any) => (
                  <img
                    key={item.id} // Add a key to avoid React warnings
                    className="max-h-96 min-h-64 h-full w-fit"
                    src={
                      movie.adult
                        ? "/pixeled.jpg"
                        : `https://image.tmdb.org/t/p/w185${item.file_path}`
                    } // Use item.key instead of item.id
                    alt={item.name}
                  />
                ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetails;
