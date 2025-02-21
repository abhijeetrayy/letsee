import { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";

// Types
type PageProps = {
  params: params;
};

type params = Promise<{ id: string }>;

interface MovieDetails {
  id: number;
  title: string;
  backdrop_path: string;
  poster_path: string;
  adult: boolean;
}

interface CastMember {
  id: number;
  name: string;
  profile_path: string | null;
  character: string;
}

interface CrewMember {
  id: number;
  name: string;
  profile_path: string | null;
  department: string;
}

interface CreditResponse {
  cast: CastMember[];
  crew: CrewMember[];
}

async function getCredit(id: string): Promise<CreditResponse> {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${process.env.TMDB_API_KEY}`,
    { next: { revalidate: 3600 } }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch credits");
  }

  return response.json();
}

async function getMovieDetails(id: string): Promise<MovieDetails> {
  const response = await fetch(
    `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.TMDB_API_KEY}`,
    { next: { revalidate: 3600 } }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch movie details");
  }

  return response.json();
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const slugParts = (await params).id.split("-");
  const id = slugParts[0];
  const movie = await getMovieDetails(id);

  return {
    title: `${movie.title} - Cast & Crew`,
    description: `Cast and crew information for ${movie.title}`,
  };
}

export default async function Page({ params }: PageProps) {
  const slugParts = (await params).id.split("-");
  const id = slugParts[0];

  if (!id) {
    return <div>Error: Movie ID not found</div>;
  }

  const movie = await getMovieDetails(id);
  const { cast, crew } = await getCredit(id);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div>
        <div className="relative flex flex-col items-center justify-center w-full min-h-[550px] h-full">
          <div className="absolute w-full h-full overflow-hidden">
            <div
              className="absolute inset-0 z-10"
              style={{
                background:
                  "linear-gradient(to left, #171717, transparent 60%, #171717, #171717)",
              }}
            />
            <img
              className="object-cover max-w-[2100px] w-full h-full m-auto opacity-20"
              src={
                movie.backdrop_path && !movie.adult
                  ? `https://image.tmdb.org/t/p/w300${movie.backdrop_path}`
                  : "/backgroundjpeg.webp"
              }
              width={300}
              height={300}
              alt={`${movie.title} backdrop`}
            />
          </div>

          <div className="max-w-6xl w-full relative z-10 flex flex-row gap-5">
            <div className="flex-1">
              <img
                className="rounded-md object-cover h-full max-h-[500px]"
                src={
                  movie.poster_path && !movie.adult
                    ? `https://image.tmdb.org/t/p/w342${movie.poster_path}`
                    : movie.adult
                    ? "/pixeled.webp"
                    : "/no-photo.webp"
                }
                width={500}
                height={500}
                alt={`${movie.title} poster`}
              />
            </div>
            <div className="flex-[2] w-full">
              <Link
                className="hover:text-neutral-200 hover:underline"
                href={`/app/movie/${movie.id}-${movie.title
                  .trim()
                  .replace(/[^a-zA-Z0-9]/g, "-")
                  .toLowerCase()
                  .replace(/-+/g, "-")}`}
              >
                <h1 className="text-xl font-bold">{movie.title}</h1>
              </Link>
              <span className="text-4xl font-bold mt-10 block">
                Cast ~ Crew
              </span>
            </div>
          </div>
        </div>

        <div className="max-w-5xl w-full m-auto my-3">
          <h2 className="text-2xl font-bold mb-4">Cast ~</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {cast.map((item, index: number) => (
              <Link
                key={index}
                className="border border-neutral-900 bg-neutral-800 py-2 px-2 rounded-md hover:border-indigo-600 transition-colors"
                href={`/app/person/${item.id}-${item.name
                  .trim()
                  .replace(/[^a-zA-Z0-9]/g, "-")
                  .toLowerCase()
                  .replace(/-+/g, "-")}`}
              >
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                  <img
                    className="max-w-[100px] object-cover rounded-md h-full"
                    src={
                      item.profile_path
                        ? `https://image.tmdb.org/t/p/w92${item.profile_path}`
                        : "/avatar.svg"
                    }
                    width={92}
                    height={138}
                    alt={item.name}
                  />
                  <div className="flex flex-row gap-2">
                    <h3 className="font-semibold">{item.name}</h3>
                    <span>-</span>
                    <p>{item.character}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <h2 className="text-2xl font-bold my-4">Prod. ~ Crew</h2>
          <div className="grid grid-cols-1 gap-4">
            {crew.map((item, index: number) => (
              <Link
                key={index}
                href={`/app/person/${item.id}-${item.name
                  .trim()
                  .replace(/[^a-zA-Z0-9]/g, "-")
                  .toLowerCase()
                  .replace(/-+/g, "-")}`}
                className="hover:bg-neutral-800 p-2 rounded-md transition-colors"
              >
                <div className="flex flex-col md:flex-row gap-4">
                  <img
                    className="w-32 md:max-w-[120px] md:min-h-44 h-full object-cover rounded-md"
                    src={
                      item.profile_path
                        ? `https://image.tmdb.org/t/p/w92${item.profile_path}`
                        : "/avatar.svg"
                    }
                    width={92}
                    height={138}
                    alt={item.name}
                  />
                  <div className="flex flex-row gap-2 items-center">
                    <h3 className="font-semibold">{item.name}</h3>
                    <span>-</span>
                    <p>{item.department}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Suspense>
  );
}
