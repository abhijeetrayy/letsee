import { Suspense } from "react";
import Link from "next/link";
import { FaInstagram, FaXTwitter } from "react-icons/fa6";
import { notFound } from "next/navigation";
import PersonCredits from "@/components/person/server/personCredits";
import Biography from "@/components/person/client/Biography";

async function fetchPersonData(id: string) {
  const response = await fetch(
    `https://api.themoviedb.org/3/person/${id}?api_key=${process.env.TMDB_API_KEY}&language=en-US`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch person details");
  }
  return response.json();
}

async function external_ids(id: string) {
  const response = await fetch(
    `https://api.themoviedb.org/3/person/${id}/external_ids?api_key=${process.env.TMDB_API_KEY}&language=en-US`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch external IDs");
  }
  return response.json();
}

async function fetchPersonCredits(id: string) {
  const response = await fetch(
    `https://api.themoviedb.org/3/person/${id}/combined_credits?api_key=${process.env.TMDB_API_KEY}&language=en-US`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch person credits");
  }
  return response.json();
}

async function getImages(id: string) {
  const response = await fetch(
    `https://api.themoviedb.org/3/person/${id}/images?api_key=${process.env.TMDB_API_KEY}`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch person images");
  }
  return response.json();
}

type params = Promise<{ id: string }>;

interface PageProps {
  params: params;
}

const PersonList = async ({ params }: PageProps) => {
  const { id } = await params;

  if (!id) {
    return notFound();
  }

  try {
    const [person, { cast, crew }, person_ids] = await Promise.all([
      fetchPersonData(id),
      fetchPersonCredits(id),
      external_ids(id),
      // getImages(id), // Uncomment if needed
    ]);

    return (
      <div className="text-white w-full flex flex-col items-center justify-center">
        <div className="flex flex-col gap-4 max-w-6xl w-full">
          <div className="flex flex-col p-3 max-w-5xl w-full m-auto md:flex-row gap-4 z-10">
            <div className="flex-1">
              {person.profile_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/h632${person.profile_path}`}
                  width={300}
                  height={450}
                  className="w-fit max-h-64 md:max-h-96 lg:max-h-[440px] lg:h-full rounded-md"
                  alt={person.name}
                />
              ) : (
                <div className="w-48 h-64 bg-gray-700 flex items-center justify-center rounded-md">
                  <span>No Image</span>
                </div>
              )}
            </div>
            <div className="flex-[2]">
              <h1 className="mt-4 text-2xl font-bold">{person.name}</h1>
              <div className="flex flex-row gap-3 my-2">
                {person_ids?.twitter_id && (
                  <Link
                    className="py-2 px-3 text-xl border border-gray-100 rounded-md hover:bg-neutral-950"
                    target="_blank"
                    href={`https://x.com/${person_ids.twitter_id}`}
                  >
                    <FaXTwitter />
                  </Link>
                )}
                {person_ids?.instagram_id && (
                  <Link
                    className="py-2 px-3 text-xl border border-gray-100 rounded-md hover:bg-neutral-950"
                    target="_blank"
                    href={`https://instagram.com/${person_ids.instagram_id}`}
                  >
                    <FaInstagram />
                  </Link>
                )}
              </div>
              <p className="mt-2 text-sm text-gray-400">{person.birthday}</p>
              <p className="mt-2 text-sm text-gray-400">
                {person.place_of_birth}
              </p>
              <p className="mt-2 text-sm text-gray-400">
                {person.known_for_department}
              </p>
              {person?.biography && <Biography biography={person.biography} />}
            </div>
          </div>
          <h3 className="text-lg font-semibold">Known For</h3>
          <div>
            <Suspense
              fallback={
                <div className="w-full h-72 flex justify-center items-center">
                  Loading...
                </div>
              }
            >
              <PersonCredits cast={cast} crew={crew} name={person.name} />
            </Suspense>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching person data:", error);
    return notFound();
  }
};

export default PersonList;
