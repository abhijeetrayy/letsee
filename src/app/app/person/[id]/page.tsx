import { Suspense } from "react";
import Link from "next/link";
import { FaInstagram, FaXTwitter } from "react-icons/fa6";
import { notFound } from "next/navigation";
import PersonCredits from "@/components/person/server/personCredits";
import Biography from "@/components/person/client/Biography";
import Image from "next/image";

async function fetchPersonData(id: string) {
  const response = await fetch(
    `https://api.themoviedb.org/3/person/${id}?api_key=${process.env.TMDB_API_KEY}&language=en-US`,
    { next: { revalidate: 86400 } } // Cache for 24 hours
  );
  if (!response.ok) {
    throw new Error("Failed to fetch person details");
  }
  return response.json();
}

async function fetchExternalIds(id: string) {
  const response = await fetch(
    `https://api.themoviedb.org/3/person/${id}/external_ids?api_key=${process.env.TMDB_API_KEY}&language=en-US`,
    { next: { revalidate: 86400 } }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch external IDs");
  }
  return response.json();
}

async function fetchPersonCredits(id: string) {
  const response = await fetch(
    `https://api.themoviedb.org/3/person/${id}/combined_credits?api_key=${process.env.TMDB_API_KEY}&language=en-US`,
    { next: { revalidate: 86400 } }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch person credits");
  }
  return response.json();
}

async function getImages(id: string) {
  const response = await fetch(
    `https://api.themoviedb.org/3/person/${id}/images?api_key=${process.env.TMDB_API_KEY}`,
    { next: { revalidate: 86400 } }
  );
  if (!response.ok) {
    throw new Error("Failed to fetch person images");
  }
  return response.json();
}

type Params = Promise<{ id: string }>;

interface PageProps {
  params: Params;
}

const PersonList = async ({ params }: PageProps) => {
  const { id } = await params;

  if (!id) {
    return notFound();
  }

  try {
    const [person, { cast, crew }, person_ids, images] = await Promise.all([
      fetchPersonData(id),
      fetchPersonCredits(id),
      fetchExternalIds(id),
      getImages(id), // Now fetching images
    ]);

    // Filter top 5 "Known For" based on popularity and vote average
    const knownFor = cast
      .filter((item: any) => item.popularity && item.vote_average) // Ensure required fields exist
      .sort((a: any, b: any) => {
        const scoreA = (a.popularity || 0) * (a.vote_average || 0);
        const scoreB = (b.popularity || 0) * (b.vote_average || 0);
        return scoreB - scoreA; // Sort by combined popularity and rating
      })
      .slice(0, 5);

    return (
      <div className="text-white w-full flex flex-col items-center justify-center min-h-screen">
        <div className="max-w-6xl w-full px-2 py-8">
          {/* Artist Introduction */}
          <div className="flex flex-col md:flex-row gap-8 mb-12">
            <div className="flex-shrink-0">
              {person.profile_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/h632${person.profile_path}`}
                  width={300}
                  height={450}
                  className="rounded-lg object-cover w-full max-w-[300px] h-auto shadow-lg"
                  alt={person.name}
                />
              ) : (
                <div className="w-[300px] h-[450px] bg-neutral-700 flex items-center justify-center rounded-lg shadow-lg">
                  <span className="text-neutral-400">No Image</span>
                </div>
              )}
            </div>
            <div className="flex-1">
              <h1 className="text-4xl font-bold mb-2">{person.name}</h1>
              <div className="flex flex-row gap-4 mb-4">
                {person_ids?.twitter_id && (
                  <Link
                    href={`https://x.com/${person_ids.twitter_id}`}
                    target="_blank"
                    className="p-2 text-xl border border-neutral-600 rounded-full hover:bg-neutral-800 transition-colors"
                  >
                    <FaXTwitter />
                  </Link>
                )}
                {person_ids?.instagram_id && (
                  <Link
                    href={`https://instagram.com/${person_ids.instagram_id}`}
                    target="_blank"
                    className="p-2 text-xl border border-neutral-600 rounded-full hover:bg-neutral-800 transition-colors"
                  >
                    <FaInstagram />
                  </Link>
                )}
              </div>
              <div className="text-sm text-neutral-400 space-y-2">
                {person.birthday && <p>Born: {person.birthday}</p>}
                {person.place_of_birth && <p>From: {person.place_of_birth}</p>}
                {person.known_for_department && (
                  <p>Known For: {person.known_for_department}</p>
                )}
              </div>
              {person.biography && (
                <div className="mt-4">
                  <h2 className="text-lg font-semibold mb-2">Biography</h2>
                  <Biography biography={person.biography} />
                </div>
              )}
            </div>
          </div>

          {/* Full Credits */}
          <Suspense
            fallback={
              <div className="w-full h-72 flex justify-center items-center">
                Loading Credits...
              </div>
            }
          >
            <PersonCredits cast={cast} crew={crew} name={person.name} />
          </Suspense>
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error fetching person data:", error);
    return notFound();
  }
};

export default PersonList;
