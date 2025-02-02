import ThreePrefrenceBtn from "@/components/buttons/threePrefrencebtn";
import SearchForm from "@/components/homeDiscover/client/seachForm";
import DiscoverUsers from "@components/home/DiscoverUser";
import OpenAiReco from "@components/ai/openaiReco";
import Link from "next/link";

async function getData() {
  const res = await fetch(
    `https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.TMDB_API_KEY}`,
    { next: { revalidate: 86400 } }
  );

  if (!res.ok) {
    console.log(res);
    throw new Error("Failed to fetch data");
  }

  return res.json();
}

async function getTvGenre() {
  const tvGenresResponse = await fetch(
    `https://api.themoviedb.org/3/genre/tv/list?api_key=${process.env.TMDB_API_KEY}&language=en-US`,
    { next: { revalidate: 86400 } }
  );
  const tvGenres = await tvGenresResponse.json();

  return { tvGenres: tvGenres };
}

async function getTrending() {
  const url = `https://api.themoviedb.org/3/trending/all/week?api_key=${process.env.TMDB_API_KEY}`;

  const res = await fetch(url, { next: { revalidate: 86400 } });

  return res.json();
}

async function getTrendingTV() {
  const url = `https://api.themoviedb.org/3/trending/tv/day?api_key=${process.env.TMDB_API_KEY}`;

  const res = await fetch(url, { next: { revalidate: 86400 } });

  return res.json();
}
export default async function Home() {
  const genre = await getData();
  const { tvGenres } = await getTvGenre();
  const data = await getTrending();
  const TrendingTv = await getTrendingTV();
  return (
    <div className="flex flex-col gap-8 max-w-7xl w-full m-auto">
      <div className="flex flex-col text-center items-center gap-3">
        <h1 className="text-3xl font-bold">Your Personal Recommendation</h1>
        <p>
          Favorite List + Watched List with{" "}
          <span className="text-blue-700">AI</span>
        </p>
        <OpenAiReco />
      </div>
      <div className="w-full">
        <SearchForm />
      </div>
      <div className="">
        <DiscoverUsers />
      </div>
      <div className="w-full max-w-7xl my-4 mb-4">
        <h1 className="text-lg font-semibold my-4">Movie Genres</h1>
        <div className="flex flex-row  overflow-x-scroll vone-scrollbar gap-1">
          {genre?.genres.map((genre: any) => (
            <Link
              href={`/app/moviebygenre/list/${genre.id}-${genre.name}`}
              className=" h-24 min-w-32 text-sm border-2 rounded-md border-gray-700 text-white p-2 flex items-center justify-center"
              key={genre.id}
              // onClick={() => setSelectedGenre(genre.id)}
            >
              {genre.name}
            </Link>
          ))}
        </div>
      </div>
      {/* <div className="grid gap-2 mt-5">
        {genre?.genres.map((genre) => (
          <MovieCard key={genre.id} genre={genre} />
        ))}
      </div> */}
      <div className="">
        <h2 className="text-2xl my-4 font-bold">Weekly Top 20</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-w-6xl w-full m-auto">
          {data?.results.map((item: any) => (
            <div className="group relative flex flex-col justify-between w-full h-full bg-neutral-700 rounded-md overflow-hidden ">
              <div className="absolute top-0 left-0">
                <p className="px-1 py-1 bg-neutral-950  text-white rounded-br-md">
                  {item.media_type}
                </p>
              </div>
              <Link
                className="w-full  h-full"
                href={`/app/${item.media_type}/${item.id}-${(
                  item?.name || item?.title
                )
                  .trim()
                  .replace(/[^a-zA-Z0-9]/g, "-")
                  .replace(/-+/g, "-")}`}
              >
                <img
                  className="h-fit w-full"
                  src={`https://image.tmdb.org/t/p/w342${item.poster_path}`}
                  alt={item.name}
                />
              </Link>
              <div className="lg:absolute lg:bottom-0  w-full lg:opacity-0 lg:group-hover:opacity-100">
                <div className="  bg-neutral-900 ">
                  <ThreePrefrenceBtn
                    cardId={item.id}
                    cardType={item.media_type}
                    cardName={item.name || item.title}
                    cardAdult={item.adult}
                    cardImg={item.poster_path || item.backdrop_path}
                  />
                </div>
                <div className=" min-h-14 flex flex-col justify-center px-3 pb-1   w-full bg-indigo-700 text-gray-100 ">
                  <p className="">
                    {item.name?.length > 40 || item.title?.length > 40 ? (
                      <span>
                        {item.name?.slice(0, 40) || item.title?.slice(0, 40)}..
                      </span>
                    ) : (
                      item.name || item.title
                    )}{" "}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="w-full max-w-7xl ">
        <h1 className="text-lg font-semibold mb-2">Tv Show Genres</h1>
        <div className="flex flex-row  overflow-x-scroll vone-scrollbar gap-1 ">
          {tvGenres?.genres.map((genre: any) => (
            <Link
              href={`/app/tvbygenre/list/${genre.id}-${genre.name}`}
              className=" h-24 min-w-32 text-sm border-2 rounded-md border-gray-700 text-white p-2 flex items-center justify-center"
              key={genre.id}
              // onClick={() => setSelectedGenre(genre.id)}
            >
              {genre.name}
            </Link>
          ))}
        </div>
      </div>
      <div className="w-full  ">
        <h2 className="text-2xl my-4 font-bold">Trending Tv Show's</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 max-w-6xl w-full m-auto">
          {TrendingTv?.results.map((item: any) => (
            <div className="group relative flex flex-col justify-between w-full h-full bg-neutral-700 rounded-md overflow-hidden">
              <Link
                className="relative h-full w-full"
                href={`/app/${item.media_type}/${item.id}-${(
                  item?.name || item?.title
                )
                  .trim()
                  .replace(/[^a-zA-Z0-9]/g, "-")
                  .replace(/-+/g, "-")}`}
              >
                <div className="absolute top-0 left-0">
                  <p className="px-1 py-1 bg-neutral-950  text-white rounded-br-md">
                    {item.media_type}
                  </p>
                </div>
                <img
                  className="h-fit w-full"
                  src={`https://image.tmdb.org/t/p/w342${item.poster_path}`}
                  alt={item.name}
                />
              </Link>
              <div className="lg:absolute bottom-0  w-full lg:opacity-0 group-hover:opacity-100">
                <div className="  bg-neutral-900 ">
                  <ThreePrefrenceBtn
                    cardId={item.id}
                    cardType={item.media_type}
                    cardName={item.name || item.title}
                    cardAdult={item.adult}
                    cardImg={item.poster_path || item.backdrop_path}
                  />
                </div>
                <div className=" min-h-14 flex flex-col justify-center px-3 pb-1   w-full bg-indigo-700 text-gray-100 ">
                  <p className="">
                    {item.name?.length > 40 || item.title?.length > 40 ? (
                      <span>
                        {item.name?.slice(0, 40) || item.title?.slice(0, 40)}..
                      </span>
                    ) : (
                      item.name || item.title
                    )}{" "}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
