"use client";
import ThreePrefrenceBtn from "@/components/buttons/threePrefrencebtn";
import { GenreList } from "@/staticData/genreList";
import SendMessageModal from "@components/message/sendCard";
import debounce from "lodash/debounce";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { LuSend } from "react-icons/lu";

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
  page: number;
  searched: boolean;
}

function Page() {
  const [results, setResults] = useState<SearchResponse>({
    results: [],
    total_pages: 0,
    total_results: 0,
    page: 1,
    searched: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [displayquery, setdisplayquery] = useState("");
  const [page, setPage] = useState(1);
  const [mediaType, setMediaType] = useState<string>("multi");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cardData, setCardData] = useState<any>(null);

  const topScroll = useRef(null);

  // Debounced fetch function
  const fetchData = useCallback(
    debounce(async (searchQuery: string, searchPage: number, type: string) => {
      if (!searchQuery) {
        setResults({
          results: [],
          total_pages: 0,
          total_results: 0,
          page: 1,
          searched: false,
        });
        setLoading(false);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/homeSearch", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: searchQuery,
            page: searchPage,
            media_type: type,
          }),
          cache: "no-store",
        });

        if (!response.ok) {
          throw new Error(`Network response failed: ${response.status}`);
        }

        const data: SearchResponse = await response.json();
        setResults({
          results: data.results,
          total_pages: data.total_pages,
          total_results: data.total_results,
          page: data.page,
          searched: true,
        });
        setdisplayquery(searchQuery);
        setPage(data.page); // Sync page with API response
      } catch (err) {
        setError(
          (err as Error).message || "An error occurred while fetching data"
        );
        setResults({
          results: [],
          total_pages: 0,
          total_results: 0,
          page: searchPage,
          searched: true,
        });
      } finally {
        setLoading(false);
      }
    }, 300),
    []
  );

  // Handle search submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      handleScroll(topScroll.current);
      setPage(1);
      fetchData(query, 1, mediaType);
    } else {
      setResults({
        results: [],
        total_pages: 0,
        total_results: 0,
        page: 1,
        searched: false,
      });
      setError(null);
    }
  };
  useEffect(() => {
    fetchData(query, 1, mediaType);
  }, [mediaType]);
  // Handle page change
  const changePage = useCallback(
    (newPage: number) => {
      if (query && newPage >= 1 && newPage <= results.total_pages) {
        handleScroll(topScroll.current);
        setPage(newPage);

        fetchData(query, newPage, mediaType);
      }
    },
    [query, mediaType, results.total_pages, fetchData]
  );

  const handleCardTransfer = (data: SearchResult) => {
    setCardData(data);
    setIsModalOpen(true);
  };

  const handleScroll = (ref: HTMLDivElement | null) => {
    if (ref) {
      const element = ref;
      const elementRect = element.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const scrollTop = window.scrollY || document.documentElement.scrollTop;

      // Calculate position to center the element in the viewport
      const centerPosition =
        scrollTop +
        elementRect.top -
        viewportHeight / 2 +
        elementRect.height / 2;

      window.scrollTo({
        top: element.offsetTop - 100,
        behavior: "smooth",
      });
    }
  };

  // Render card based on media type
  const renderCard = (data: SearchResult) => {
    const isPerson = data.media_type === "person" || mediaType == "person";
    const title = data.title || data.name || "Unknown";
    const imageUrl = isPerson
      ? data.profile_path
        ? `https://image.tmdb.org/t/p/h632${data.profile_path}`
        : "/no-photo.webp"
      : data.poster_path || data.backdrop_path
      ? `https://image.tmdb.org/t/p/w342${
          data.poster_path || data.backdrop_path
        }`
      : "/no-photo.webp";

    return (
      <div
        key={data.id}
        className={`relative group flex flex-col h-auto ${
          isPerson ? "bg-indigo-700" : "bg-neutral-900"
        } w-full h-full text-gray-300 rounded-md overflow-hidden hover:z-10`}
      >
        <div className="absolute top-0 left-0 flex flex-row justify-between w-full  z-10">
          <p className="p-1 bg-black text-white rounded-br-md text-sm">
            {data.media_type
              ? data.media_type
              : mediaType == "movie"
              ? "movie"
              : mediaType == "tv"
              ? "tv"
              : "person"}
          </p>
          {!isPerson && (data.release_date || data.first_air_date) && (
            <p className="p-1 bg-indigo-600 text-white rounded-bl-md text-sm">
              {new Date(
                data.release_date || data.first_air_date || ""
              ).getFullYear() || "N/A"}
            </p>
          )}
        </div>
        <Link
          href={`/app/${
            data.media_type
              ? data.media_type
              : mediaType == "movie"
              ? "movie"
              : mediaType == "tv"
              ? "tv"
              : "person"
          }/${data.id}-${title
            .trim()
            .replace(/[^a-zA-Z0-9]/g, "-")
            .replace(/-+/g, "-")}`}
          className="h-full w-full"
        >
          <img
            className="object-cover w-full h-[250px] md:h-[320px]"
            src={imageUrl}
            alt={title}
          />
        </Link>
        <div
          className={`${isPerson ? "bg-indigo-700" : "w-full bg-neutral-900 "}`}
        >
          {!isPerson && (
            <>
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
                cardType={data.media_type}
                cardName={title}
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
            </>
          )}
          <div
            title={title}
            className="w-full flex flex-col gap-2 px-4 py-2 bg-indigo-700 text-gray-200"
          >
            <Link
              href={`/app/${
                data.media_type
                  ? data.media_type
                  : mediaType == "movie"
                  ? "movie"
                  : mediaType == "tv"
                  ? "tv"
                  : "person"
              }/${data.id}-${title
                .trim()
                .replace(/[^a-zA-Z0-9]/g, "-")
                .replace(/-+/g, "-")}`}
              className="hover:underline"
            >
              <span>
                {title.length > 20 ? `${title.slice(0, 20)}...` : title}
              </span>
            </Link>
            {isPerson && data.known_for_department && (
              <div className="text-xs underline">
                {data.known_for_department}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div
      ref={topScroll}
      className=" mx-auto w-full max-w-7xl px-4 py-6 text-white"
    >
      {/* Search Bar and Filter */}
      <form
        onSubmit={handleSearch}
        className="mb-8 flex flex-col sm:flex-row gap-4 items-center"
      >
        <input
          type="text"
          value={query}
          onKeyDown={(e) => e.key == "enter" && handleSearch}
          onChange={(e) => setQuery(e.target.value)}
          className="px-4 py-2 w-full sm:flex-1 bg-neutral-800 text-white rounded-md border-1 border-neutral-600 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-0"
          placeholder="Search for movies, TV shows, or people..."
        />
        <select
          value={mediaType}
          onChange={(e) => setMediaType(e.target.value)}
          className="px-4 py-2 bg-neutral-700 rounded-md text-white"
        >
          <option value="multi">All</option>
          <option value="movie">Movies</option>
          <option value="tv">TV Shows</option>
          <option value="person">Person</option>
        </select>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Search
        </button>
      </form>

      {/* Loading State */}
      {loading && (
        <div className="min-h-52 w-full flex justify-center items-center">
          Loading...
        </div>
      )}

      {/* Results or Prompt */}
      {!loading && (
        <div className="w-full h-auto my-4">
          {results.total_results > 0 && (
            <div className="mb-4">
              <p>
                Search Results: "{displayquery}" - {results.total_results} items
              </p>
            </div>
          )}

          {results.total_results === 0 && results.searched && (
            <div className="flex flex-col h-full w-full gap-5 items-center justify-center">
              <p className="text-lg">
                Result for "
                <span className="text-pink-600">{displayquery}</span>"
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

          {!query && (
            <p className="text-center text-sm">
              Please enter a search query to see results.
            </p>
          )}

          {results.results.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {results.results.map((data) => renderCard(data))}
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      {!loading && results.total_pages > 1 && (
        <div className="flex flex-row justify-center items-center my-6">
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

      {mediaType !== "person" && cardData && (
        <SendMessageModal
          media_type={cardData.media_type}
          data={cardData}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}

export default Page;
