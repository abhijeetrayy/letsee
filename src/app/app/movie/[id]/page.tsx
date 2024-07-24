import Image from "next/image";
import Link from "next/link";
import BackPic from "../../../../../public/backgroundjpeg.jpeg";
import NoPhoto from "../../../../../public/no-photo.jpg";
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
    <div className="flex justify-center text-white relative  w-full">
      {/* Poster Image as Background */}


      {/* Content */}
      <div className="flex flex-col items-center relative max-w-[2100px] w-full p-8">
        <div className="absolute bg-black top-0 left-0 w-full max-h-[660px] z-0 overflow-y-clip">
          <Image
            className="object-cover opacity-10 w-full"
            src={
              movie.backdrop_path
                ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
                : BackPic
            }
            width={300}
            height={300}
            alt=""
            quality={30}
          />
        </div>
        <div className="max-w-7xl relative z-10 px-3 flex flex-row gap-5 h-full">

          <div className="flex-1">
            <Image
              className="w-full rounded-sm"
              src={
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/original${movie.poster_path}`
                  : NoPhoto
              }
              width={500}
              height={500}
              alt=""
              quality={30}
            />
          </div>
          <div className="mt-3 flex-[2]">
            <div>
              <h1 className="text-4xl font-bold mb-4">{movie.title}</h1>
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
              <div className="text-2xl font-bold">Reviews</div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default MovieDetails;
