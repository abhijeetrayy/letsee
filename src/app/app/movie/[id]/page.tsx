import Link from "next/link";

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

  return (
    <div className="flex flex-col items-center justify-center text-white relative  w-full">
      {/* Poster Image as Background */}

      {/* Content */}
      <div className="flex flex-col items-center relative  w-full p-8">
        <div className="absolute flex justify-center bg-black top-0 left-0 w-full max-h-[660px] z-0 overflow-y-clip">
          <img
            className="object-cover opacity-10 w-full max-w-[2100px] max-h-[550px]"
            src={`${
              movie.backdrop_path && !movie.adult
                ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
                : "/backgroundjpeg.jpeg"
            }`}
            width={300}
            height={300}
            alt=""
          />
        </div>
        <div className="max-w-7xl relative z-10 px-3 flex flex-row gap-5 h-full">
          <div className="flex-1">
            <img
              className="w-full rounded-sm max-h-[600px]"
              src={`${
                movie.poster_path && !movie.adult
                  ? `https://image.tmdb.org/t/p/original${movie.poster_path}`
                  : movie.adult
                  ? "/pixeled.jpg"
                  : "/no-photo.jpg"
              }`}
              width={500}
              height={500}
              alt=""
            />
          </div>
          <div className="mt-3 flex-[2]">
            <div>
              <h1 className="text-4xl font-bold  mb-4">{movie.title}</h1>

              <p className="text-md mb-2">{movie.runtime} min.</p>
              <p className="text-base mb-2">{movie.release_date}</p>
              <div className="flex gap-2 mb-4">
                <span>Director: </span>
                {credits?.crew
                  ?.filter((credit: any) => credit.job === "Director")
                  .map((item: any) => (
                    <Link
                      className={"hover:underline"}
                      href={`/app/person/${item.id}`}
                      key={item.id}
                    >
                      {item.name}
                    </Link>
                  ))}
              </div>
              <div className=" mb-4">
                <div className="mb-2 mr-2 inline-block">Genre:</div>
                {movie?.genres?.map((item: any) => (
                  <Link
                    href={""}
                    key={item.id}
                    className="inline-block mr-2 bg-gray-800 px-2 py-1 rounded"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <div className="mb-4 flex flex-row gap-1">
                <span>Cast: </span>
                <div className="">
                  {credits?.cast?.slice(0, 5).map((item: any, index: number) =>
                    credits?.cast?.slice(0, 5).length - 1 > index ? (
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
                </div>
              </div>

              <div className="mb-4 flex flex-row gap-1">
                <span>Production: </span>
                <div className="">
                  {movie?.production_companies
                    ?.slice(0, 5)
                    .map((item: any, index: number) =>
                      movie?.production_companies?.slice(0, 5).length - 1 >
                      index ? (
                        <Link
                          key={item.id}
                          className={
                            " inline-block hover:underline  px-1 whitespace-nowrap"
                          }
                          href={""}
                        >
                          {item.name},
                        </Link>
                      ) : (
                        <Link
                          key={item.id}
                          className={
                            " inline-block hover:underline px-1 whitespace-nowrap"
                          }
                          href={""}
                        >
                          {item.name}
                        </Link>
                      )
                    )}
                </div>
              </div>

              <p className="mb-4">{movie.overview}</p>
            </div>
            <div>
              <div className="text-2xl ">Reviews</div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl w-full">
        <div>
          <h2>Cast</h2>
          <div>
            <div className="grid grid-cols-7 m-3 rounded-md">
              {credits?.cast.slice(0, 6).map((item: any) => (
                <Link
                  href={`/app/person/${item.id}`}
                  className="group hover:bg-indigo-600"
                >
                  <img
                    className="w-52 h-56 object-cover"
                    src={
                      item.profile_path
                        ? `https://image.tmdb.org/t/p/original${item.profile_path}`
                        : "/avatar.svg"
                    }
                    alt=""
                  />
                  <p className=" opacity-0 group-hover:opacity-100 ml-2">
                    {item.name}
                  </p>
                </Link>
              ))}

              <div className="   ml-3">
                <Link
                  href={`/app/movie/${id}/cast`}
                  className="flex justify-center items-center w-full h-56 border-2 border-neutral-500 hover:border-indigo-600 hover:bg-neutral-800 rounded-md"
                >
                  more..
                </Link>
                <p className=" opacity-0 ml-2">""</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
