// app/tv/[id]/season/[seasonNumber]/page.tsx
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";

interface Episode {
  id: number;
  episode_number: number;
  name: string;
  air_date: string | null;
  overview: string;
  still_path: string | null;
}

interface Season {
  id: number;
  season_number: number;
  name: string;
  overview: string;
  poster_path: string | null;
  air_date: string | null;
}

interface SeasonPageProps {
  params: {
    id: Promise<{ id: string }>;
    seasonNumber: Promise<{ seasonNumber: string }>;
  };
}

// Fetch series and season data
const fetchSeriesAndSeasonData = async (
  seriesId: string,
  seasonNumber: string
) => {
  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  if (!apiKey) {
    throw new Error("TMDb API key is missing");
  }

  // Fetch series details with seasons
  const seriesResponse = await fetch(
    `https://api.themoviedb.org/3/tv/${seriesId}?api_key=${apiKey}&append_to_response=seasons`,
    { cache: "force-cache" }
  );
  if (!seriesResponse.ok) {
    if (seriesResponse.status === 404) notFound();
    throw new Error(`Failed to fetch series data: ${seriesResponse.status}`);
  }
  const seriesData = await seriesResponse.json();

  // Fetch specific season details with episodes
  const seasonResponse = await fetch(
    `https://api.themoviedb.org/3/tv/${seriesId}/season/${seasonNumber}?api_key=${apiKey}`,
    { cache: "force-cache" }
  );
  if (!seasonResponse.ok) {
    if (seasonResponse.status === 404) notFound();
    throw new Error(`Failed to fetch season data: ${seasonResponse.status}`);
  }
  const seasonData = await seasonResponse.json();

  return {
    seriesName: seriesData.name,
    seriesOverview: seriesData.overview,
    seriesPoster: seriesData.poster_path,
    seasons: seriesData.seasons.map((s: any) => ({
      id: s.id,
      season_number: s.season_number,
      name: s.name,
      overview: s.overview,
      poster_path: s.poster_path,
      air_date: s.air_date,
    })),
    currentSeason: {
      id: seasonData.id,
      season_number: seasonData.season_number,
      name: seasonData.name,
      overview: seasonData.overview,
      poster_path: seasonData.poster_path,
      air_date: seasonData.air_date,
      episodes: seasonData.episodes || [],
    },
  };
};

const SeasonPage = async ({ params }: SeasonPageProps) => {
  const { id, seasonNumber }: any = await params;

  let data;
  try {
    data = await fetchSeriesAndSeasonData(id, seasonNumber);
  } catch (error) {
    return (
      <div className="min-h-screen bg-neutral-900 text-neutral-200 flex items-center justify-center p-4">
        <p className="text-red-400 text-center">
          Error: {(error as Error).message}
        </p>
      </div>
    );
  }

  const { seriesName, seriesOverview, seriesPoster, seasons, currentSeason } =
    data;
  const currentSeasonNum = parseInt(seasonNumber, 10);
  const nextSeason = seasons.find(
    (s: any) => s.season_number === currentSeasonNum + 1
  );

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-200 p-4">
      <div className="max-w-5xl mx-auto">
        {/* Series Header */}
        <header className="mb-8 flex flex-col sm:flex-row gap-6">
          {seriesPoster && (
            <Image
              src={`https://image.tmdb.org/t/p/w300${seriesPoster}`}
              alt={seriesName}
              width={300}
              height={450}
              className="rounded-lg object-cover"
            />
          )}
          <div className="flex-1">
            <Link
              href={`/app/tv/${id}`}
              className="text-2xl sm:text-4xl font-bold text-neutral-100  hover:underline "
            >
              {seriesName}
            </Link>
            <p className="text-sm sm:text-base text-neutral-300 mb-4 py-5">
              {seriesOverview || "No overview available."}
            </p>
            <p className="text-sm text-neutral-400">
              Showing Season {currentSeasonNum} of {seasons.length}
            </p>
          </div>
        </header>

        {/* Current Season Details */}
        <section className="bg-neutral-800 rounded-lg p-4 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            {currentSeason.poster_path && (
              <Image
                src={`https://image.tmdb.org/t/p/w185${currentSeason.poster_path}`}
                alt={currentSeason.name}
                width={185}
                height={278}
                className="rounded-md object-cover"
              />
            )}
            <div className="flex-1">
              <h2 className="text-xl sm:text-2xl font-semibold text-neutral-100 mb-2">
                {currentSeason.name}
              </h2>
              <p className="text-sm text-neutral-400 mb-2">
                {currentSeason.air_date?.slice(0, 4) || "TBA"}
              </p>
              <p className="text-sm text-neutral-300">
                {currentSeason.overview || "No overview available."}
              </p>
            </div>
          </div>

          {/* Episode List */}
          <ul className="mt-4 space-y-4">
            {currentSeason.episodes.length > 0 ? (
              currentSeason.episodes.map((episode: Episode) => (
                <Link
                  href={`/app/tv/${id}/season/${seasonNumber}/episode/${episode.episode_number}`}
                  key={episode.id}
                  className="flex flex-col sm:flex-row gap-4 bg-neutral-700 hover:bg-neutral-900 p-3 rounded-md"
                >
                  {episode.still_path ? (
                    <Image
                      src={`https://image.tmdb.org/t/p/w185${episode.still_path}`}
                      alt={episode.name}
                      width={185}
                      height={104}
                      className="rounded-md object-cover"
                    />
                  ) : (
                    <div className="w-[185px] h-[104px] bg-neutral-600 rounded-md flex items-center justify-center">
                      <span className="text-xs text-neutral-400">No Image</span>
                    </div>
                  )}
                  <div className="flex-1">
                    <h3 className="text-base sm:text-lg font-semibold text-neutral-100">
                      {episode.episode_number.toString().padStart(2, "0")}.{" "}
                      {episode.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-400">
                      {episode.air_date || "Air date TBA"}
                    </p>
                    <p className="text-xs sm:text-sm text-neutral-300 mt-2 line-clamp-3">
                      {episode.overview || "No overview available."}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-neutral-400 text-center">
                No episodes found for this season.
              </p>
            )}
          </ul>
        </section>

        {/* All Seasons List */}
        <section className="mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-neutral-100 mb-4">
            All Seasons
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {seasons.map((season: Season) => (
              <Link
                key={season.id}
                href={`/app/tv/${id}/season/${season.season_number}`}
                className={`flex flex-col items-center p-2 rounded-lg transition-colors duration-200 ${
                  season.season_number === currentSeasonNum
                    ? "bg-neutral-700"
                    : "bg-neutral-800 hover:bg-neutral-700"
                }`}
              >
                {season.poster_path ? (
                  <Image
                    src={`https://image.tmdb.org/t/p/w154${season.poster_path}`}
                    alt={season.name}
                    width={154}
                    height={231}
                    className="rounded-md object-cover"
                  />
                ) : (
                  <div className="w-[154px] h-[231px] bg-neutral-600 rounded-md flex items-center justify-center">
                    <span className="text-xs text-neutral-400">No Image</span>
                  </div>
                )}
                <span className="text-sm text-neutral-200 mt-2 text-center">
                  {season.name}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Next Season Button */}
        {nextSeason && (
          <div className="text-center">
            <Link
              href={`/app/tv/${id}/season/${nextSeason.season_number}`}
              className="inline-block bg-blue-600 text-white py-2 px-6 rounded-lg text-sm sm:text-base font-semibold hover:bg-blue-700 transition-colors duration-300"
            >
              Next Season (Season {nextSeason.season_number})
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default SeasonPage;
