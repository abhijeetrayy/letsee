import ThreePrefrenceBtn from "@/components/buttons/threePrefrencebtn";
import Link from "next/link";

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

const ShowDetails = async ({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {
  const { id } = params;
  const show = await getShowDetails(id);
  console.log(show);
  const { cast, crew } = await getShowCredit(id);
  console.log(cast, crew);

  return (
    <div className="text-white relative w-full flex flex-col gap-3 items-center justify-center">
      {/* Poster Image as Background */}

      {/* Content */}
      <div className="relative w-full flex flex-col  overflow-y-clip justify-center items-center min-h-[590px]">
        <div className="absolute top-0 left-0 h-auto z-0 w-full flex justify-center  bg-black">
          <img
            className="object-cover opacity-20 max-w-[2100px] h-ful w-full"
            src={`${
              show.backdrop_path
                ? show.adult
                  ? "/pixeled.jpg"
                  : `https://image.tmdb.org/t/p/w300${show.backdrop_path}`
                : "/backgroundjpeg.jpeg"
            }`}
            alt={show.name}
          />
        </div>

        <div className="relative flex flex-row gap-5 py-3 px-6 w-full max-w-6xl">
          <div className="flex-1">
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
          <div className="flex-[2]">
            <h1 className="text-4xl font-bold mb-4">
              {" "}
              {show?.adult && (
                <span className="text-sm px-3 py-1 rounded-md m-2 bg-red-600 text-white z-50">
                  Adult
                </span>
              )}
              {show.name}
            </h1>
            <div className=" w-full bg-neutral-900 rounded-md overflow-hidden my-2">
              <ThreePrefrenceBtn
                cardId={show.id}
                cardType={show.media_type}
                cardName={show.name || show.title}
                cardAdult={show.adult}
                cardImg={show.poster_path || show.backdrop_path}
              />
            </div>
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
            <div className="mb-4  text-gray-400">
              <span>Genres: </span>
              {show.genres.map((genre: any, index: number) => (
                <Link
                  className="px-2 py-1 bg-neutral-600 hover:bg-neutral-500 mr-2 rounded-md"
                  href={`/app/tvbygenre/list/${genre.id}-${genre.name}`}
                  key={genre.id}
                >
                  {genre.name}
                  {/* {index < show.genres.length - 1 && ", "} */}
                </Link>
              ))}
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
                <span key={company.id}>
                  {company.name}
                  {index < show.production_companies.length - 1 && ", "}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl w-full">
        <div>
          <h2 className="text-lg">Cast</h2>
          <div>
            <div className="grid grid-cols-7 m-3 rounded-md">
              {cast?.slice(0, 6).map((item: any) => (
                <Link
                  href={`/app/person/${item.id}-${item.name
                    .trim()
                    .replace(/[^a-zA-Z0-9]/g, "-")
                    .replace(/-+/g, "-")}`}
                  className="group hover:bg-indigo-600"
                >
                  <img
                    className="w-52 h-56 object-cover"
                    src={
                      item.profile_path
                        ? `https://image.tmdb.org/t/p/w185${item.profile_path}`
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
      <div className="flex flex-col gap-4 my-9 w-full max-w-5xl">
        {show.seasons.map((season: any) => (
          <div key={season.id} className="flex flex-row gap-4">
            <img
              src={`${
                season.poster_path
                  ? show.adult
                    ? "/pixeled.jpg"
                    : `https://image.tmdb.org/t/p/w185${season.poster_path}`
                  : "/no-photo.jpg"
              }`}
              width={150}
              height={225}
              alt={season.name}
            />
            <div>
              <h2 className="text-xl font-bold">{season.name}</h2>
              <p className="text- text-gray-400">
                {season.overview.slice(0, 200)} ..
              </p>
              <p className="text- text-gray-400">Air Date: {season.air_date}</p>
              <p className="text- text-gray-400">
                Episode Count: {season.episode_count}
              </p>
              <p className="text- text-gray-400">
                Average Vote: {season.vote_average}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ShowDetails;
