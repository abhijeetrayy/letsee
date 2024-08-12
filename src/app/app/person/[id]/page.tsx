import CardMovieButton from "@/components/buttons/cardButtons";
import Image from "next/image";
import { lazy, Suspense } from "react";
import { IoEyeOutline } from "react-icons/io5";

import PersonCredits from "@/components/person/server/personCredits";
import { FaInstagram, FaXTwitter } from "react-icons/fa6";
import Link from "next/link";

async function fetchPersonData(id: any) {
  const response = await fetch(
    `https://api.themoviedb.org/3/person/${id}?api_key=${process.env.TMDB_API_KEY}&language=en-US`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch person details");
  }
  return response.json();
}

async function external_ids(id: any) {
  const response = await fetch(
    ` https://api.themoviedb.org/3/person/${id}/external_ids?api_key=${process.env.TMDB_API_KEY}&language=en-US`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch person credits");
  }
  return response.json();
}
async function fetchPersonCredits(id: any) {
  const response = await fetch(
    ` https://api.themoviedb.org/3/person/${id}/combined_credits?api_key=${process.env.TMDB_API_KEY}&language=en-US`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch person credits");
  }
  return response.json();
}
const PersonList = async ({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {
  const person = await fetchPersonData(params.id);
  const { cast, crew } = await fetchPersonCredits(params.id);
  const person_ids = await external_ids(params.id);

  return (
    <div className="text-white w-full flex justify-center">
      <div className=" flex flex-col gap-4 p-4 max-w-6xl  w-full">
        <div className="flex flex-col max-w-5xl w-full m-auto md:flex-row gap-2 z-10">
          <div className="w-full">
            {person.profile_path ? (
              <img
                src={`https://image.tmdb.org/t/p/h632${person.profile_path}`}
                width={300}
                height={450}
                className="  w-fit   max-h-64  md:max-h-96 rounded-md"
                alt={person.name}
              />
            ) : (
              <div className="w-48 h-64 bg-gray-700 flex items-center justify-center rounded-md">
                <span>No Image</span>
              </div>
            )}
          </div>
          <div className="">
            <h1 className="mt-4 text-2xl font-bold">{person.name}</h1>
            <div className="flex flex-row gap-3 my-2">
              {person_ids?.twitter_id && (
                <Link
                  className="py-2 px-3  text-xl  border border-gray-100 rounded-md hover:bg-neutral-950"
                  target="_blank"
                  href={`https://x.com/${person_ids.twitter_id}`}
                >
                  <FaXTwitter />
                </Link>
              )}
              {person_ids?.instagram_id && (
                <Link
                  className="py-2 px-3  text-xl border border-gray-100 rounded-md hover:bg-neutral-950"
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
            <p className="mt-2 text-sm text-gray-400">
              {person.biography.slice(0, 400)} ...
            </p>
          </div>
        </div>

        <h3 className="text-lg font-semibold">Known For:</h3>
        <div>
          <Suspense
            fallback={
              <div className="w-full h-72 flex justify-center items-center">
                Loading up.
              </div>
            }
          >
            <PersonCredits
              orginalCast={cast}
              cast={cast}
              crew={crew}
              name={person.name}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default PersonList;
