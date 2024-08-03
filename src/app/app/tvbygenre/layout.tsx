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
        <h1 className="text-lg font-semibold mb-2">TV Show's Genre</h1>
        <div className="flex flex-row overflow-x-scroll vone-scrollbar gap-1 mx-5">
          {genrelist?.map((genre: any) => (
            <Link
              href={`/app/moviebygenre/list/${genre.id}-${genre.name}`}
              className=" h-24 min-w-32 text-sm border-2 rounded-md border-gray-700 text-white p-2 text-center content-center"
              key={genre.id}
              // onClick={() => setSelectedGenre(genre.id)}
            >
              {genre.name}
            </Link>
          ))}
        </div>
      </div>
      <div>{children}</div>
    </div>
  );
}

export default page;
