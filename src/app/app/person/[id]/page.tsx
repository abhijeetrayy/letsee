import CardMovieButton from "@/components/buttons/cardButtons";
import Image from "next/image";
import { lazy, Suspense } from "react";
import { IoEyeOutline } from "react-icons/io5";

import PersonCredits from "@/components/person/server/personCredits";

async function fetchPersonData(id: any) {
  const response = await fetch(
    `https://api.themoviedb.org/3/person/${id}?api_key=${process.env.TMDB_API_KEY}&language=en-US`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch person details");
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

  return (
    <div className="text-white w-full flex justify-center">
      <div className=" flex flex-col gap-4 p-4 max-w-6xl  w-full">
        <div className="flex flex-row gap-4 z-10">
          <div className="w-full flex-1 ">
            {person.profile_path ? (
              <img
                src={`https://image.tmdb.org/t/p/h632${person.profile_path}`}
                width={300}
                height={450}
                className="object-contain rounded-md w-full min-h-full"
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
            <PersonCredits cast={cast} crew={crew} name={person.name} />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default PersonList;
