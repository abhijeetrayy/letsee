import Link from "next/link";
import CardMovieButton from "@/components/buttons/cardButtons";
import { CiSaveDown1 } from "react-icons/ci";
import { FcLike } from "react-icons/fc";
import { IoEyeOutline } from "react-icons/io5";
import Pagination from "@/components/buttons/serchbygenreBtn";
import ThreeUserPrefrenceBtn from "@/components/buttons/threePrefrencebtn";

interface Movie {
  id: number;
  title: string;
  name: string;
  release_date: string;
  first_air_date: string;
  poster_path: string;
  backdrop_path: string;
  media_type: string;
  adult: boolean;
}

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
      <div>
        <div className="text-white w-full p-8">
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {Sresults?.results?.map((data: Movie) => (
              <div
                key={data.id}
                className="overflow-hidden relative group flex flex-col bg-black mr-2.5 w-full h-full text-gray-300 rounded-sm duration-300 hover:scale-105 hover:z-50"
              >
                <div className="absolute top-0 left-0 flex flex-row justify-between w-full z-50">
                  <p className="p-1 bg-black text-white rounded-br-md text-sm">
                    movie
                  </p>
                  {(data.release_date || data.first_air_date) && (
                    <p className="p-1 bg-indigo-600 text-white rounded-bl-md text-sm">
                      {new Date(data.release_date).getFullYear() ||
                        new Date(data.first_air_date).getFullYear()}
                    </p>
                  )}
                </div>
                <Link
                  href={`/app/movie/${data.id}-${(data.name || data.title)
                    .trim()
                    .replace(/[^a-zA-Z0-9]/g, "-")
                    .replace(/-+/g, "-")}`}
                  className="min-h-[382px] w-full"
                >
                  <img
                    className="relative rounded-md object-cover max-w-full h-full"
                    src={
                      data.poster_path || data.backdrop_path
                        ? `https://image.tmdb.org/t/p/w342${
                            data.poster_path || data.backdrop_path
                          }`
                        : "/no-photo.jpg"
                    }
                    width={400}
                    height={400}
                    alt={data.title}
                  />
                </Link>
                <div className="absolute bottom-0 w-full bg-neutral-900 opacity-0 group-hover:opacity-100 z-10">
                  <ThreeUserPrefrenceBtn
                    cardId={data.id}
                    cardType={"movie"}
                    cardName={data.name || data.title}
                    cardAdult={data.adult}
                    cardImg={data.poster_path || data.backdrop_path}
                  />
                  <div
                    title={data.name || data.title}
                    className="w-full flex flex-col gap-2 px-4 bg-indigo-700 text-gray-200"
                  >
                    <Link
                      href={`/app/${data.media_type}/${data.id}-${(
                        data.name || data.title
                      )
                        .trim()
                        .replace(/[^a-zA-Z0-9]/g, "-")
                        .replace(/-+/g, "-")}`}
                      className="mb-1"
                    >
                      <span className="">
                        {data?.title
                          ? data.title.length > 20
                            ? data.title.slice(0, 20) + "..."
                            : data.title
                          : data.name.length > 20
                          ? data.name.slice(0, 20) + "..."
                          : data.name}
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
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
