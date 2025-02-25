import TvGenre from "@components/scroll/tvGenre";
import Link from "next/link";

async function page({ children }: { children: React.ReactNode }) {
  async function getMovieGenre() {
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/genre/tv/list?api_key=${process.env.TMDB_API_KEY}`
      );
      const res = await response.json();
      return { genrelist: res.genres };
    } catch (error) {
      console.log(error);
      return { error };
    }
  }

  const { genrelist } = await getMovieGenre();
  return (
    <div>
      <div className="w-full max-w-7xl my-3 m-auto">
        <h1 className="text-lg font-semibold mb-2">TV Show&apos;s Genre</h1>
        <TvGenre tvGenres={genrelist} />
      </div>
      <div>{children}</div>
    </div>
  );
}

export default page;
