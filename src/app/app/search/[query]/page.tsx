"use client";
import { useSearch } from "@/app/contextAPI/searchContext";
import ThreePrefrenceBtn from "@/components/buttons/threePrefrencebtn";
import SendMessageModal from "@components/message/sendCard";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { LuSend } from "react-icons/lu";
import { GenreList } from "@/staticData/genreList";

interface SearchResult {
  id: number;
  media_type: "movie" | "tv" | "person" | "keyword";
  title?: string;
  name: string;
  poster_path?: string;
  backdrop_path?: string;
  release_date?: string;
  first_air_date?: string;
  genre_ids?: number[];
  adult?: boolean;
  profile_path?: string;
  known_for_department?: string;
}

interface SearchResponse {
  results: SearchResult[];
  total_pages: number;
  total_results: number;
}

function SearchPage() {
  const [results, setResults] = useState<SearchResponse>({
    results: [],
    total_pages: 0,
    total_results: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { setIsSearchLoading } = useSearch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cardData, setCardData] = useState<any>(null);
  const [page, setPage] = useState<number>(1);

  // Get query and media type from URL
  const params = useParams();
  const searchParams = useSearchParams();
  const query = Array.isArray(params.query)
    ? params.query[0]
    : params.query || "";
  const mediaType = searchParams.get("media_type") || "multi"; // Default to "multi"
  const urlPage = Number(searchParams.get("page")) || 1;

  // Sync page state with URL
  useEffect(() => {
    setPage(urlPage);
  }, [urlPage]);

  // Fetch data from the API
  useEffect(() => {
    const fetchData = async () => {
      if (!query) {
        setError("Search query is required");
        setLoading(false);
        setIsSearchLoading(false);
        return;
      }

      setLoading(true);
      setIsSearchLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/searchPage", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: decodeURIComponent(query),
            media_type: mediaType,
            page: page,
          }),
          cache: "no-store", // Ensure fresh data
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status}`);
        }

        const data: SearchResponse = await response.json();
        setResults(data);
      } catch (err) {
        setError(
          (err as Error).message || "An error occurred while fetching data"
        );
        setResults({ results: [], total_pages: 0, total_results: 0 });
      } finally {
        setLoading(false);
        setIsSearchLoading(false);
      }
    };

    fetchData();
  }, [query, page, mediaType, setIsSearchLoading]);

  // Handle card transfer for sending messages
  const handleCardTransfer = (data: SearchResult) => {
    setCardData(data);
    setIsModalOpen(true);
  };

  // Early return for error state
  if (error) {
    return (
      <div className="min-h-screen mx-auto w-full max-w-7xl px-4 py-6 text-white flex items-center justify-center">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen mx-auto w-full max-w-7xl px-4 py-6">
      {mediaType !== "person" && cardData && (
        <SendMessageModal
          media_type={cardData.media_type}
          data={cardData}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      {/* Loading State */}
      {loading && (
        <div className="min-h-screen w-full flex justify-center items-center text-white">
          Loading...
        </div>
      )}

      {/* Results */}
      {!loading && (
        <div className="text-white w-full my-4">
          {results.total_results > 0 && (
            <div className="mb-4">
              <p>
                Search Results: For {mediaType} - {results.total_results} items
              </p>
            </div>
          )}

          {/* "Result not found" message */}
          {!loading && results.total_results === 0 && (
            <div className="flex flex-col h-full w-full gap-5 items-center justify-center text-white">
              <p className="text-lg">
                Result for "
                <span className="text-pink-600">
                  {decodeURIComponent(query)}
                </span>
                "
                <span className="font-bold text-purple-600"> is not found</span>{" "}
                - or check your spelling
              </p>
              <img
                src="/abhijeetray.webp"
                alt="not-found"
                className="max-w-md"
              />
            </div>
          )}

          {/* Display results */}
          {results.total_results > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {results.results.map((data: SearchResult) => {
                const displayMediaType =
                  mediaType === "keyword" ? "movie" : mediaType;

                if (displayMediaType === "person") {
                  return (
                    <div
                      key={data.id}
                      className="relative group flex flex-col bg-indigo-700 w-full h-full pb-2 text-gray-300 rounded-md overflow-hidden hover:z-10"
                    >
                      <div className="absolute top-0 left-0 flex flex-row justify-between w-full z-10">
                        <p className="p-1 bg-black text-white rounded-br-md text-sm">
                          person
                        </p>
                      </div>
                      <Link
                        href={`/app/person/${data.id}`}
                        className="h-full w-full"
                      >
                        <img
                          className="object-cover h-full w-full"
                          src={
                            data.profile_path
                              ? `https://image.tmdb.org/t/p/h632${data.profile_path}`
                              : "/no-photo.webp"
                          }
                          alt={data.name || "Unknown"}
                        />
                      </Link>
                      <span className="bg-indigo-700 flex flex-col gap-3 py-2 px-2 text-gray-300">
                        <Link
                          href={`/app/person/${data.id}`}
                          className="group-hover:underline"
                        >
                          {data.name?.length > 16
                            ? `${data.name.slice(0, 14)}..`
                            : data.name || "Unknown"}
                        </Link>
                        {data.known_for_department && (
                          <div className="text-xs underline">
                            {data.known_for_department}
                          </div>
                        )}
                      </span>
                    </div>
                  );
                } else if (
                  displayMediaType === "movie" ||
                  displayMediaType === "tv"
                ) {
                  return (
                    <div
                      key={data.id}
                      className="relative group flex flex-col bg-neutral-900 w-full h-full text-gray-300 rounded-md overflow-hidden hover:z-10"
                    >
                      <div className="absolute top-0 left-0 flex flex-row justify-between w-full z-10">
                        <p className="p-1 bg-black text-white rounded-br-md text-sm">
                          {displayMediaType}
                        </p>
                        {(data.release_date || data.first_air_date) && (
                          <p className="p-1 bg-indigo-600 text-white rounded-bl-md text-sm">
                            {new Date(
                              data.release_date || data.first_air_date || ""
                            ).getFullYear() || "N/A"}
                          </p>
                        )}
                      </div>
                      <Link
                        href={`/app/${displayMediaType}/${data.id}`}
                        className="h-full w-full"
                      >
                        <img
                          className="object-cover w-full h-full"
                          src={
                            data.poster_path || data.backdrop_path
                              ? `https://image.tmdb.org/t/p/w342${
                                  data.poster_path || data.backdrop_path
                                }`
                              : "/no-photo.webp"
                          }
                          alt={data.title || data.name || "Unknown"}
                        />
                      </Link>
                      <div className="w-full bg-neutral-900">
                        <ThreePrefrenceBtn
                          genres={
                            data.genre_ids
                              ?.map((id: number) => {
                                const genre = GenreList.genres.find(
                                  (g: any) => g.id === id
                                );
                                return genre ? genre.name : null;
                              })
                              .filter(Boolean) || []
                          }
                          cardId={data.id}
                          cardType={displayMediaType}
                          cardName={data.name || data.title || "Unknown"}
                          cardAdult={data.adult}
                          cardImg={data.poster_path || data.backdrop_path}
                        />
                        <div className="py-2 border-t border-neutral-950 bg-neutral-800 hover:bg-neutral-700">
                          <button
                            className="w-full flex justify-center text-lg text-center text-gray-300 hover:text-white"
                            onClick={() => handleCardTransfer(data)}
                          >
                            <LuSend />
                          </button>
                        </div>
                        <div
                          title={data.name || data.title || "Unknown"}
                          className="w-full flex flex-col h-full gap-2 px-4 bg-indigo-700 text-gray-200"
                        >
                          <Link
                            href={`/app/${displayMediaType}/${data.id}`}
                            className="mb-1 hover:underline"
                          >
                            <span>
                              {(data.title || data.name || "").length > 20
                                ? `${(data.title || data.name || "").slice(
                                    0,
                                    20
                                  )}...`
                                : data.title || data.name || "Unknown"}
                            </span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                } else {
                  return null; // Handle unexpected media types
                }
              })}
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      {!loading && results.total_pages > 1 && (
        <div className="flex flex-row justify-center items-center my-6 text-white">
          <Link
            href={`/app/search/${encodeURIComponent(
              query
            )}?media_type=${mediaType}&page=${page - 1}`}
            className={`px-4 py-2 bg-neutral-700 rounded-md hover:bg-neutral-600 ${
              page === 1 ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            Previous
          </Link>
          <span className="mx-4">
            Page {page} of {results.total_pages}
          </span>
          <Link
            href={`/app/search/${encodeURIComponent(
              query
            )}?media_type=${mediaType}&page=${page + 1}`}
            className={`px-4 py-2 bg-neutral-700 rounded-md hover:bg-neutral-600 ${
              page === results.total_pages
                ? "opacity-50 pointer-events-none"
                : ""
            }`}
          >
            Next
          </Link>
        </div>
      )}
    </div>
  );
}

export default SearchPage;
