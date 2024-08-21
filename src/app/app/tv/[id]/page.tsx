import ThreePrefrenceBtn from "@/components/buttons/threePrefrencebtn";
import Link from "next/link";
import { LiaImdb } from "react-icons/lia";

async function getShowDetails(id: string) {
  const response = await fetch(
    `https://api.themoviedb.org/3/tv/${id}?api_key=${process.env.TMDB_API_KEY}`
  );

  const data = await response.json();
  return data;
}
async function getShowCredit(id: string) {
  const response = await fetch(
    `https://api.themoviedb.org/3/tv/${id}/credits?api_key=${process.env.TMDB_API_KEY}&language=en-US`
  );

  const data = await response.json();
  return data;
}
async function getVideos(id: any) {
  const response = await fetch(
    `https://api.themoviedb.org/3/tv/${id}/videos?api_key=${process.env.TMDB_API_KEY}`
  );

  const data = await response.json();
  return data;
}
async function getImages(id: any) {
  const response = await fetch(
    `https://api.themoviedb.org/3/tv/${id}/images?api_key=${process.env.TMDB_API_KEY}`
  );

  const data = await response.json();
  return data;
}

async function getExternalIds(id: any) {
  const response = await fetch(
    `https://api.themoviedb.org/3/tv/${id}/external_ids?api_key=${process.env.TMDB_API_KEY}`
  );

  const data = await response.json();
  return data;
}

