import ThreePrefrenceBtn from "@/components/buttons/threePrefrencebtn";
import SearchForm from "@/components/homeDiscover/client/seachForm";
import DiscoverUsers from "@components/home/DiscoverUser";
import OpenAiReco from "@components/ai/openaiReco";
import Link from "next/link";
import WeeklyTop from "@components/clientComponent/weeklyTop";
import Tvtop from "@components/clientComponent/topTv";

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
      <div className="flex flex-col text-center items-center gap-3 my-10">
        <h1 className="text-3xl font-bold">Your Personal Recommendation</h1>
        <p>
          Favorite List + Watched List with{" "}
          <span className="text-blue-700">AI</span>
        </p>
        <div className="mt-1">
          <OpenAiReco />
        </div>
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
        <WeeklyTop data={data} />
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
        <Tvtop TrendingTv={TrendingTv} />
      </div>
    </div>
  );
}
