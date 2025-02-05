import Link from "next/link";
import CardMovieButton from "@/components/buttons/cardButtons";
import { CiSaveDown1 } from "react-icons/ci";
import { FcLike } from "react-icons/fc";
import { IoEyeOutline } from "react-icons/io5";
import Pagination from "@/components/buttons/serchbygenreBtn";
import ThreeUserPrefrenceBtn from "@/components/buttons/threePrefrencebtn";
import MoviebyGenre from "@components/clientComponent/moviebyGenre";

const getMovieByGenre = async (page: number, genreId: string) => {
  const response = await fetch(
    `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.TMDB_API_KEY}&with_genres=${genreId}&page=${page}`
  );
  const data = await response.json();
  return data;
};

interface PageProps {
  params: { id: string };
  searchParams: { page?: string };
}

const Page: React.FC<PageProps> = async ({ params, searchParams }) => {
  const { id } = params;
  let { page = "1" } = searchParams;

  const currentPage = Number(page);
  const Sresults = await getMovieByGenre(currentPage, id);

  return (
    <div className="min-h-screen mx-auto w-full max-w-7xl">
      <div>
        <p>
          Search Results: {decodeURIComponent(id)} '{Sresults?.total_results}'
          items
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