const ShowDetails = async ({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {
  const { id } = params;
  const show = await getShowDetails(id);
  const ExternalIDs = await getExternalIds(id);
  const { cast, crew } = await getShowCredit(id);
  const { results: videos } = await getVideos(id);
  const { posters: Pimages, backdrops: Bimages } = await getImages(id);

  return (
    <div className="text-white relative w-full flex flex-col gap-3 items-center justify-center">
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
              show.backdrop_path && !show.adult
                ? `https://image.tmdb.org/t/p/w300${show.backdrop_path}`
                : "/backgroundjpeg.jpeg"
            }`}
            width={300}
            height={300}
            alt=""
          />
        </div>

        <div className="max-w-6xl w-full relative  z-10  flex flex-col md:flex-row  gap-5">
          <div className="md:flex-1 w-fit m-auto">
            <img
              className="min-h[500px] rounded-md"
              src={
                show.adult
                  ? "/pixeled.jpg"
                  : `https://image.tmdb.org/t/p/w342${show.poster_path}`
              }
              alt={show.name}
            />
          </div>
          <div className="md:flex-[2]">
            <h1 className="text-4xl font-bold mb-4">
              {" "}
              {show?.adult && (
                <span className="text-sm px-3 py-1 rounded-md m-2 bg-red-600 text-white z-20">
                  Adult
                </span>
              )}
              {show.name}
              <span className="text-sm ml-1">-Tv</span>
            </h1>
            <div className=" w-full bg-neutral-900 rounded-md overflow-hidden my-2">
              <ThreePrefrenceBtn
                cardId={show.id}
                cardType={"tv"}
                cardName={show.name || show.title}
                cardAdult={show.adult}
                cardImg={show.poster_path || show.backdrop_path}
              />
            </div>
            {show?.popularity && (
              <div className="my-2">
                Popularity:{" "}
                <span className="text-green-600 font-bold">
                  {show.popularity}
                </span>
              </div>
            )}
            {ExternalIDs?.imdb_id && (
              <div className="flex flex-row items-center gap-2">
                <LiaImdb className="text-4xl" />:
                <Link
                  target="_blank"
                  href={`https://imdb.com/title/${ExternalIDs.imdb_id}`}
                >
                  {show.name}
                </Link>
              </div>
            )}

            <p className=" mb-4 text-gray-400">{show.overview}</p>
            <p className=" text-gray-400 mb-2">
              First Air Date: {show.first_air_date}
            </p>
            <p className=" text-gray-400  mb-2">
              Last Air Date: {show.last_air_date}
            </p>
            <p className=" text-gray-400  mb-2">Status: {show.status}</p>
            <p className=" text-gray-400  mb-2">
              Number of Seasons: {show.number_of_seasons}
            </p>
            <p className=" text-gray-400 mb-2">
              Number of Episodes: {show.number_of_episodes}
            </p>
            <div className="mb-4 flex flex-row gap-2 text-gray-400">
              <div>Genres: </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {show.genres.map((genre: any) => (
                  <Link
                    className="px-2 py-1 text-gray-300 bg-neutral-700 hover:bg-neutral-500  rounded-md"
                    href={`/app/tvbygenre/list/${genre.id}-${genre.name}`}
                    key={genre.id}
                  >
                    {genre.name}
                    {/* {index < show.genres.length - 1 && ", "} */}
                  </Link>
                ))}
              </div>
            </div>
            {/* <div className="mb-4  text-gray-400">
              <span>Staring: </span>
              {cast?.slice(0, 5).map((item: any, index: number) =>
                cast?.slice(0, 5).length - 1 > index ? (
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
            </div> */}

            <div className="mb-4  text-gray-400">
              <span>Created by: </span>
              {show.created_by.map((creator: any, index: number) => (
                <Link
                  className="hover:underline"
                  href={`/app/person/${creator.id}-${creator.name
                    .trim()
                    .replace(/[^a-zA-Z0-9]/g, "-")
                    .replace(/-+/g, "-")}`}
                  key={creator.id}
                >
                  {creator.name}
                  {index < show.created_by.length - 1 && ", "}
                </Link>
              ))}
            </div>
            <div className="mb-4  text-gray-400">
              <span>Production Companies: </span>
              {show.production_companies.map((company: any, index: number) => (
                <span className="break-words" key={company.id}>
                  {company.name}
                  {index < show.production_companies.length - 1 && ", "}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl w-full">
        <div className="mt-7">
          <h2 className="text-lg ">Cast</h2>
          <div className=" ">
            <div className="flex flex-row gap-3 m-3 overflow-x-scroll no-scrollbar">
              {cast.slice(0, 6).map((item: any) => (
                <Link
                  title={item.name}
                  key={item.id}
                  href={`/app/person/${item.id}-${item.name
                    .trim()
                    .replace(/[^a-zA-Z0-9]/g, "-")
                    .replace(/-+/g, "-")}`}
                  className="group min-w-fit rounded-md overflow-hidden  bg-indigo-600 lg:bg-inherit lg:hover:bg-indigo-600"
                >
                  <img
                    className=" w-24 md:w-44   rounded-md h-32 md:h-56  object-cover"
                    src={
                      item.profile_path
                        ? `https://image.tmdb.org/t/p/w185${item.profile_path}`
                        : "/avatar.svg"
                    }
                    alt={item.name}
                  />

                  <span>
                    {item.name.length > 15 ? (
                      <p className="hidden md:block  break-words lg:opacity-0 group-hover:opacity-100 ml-2 mt-1">
                        {item.name.slice(0, 13)}..
                      </p>
                    ) : (
                      <p className="hidden md:block break-words lg:opacity-0 group-hover:opacity-100 ml-2 mt-1  ">
                        {item.name}
                      </p>
                    )}
                    {item.name.length > 13 ? (
                      <p className="text-xs md:hidden break-words lg:opacity-0 group-hover:opacity-100 ml-2 mt-1">
                        {item.name.slice(0, 11)}..
                      </p>
                    ) : (
                      <p className="text-xs md:hidden  break-words lg:opacity-0 group-hover:opacity-100 ml-2 mt-1  ">
                        {item.name}
                      </p>
                    )}
                  </span>
                </Link>
              ))}

              <div className="">
                <Link
                  href={`/app/tv/${id}/cast`}
                  className=" flex justify-center items-center  w-24 md:w-44 h-32 md:h-56 border-2 border-neutral-500 hover:border-indigo-600 hover:bg-neutral-800 rounded-md"
                >
                  more..
                </Link>
                <p className=" opacity-0 ml-2">""</p>
              </div>
            </div>
          </div>
          <div className="mt-4 md:mt-2 mb-5 w-fit m-auto cursor-default">
            {"<- "} {" ->"}
          </div>
        </div>
      </div>
      <div className="flex flex-row gap-4 my-4 w-full max-w-5xl overflow-x-scroll vone-scrollbar">
        {show.seasons
          .filter((item: any) => item.name !== "Specials")
          .map((season: any) => (
            <div key={season.id} className="flex flex-col gap-4">
              <img
                src={`${
                  season.poster_path
                    ? show.adult
                      ? "/pixeled.jpg"
                      : `https://image.tmdb.org/t/p/w185${season.poster_path}`
                    : "/no-photo.jpg"
                }`}
                className="min-w-44 max-w-44 h-full object-cover"
                alt={season.name}
              />
              <div>
                <h2 className="text-sm md:text-base font-bold">
                  {season.name}
                </h2>
                {/* <p className="text- text-gray-400">
                {season.overview.slice(0, 200)} ..
              </p> */}
                <p className="text-sm text-gray-400">{season.air_date}</p>
                <p className="text-sm text-gray-400">
                  Ep: {season.episode_count}
                </p>
                {/* <p className="text- text-gray-400">
                Average Vote: {season.vote_average}
              </p> */}
              </div>
            </div>
          ))}
      </div>
      {videos.filter((item: any) => item.site === "YouTube").length > 0 && (
        <div className="max-w-6xl w-full  mt-10 ">
          <h1 className="text-md md:text-lg my-2 ">{show.name}: Media</h1>

          <div className="w-full max-w-7xl m-auto flex flex-row overflow-x-scroll no-scrollbar my-3">
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
          <div className="mt-4 md:mt-2 mb-5 w-fit m-auto cursor-default">
            {"<- "} {" ->"}
          </div>
        </div>
      )}
      {(Bimages.length > 0 || Pimages.length > 0) && (
        <div className="max-w-6xl w-full  mt-4 ">
          <h1 className="text-md md:text-lg my-2 ">{show.name}: Images</h1>

          <div className="max-w-7xl w-full m-auto my-3 overflow-x-auto no-scrollbar">
            <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 m-auto w-fit gap-3 pb-3 snap-x snap-mandatory">
              {Bimages.length > 0
                ? Bimages?.slice(0, 13).map((item: any) => (
                    <img
                      key={item.id} // Add a key to avoid React warnings
                      className="max-h-96  h-full object-cover mb-3"
                      src={
                        show.adult
                          ? "/pixeled.jpg"
                          : `https://image.tmdb.org/t/p/w300${item.file_path}`
                      } // Use item.key instead of item.id
                      alt={item.name}
                    />
                  ))
                : Pimages?.slice(0, 15).map((item: any) => (
                    <img
                      key={item.id} // Add a key to avoid React warnings
                      className="max-h-96  h-full object-cover mb-3"
                      src={`show.adult ? "/pixeled.jpg" : https://image.tmdb.org/t/p/w185${item.file_path}`} // Use item.key instead of item.id
                      alt={item.name}
                    />
                  ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowDetails;
