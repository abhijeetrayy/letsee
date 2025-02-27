"use client";
import { useSearch } from "@/app/contextAPI/searchContext";
import ThreePrefrenceBtn from "@/components/buttons/threePrefrencebtn";
import SendMessageModal from "@components/message/sendCard";
import Link from "next/link";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
import { LuSend } from "react-icons/lu";
import { GenreList } from "@/staticData/genreList";
import debounce from "lodash/debounce";

interface SearchResult {
  id: number;
  media_type: "movie" | "tv" | "person";
  title?: string;
  name: string;
  poster_path?: string;
  backdrop_path?: string;
  release_date?: string;
  first_air_date?: string;
  genre_ids?: number[];
  adult: boolean;
  profile_path?: string;
  known_for_department?: string;
}

interface SearchResponse {
  results: SearchResult[];
  total_pages: number;
  total_results: number;
}

function Page() {
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

  // Filter states
  const [mediaType, setMediaType] = useState<string>("multi"); // multi, movie, tv, person
  const [includeAdult, setIncludeAdult] = useState<boolean>(false);
  const [year, setYear] = useState<string>("");
  const [region, setRegion] = useState<string>("");
  const [language, setLanguage] = useState<string>("en-US");

  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const query = Array.isArray(params.query)
    ? params.query[0]
    : params.query || "";

  const page = Number(searchParams.get("page")) || 1;

  // Fetch data function
  const fetchData = useCallback(
    debounce(async (searchQuery: string, searchPage: number) => {
      if (!searchQuery) {
        setError("Search query is required");
        setLoading(false);
        setIsSearchLoading(false);
        return;
      }

      setLoading(true);
      setIsSearchLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: searchQuery,
            page: searchPage,
            media_type: mediaType,
            include_adult: includeAdult,
            year: year || null,
            region: region || null,
            language,
          }),
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`Network response failed: ${response.status}`);
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
    }, 300),
    [mediaType, includeAdult, year, region, language, setIsSearchLoading]
  );

  // Fetch data when query or page changes
  useEffect(() => {
    fetchData(query, page);
  }, [query, page, fetchData]);

  // Reset to page 1 when mediaType changes
  useEffect(() => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set("page", "1"); // Set page to 1
    router.push(`/app/search/${query}?${newSearchParams.toString()}`);
  }, [mediaType]); // Trigger when mediaType changes

  const changePage = useCallback(
    (newPage: number) => {
      setLoading(true);
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set("page", newPage.toString());
      router.push(`/app/search/${query}?${newSearchParams.toString()}`);
    },
    [query, router, searchParams]
  );

  const handleCardTransfer = (data: SearchResult) => {
    setCardData(data);
    setIsModalOpen(true);
  };

  const applyFilters = () => {
    fetchData(query, 1); // Reset to page 1
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

      {/* Filters */}
      <div className="mb-6 bg-neutral-800 p-4 rounded-md text-white">
        <h2 className="text-lg font-semibold mb-4">Filters</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm mb-5">Search Type</label>
            <select
              value={mediaType}
              onChange={(e) => setMediaType(e.target.value)}
              className="w-full p-2 bg-neutral-700 rounded-md text-white"
            >
              <option value="multi">All</option>
              <option value="movie">Movies</option>
              <option value="tv">TV Shows</option>
              <option value="person">People</option>
            </select>
          </div>
          {/* <div className="flex items-center">
            <label className="text-sm mr-2">Include Adult</label>
            <input
              type="checkbox"
              checked={includeAdult}
              onChange={(e) => setIncludeAdult(e.target.checked)}
              className="w-5 h-5"
            />
          </div> */}
          {/* <div>
            <label className="block text-sm mb-1">Year</label>
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="e.g., 2023"
              className="w-full p-2 bg-neutral-700 rounded-md text-white"
              min="1900"
              max={new Date().getFullYear()}
            />
          </div> */}
          {/* <div>
            <label className="block text-sm mb-1">Region (e.g., US)</label>
            <input
              type="text"
              value={region}
              onChange={(e) => setRegion(e.target.value.toUpperCase())}
              placeholder="e.g., US"
              className="w-full p-2 bg-neutral-700 rounded-md text-white"
              maxLength={2}
            />
          </div> */}
          {/* <div>
            <label className="block text-sm mb-1">Language</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full p-2 bg-neutral-700 rounded-md text-white"
            >
              <option value="en-US">English (US)</option>
              <option value="es-ES">Spanish (ES)</option>
              <option value="fr-FR">French (FR)</option>
              <option value="de-DE">German (DE)</option>
            </select>
          </div> */}
        </div>
        {/* <button
          onClick={applyFilters}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Apply Filters
        </button> */}
      </div>

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
                Search Results: "{decodeURIComponent(query)}" -{" "}
                {results.total_results} items
              </p>
            </div>
          )}

          {results.total_results === 0 && (
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
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {results.results.map((data: SearchResult) => {
              // Determine the media type to display
              const displayMediaType =
                mediaType === "multi" ? data.media_type : mediaType;

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
                      href={`/app/person/${data.id}-${
                        data.name
                          ?.trim()
                          .replace(/[^a-zA-Z0-9]/g, "-")
                          .replace(/-+/g, "-") || "unknown"
                      }`}
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
                        href={`/app/person/${data.id}-${
                          data.name
                            ?.trim()
                            .replace(/[^a-zA-Z0-9]/g, "-")
                            .replace(/-+/g, "-") || "unknown"
                        }`}
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
                      href={`/app/${displayMediaType}/${data.id}-${(
                        data.name ||
                        data.title ||
                        ""
                      )
                        .trim()
                        .replace(/[^a-zA-Z0-9]/g, "-")
                        .replace(/-+/g, "-")}`}
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
                    <div className="w-full bg-neutral-900 ">
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
                        className="w-full flex flex-col h-full gap-2 px-4 bg-indigo-700 text-gray-200 "
                      >
                        <Link
                          href={`/app/${displayMediaType}/${data.id}-${(
                            data.name ||
                            data.title ||
                            ""
                          )
                            .trim()
                            .replace(/[^a-zA-Z0-9]/g, "-")
                            .replace(/-+/g, "-")}`}
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
        </div>
      )}

      {/* Pagination */}
      {!loading && results.total_pages > 1 && (
        <div className="flex flex-row justify-center items-center my-6 text-white">
          <button
            className="px-4 py-2 bg-neutral-700 rounded-md hover:bg-neutral-600 disabled:opacity-50"
            onClick={() => changePage(page - 1)}
            disabled={page === 1}
          >
            Previous
          </button>
          <span className="mx-4">
            Page {page} of {results.total_pages}
          </span>
          <button
            className="px-4 py-2 bg-neutral-700 rounded-md hover:bg-neutral-600 disabled:opacity-50"
            onClick={() => changePage(page + 1)}
            disabled={page === results.total_pages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default Page;
