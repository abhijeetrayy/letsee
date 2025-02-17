import Pagination from "@/components/buttons/serchbygenreBtn";
import { notFound } from "next/navigation";

import MoviebyGenre from "@components/clientComponent/moviebyGenre";

const getMovieByGenre = async (page: number, genreId: string) => {
  const response = await fetch(
    `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.TMDB_API_KEY}&with_genres=${genreId}&page=${page}`
  );
  const data = await response.json();
  return data;
};

type SearchParams = Promise<{ page: number | number[] | undefined }>;
type Params = Promise<{ id: string }>;

interface PageProps {
  params: Params;
  searchParams: SearchParams;
}

const Page = async ({ params, searchParams }: PageProps) => {
  const { id } = await params;
  const currentPage = Number((await searchParams).page) || 1;

  if (!id) return notFound();

  const Sresults = await getMovieByGenre(currentPage, id);

  return (
    <div className="min-h-screen mx-auto w-full max-w-7xl">
      <div>
        <p>
          Search Results: {decodeURIComponent(id)} &apos;
          {Sresults?.total_results}&apos; items
        </p>
      </div>
      <MoviebyGenre Sresults={Sresults} />

      {Sresults?.total_pages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={Sresults.total_pages}
        />
      )}
    </div>
  );
};

export default Page;
