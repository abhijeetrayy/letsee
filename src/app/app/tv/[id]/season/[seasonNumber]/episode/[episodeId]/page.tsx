// app/tv/[id]/season/[seasonNumber]/episode/[episodeId]/page.tsx
import React from "react";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import ImageViewEpisode from "@components/clientComponent/imageViewEpisode";
import VideoEpisode from "@components/clientComponent/videoEpisode";

interface EpisodeDetails {
  id: number;
  episode_number: number;
  name: string;
  air_date: string | null;
  overview: string;
  still_path: string | null;
  runtime: number | null;
  guest_stars: {
    id: number;
    name: string;
    character: string;
    profile_path: string | null;
  }[];
  crew: {
    id: number;
    name: string;
    job: string;
    profile_path: string | null;
  }[];
  images: { stills: { file_path: string }[] };
  videos: { key: string; type: string; site: string }[];
}

interface PageProps {
  params: Promise<{ id: string; seasonNumber: string; episodeId: string }>;
}

// Fetch episode data from TMDb
const fetchEpisodeData = async (
  id: string,
  seasonNumber: string,
  episodeId: string
) => {
  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  if (!apiKey) {
    throw new Error("TMDb API key is missing");
  }

  const url = `https://api.themoviedb.org/3/tv/${id}/season/${seasonNumber}/episode/${episodeId}?api_key=${apiKey}&append_to_response=images,videos`;
  const response = await fetch(url, { cache: "force-cache" });

  if (!response.ok) {
    console.log("API Response:", {
      status: response.status,
      text: await response.text(),
    });
    if (response.status === 404) notFound();
    throw new Error(`Failed to fetch episode data: ${response.status}`);
  }

  const data = await response.json();

  // Fetch series name for breadcrumb
  const seriesResponse = await fetch(
    `https://api.themoviedb.org/3/tv/${id}?api_key=${apiKey}`,
    { cache: "force-cache" }
  );
  if (!seriesResponse.ok) {
    throw new Error(`Failed to fetch series data: ${seriesResponse.status}`);
  }
  const seriesData = await seriesResponse.json();

  return {
    seriesName: seriesData.name,
    seasonNumber: parseInt(seasonNumber, 10),
    episode: {
      id: data.id,
      episode_number: data.episode_number,
      name: data.name,
      air_date: data.air_date,
      overview: data.overview,
      still_path: data.still_path,
      runtime: data.runtime,
      guest_stars: data.guest_stars || [],
      crew: data.crew || [],
      images: data.images || { stills: [] },
      videos: data.videos?.results || [],
    },
  };
};

const EpisodePage = async ({ params }: PageProps) => {
  const id = (await params).id;
  const seasonNumber = (await params).seasonNumber;
  const episodeId = (await params).episodeId;

  console.log("Resolved Params:", { id, seasonNumber, episodeId });

  let data;
  try {
    data = await fetchEpisodeData(id, seasonNumber, episodeId);
  } catch (error) {
    console.log("Fetch Error:", error);
    return (
      <div className="min-h-screen bg-neutral-900 text-neutral-200 flex items-center justify-center p-4">
        <p className="text-red-400 text-center">
          Error: {(error as Error).message}
        </p>
      </div>
    );
  }

  const { seriesName, seasonNumber: seasonNum, episode } = data;

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-200 p-4">
      <div className="max-w-[1520px] mx-auto">
        {/* Breadcrumb Navigation */}
        <nav className="flex flex-row items-center gap-3 mb-6 text-sm text-neutral-400">
          <Link href={`/app/tv/${id}`} className="hover:underline">
            {seriesName}
          </Link>
          <FaChevronRight />
          <Link
            href={`/app/tv/${id}/season/${seasonNumber}`}
            className="hover:underline"
          >
            Season {seasonNumber}
          </Link>{" "}
          <FaChevronRight /> Episode {episode.episode_number}
        </nav>

        {/* Episode Header */}
        <header className="mb-8 flex flex-col sm:flex-row gap-6">
          {episode.still_path && (
            <img
              src={`https://image.tmdb.org/t/p/w300${episode.still_path}`}
              alt={episode.name}
              width={300}
              height={169}
              className="rounded-lg object-cover"
            />
          )}
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-neutral-100 mb-2">
              {episode.name} (S{seasonNum}E
              {episode.episode_number.toString().padStart(2, "0")})
            </h1>
            <p className="text-sm sm:text-base text-neutral-400 mb-2">
              {episode.air_date || "Air date TBA"} •{" "}
              {episode.runtime ? `${episode.runtime} min` : "Runtime TBD"}
            </p>
            <p className="text-sm sm:text-base text-neutral-300">
              {episode.overview || "No overview available."}
            </p>
          </div>
        </header>

        {/* Episode Images with Horizontal Scroll */}
        {episode.images.stills.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-neutral-100 mb-4">
              Images
            </h2>
            <ImageViewEpisode Bimages={episode.images.stills} />
          </section>
        )}

        {/* Episode Videos (e.g., Trailers/Clips) */}
        {episode.videos.length > 0 && (
          <section className="mb-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-neutral-100 mb-4">
              Media Content
            </h2>
            <VideoEpisode videos={episode.videos} />
          </section>
        )}

        {/* Guest Stars */}
        <div className="max-w-5xl m-auto">
          {episode.guest_stars.length > 0 && (
            <section className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-neutral-100 mb-4">
                Guest Stars
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {episode.guest_stars.map((star: any, index: number) => (
                  <Link
                    key={index}
                    href={`/app/person/${star.id}`}
                    className="flex flex-col items-center hover:opacity-80 transition-opacity duration-200"
                  >
                    {star.profile_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w185${star.profile_path}`}
                        alt={star.name}
                        width={185}
                        height={278}
                        className="rounded-md object-cover"
                      />
                    ) : (
                      <div className="w-[185px] h-[278px] bg-neutral-600 rounded-md flex items-center justify-center">
                        <span className="text-xs text-neutral-400">
                          No Image
                        </span>
                      </div>
                    )}
                    <p className="text-sm text-neutral-200 mt-2 text-center hover:underline">
                      {star.name}
                    </p>
                    <p className="text-xs text-neutral-400">{star.character}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* Crew */}
          {episode.crew.length > 0 && (
            <section className="mb-8">
              <h2 className="text-xl sm:text-2xl font-semibold text-neutral-100 mb-4">
                Crew
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {episode.crew.map((member: any, index: number) => (
                  <Link
                    key={index}
                    href={`/app/person/${member.id}`}
                    className="flex flex-col items-center hover:opacity-80 transition-opacity duration-200"
                  >
                    {member.profile_path ? (
                      <img
                        src={`https://image.tmdb.org/t/p/w185${member.profile_path}`}
                        alt={member.name}
                        width={185}
                        height={278}
                        className="rounded-md object-cover"
                      />
                    ) : (
                      <div className="w-[185px] h-[278px] bg-neutral-600 rounded-md flex items-center justify-center">
                        <span className="text-xs text-neutral-400">
                          No Image
                        </span>
                      </div>
                    )}
                    <p className="text-sm text-neutral-200 mt-2 text-center hover:underline">
                      {member.name}
                    </p>
                    <p className="text-xs text-neutral-400">{member.job}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
};

export default EpisodePage;
