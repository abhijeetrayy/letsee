import SearchForm from "@/components/homeDiscover/client/seachForm";
import DiscoverUsers from "@components/home/DiscoverUser";
import OpenAiReco from "@components/ai/openaiReco";
import Link from "next/link";
import WeeklyTop from "@components/clientComponent/weeklyTop";
import Tvtop from "@components/clientComponent/topTv";
import HomeVideo from "@components/home/videoReel";
import MovieGenre from "@components/scroll/movieGenre";
import TvGenre from "@components/scroll/tvGenre";
import HomeContentTile from "@components/movie/homeContentTile";

async function getData() {
  const res = await fetch(
    `https://api.themoviedb.org/3/genre/movie/list?api_key=${process.env.TMDB_API_KEY}`,
    { next: { revalidate: 86400 } }
  );

  if (!res.ok) {
    console.log(res);
    throw new Error("Failed to fetch movie genres data");
  }

  return res.json();
}

async function getRomance() {
  const res = await fetch(
    `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.TMDB_API_KEY}&with_genres=10749`,
    { next: { revalidate: 86400 } }
  );

  if (!res.ok) {
    console.log(res);
    throw new Error("Failed to fetch romance data");
  }

  return res.json();
}

async function getAction() {
  const res = await fetch(
    `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.TMDB_API_KEY}&with_genres=28`,
    { next: { revalidate: 86400 } }
  );

  if (!res.ok) {
    console.log(res);
    throw new Error("Failed to fetch action data");
  }

  return res.json();
}

async function getTvGenre() {
  const tvGenresResponse = await fetch(
    `https://api.themoviedb.org/3/genre/tv/list?api_key=${process.env.TMDB_API_KEY}&language=en-US`,
    { next: { revalidate: 86400 } }
  );
  if (!tvGenresResponse.ok) {
    console.log(tvGenresResponse);
    throw new Error("Failed to fetch TV genres data");
  }
  const tvGenres = await tvGenresResponse.json();
  return { tvGenres };
}

async function getTrending() {
  const url = `https://api.themoviedb.org/3/trending/all/week?api_key=${process.env.TMDB_API_KEY}`;
  const res = await fetch(url, { next: { revalidate: 86400 } });

  if (!res.ok) {
    console.log(res);
    throw new Error("Failed to fetch trending data");
  }

  return res.json();
}

async function getTrendingTV() {
  const url = `https://api.themoviedb.org/3/trending/tv/day?api_key=${process.env.TMDB_API_KEY}`;
  const res = await fetch(url, { next: { revalidate: 86400 } });

  if (!res.ok) {
    console.log(res);
    throw new Error("Failed to fetch trending TV data");
  }

  return res.json();
}

async function getBollywoodKeyword() {
  const res = await fetch(
    `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.TMDB_API_KEY}&with_keywords=315446&page=1`,
    { next: { revalidate: 86400 } }
  );

  if (!res.ok) {
    console.log(res);
    throw new Error("Failed to fetch Bollywood keyword data");
  }

  return res.json();
}

export default async function Home() {
  const genre = await getData();
  const { tvGenres } = await getTvGenre();
  const data = await getTrending();

  const TrendingTv = await getTrendingTV();
  const RomanceData = await getRomance();
  const ActionData = await getAction();
  const BollywoodData = await getBollywoodKeyword();

  return (
    <>
      <HomeVideo />

      <div className="mt-10 flex flex-col gap-8 max-w-[1920px] w-full m-auto">
        {/* <div className="flex flex-col text-center items-center gap-3 my-10">
          <h1 className="text-3xl font-bold">Your Personal Recommendation</h1>
          <p>
            Favorite List + Watched List with{" "}
            <span className="text-blue-700">AI</span>
          </p>
          <div className="mt-1">
            <OpenAiReco />
          </div>
        </div> */}
        <div className="w-full">
          <SearchForm />
        </div>
        <div className="">
          <DiscoverUsers />
        </div>
        <div className="w-full">
          <h2 className="text-2xl my-4 font-bold">Bollywood</h2>
          <HomeContentTile type={"movie"} data={BollywoodData} />
        </div>
        <div className="w-full my-4 mb-4">
          <h1 className="text-lg font-semibold my-4">Movie Genres</h1>
          <MovieGenre genre={genre.genres} />
        </div>
        <div className="">
          <h2 className="text-2xl my-4 font-bold">Weekly Top 20</h2>
          <HomeContentTile type={"mix"} data={data} />
        </div>
        <div className="w-full">
          <h1 className="text-lg font-semibold mb-2">TV Show Genres</h1>
          <TvGenre tvGenres={tvGenres.genres} />
        </div>
        <div className="w-full">
          <h2 className="text-2xl my-4 font-bold">Trending TV Shows</h2>
          <HomeContentTile type={"tv"} data={TrendingTv} />
        </div>
        <div className="w-full">
          <h2 className="text-2xl my-4 font-bold">Romance</h2>
          <HomeContentTile type={"movie"} data={RomanceData} />
        </div>
        <div className="w-full">
          <h2 className="text-2xl my-4 font-bold">Action</h2>
          <HomeContentTile type={"movie"} data={ActionData} />
        </div>
      </div>
    </>
  );
}
