// components/Recommendations.tsx
"use client";
import Link from "next/link";
import { useState } from "react";

import ThreePrefrenceBtn from "@/components/buttons/threePrefrencebtn";

export default function Recommendations({ userId }: { userId: string }) {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetRecommendations = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/AiRecommendation/${userId}`);
      console.log(response);
      if (!response.ok) throw new Error("Failed to fetch recommendations");

      const data = await response.json();
      console.log(data);
      setRecommendations(data);
    } catch (err) {
      console.error(err);
      setError("Failed to load recommendations. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <button
        onClick={handleGetRecommendations}
        disabled={isLoading}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
      >
        {isLoading ? "Generating..." : "Get Recommendations"}
      </button>

      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>
      )}

      {recommendations.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 ">
          {recommendations.map((data: any) => (
            <div className="" key={data.id}>
              <div className=" relative group flex flex-col justify-between rounded-md bg-black  w-full h-full  text-gray-300 overflow-hidden duration-300  lg:hover:scale-105 ">
                <Link
                  className="relative flex h-full  "
                  href={`/app/movie/${data.id}-${(data.name || data.title)
                    .trim()
                    .replace(/[^a-zA-Z0-9]/g, "-")
                    .replace(/-+/g, "-")}`}
                >
                  <div className="absolute top-0 left-0 z-10 lg:opacity-0 lg:group-hover:opacity-100">
                    {data.adult ? (
                      <p className="p-1 bg-red-600 text-white rounded-br-md text-sm">
                        Adult
                      </p>
                    ) : (
                      <p className="p-1 bg-black text-white rounded-br-md text-sm">
                        {data.media_type}
                      </p>
                    )}
                  </div>
                  <div className="absolute top-0 right-0 z-10">
                    {(data.release_date || data.first_air_date) && (
                      <p className="p-1 bg-indigo-600 text-white rounded-tr-sm rounded-bl-md text-sm">
                        {new Date(data.release_date).getFullYear() ||
                          new Date(data.first_air_date).getFullYear()}
                      </p>
                    )}
                  </div>
                  <img
                    className={`${"h-full w-full object-cover"}  `}
                    src={
                      (data.poster_path || data.backdrop_path) && !data.adult
                        ? `https://image.tmdb.org/t/p/w342${
                            data.poster_path || data.backdrop_path
                          }`
                        : data.adult
                        ? "/pixeled.webp"
                        : "/no-photo.webp"
                    }
                    loading="lazy"
                    alt={data.title}
                  />
                </Link>
                <div className="lg:absolute bottom-0 w-full bg-neutral-900 lg:opacity-0 lg:group-hover:opacity-100 z-10">
                  <ThreePrefrenceBtn
                    cardId={data.id}
                    cardType={data.media_type}
                    cardName={data.name || data.title}
                    cardAdult={data.adult}
                    cardImg={data.poster_path || data.backdrop_path}
                  />

                  <div
                    title={data.name || data.title}
                    className="w-full h-12 lg:h-fit flex flex-col gap-2  px-4  bg-indigo-700  text-gray-200 "
                  >
                    <Link
                      href={`/app/${data.media_type}/${data.id}-${(
                        data.name || data.title
                      )
                        .trim()
                        .replace(/[^a-zA-Z0-9]/g, "-")
                        .replace(/-+/g, "-")}`}
                      className="h-full"
                    >
                      <span className="">
                        {data?.title
                          ? data.title.length > 20
                            ? data.title?.slice(0, 20) + "..."
                            : data.title
                          : data.name.length > 20
                          ? data.name?.slice(0, 20) + "..."
                          : data.name}
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
