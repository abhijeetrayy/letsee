// components/ReelViewer.tsx
"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FaArrowDown, FaArrowUp } from "react-icons/fa6";
import ThreePrefrencebtn from "../buttons/threePrefrencebtn"; // Adjust path as needed
import Link from "next/link";

interface Movie {
  id: number;
  title: string;
  trailer?: string;
}

const topKeywords = [
  "comedy",
  "action",
  "drama",
  "horror",
  "romance",
  "sci-fi",
  "thriller",
  "adventure",
  "fantasy",
  "mystery",
  "crime",
  "animation",
  "family",
  "documentary",
  "history",
];

const ReelViewer: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const genreFromUrl = searchParams.get("genre");

  const [selectedKeyword, setSelectedKeyword] = useState<string>(
    genreFromUrl || "action"
  );
  const [searchInput, setSearchInput] = useState<string>("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [player, setPlayer] = useState<YT.Player | null>(null);
  const [nextLoading, setNextLoading] = useState(false);
  const playerRef = useRef<HTMLDivElement>(null);

  // Fetch movies for the current page
  const fetchMovies = async (page: number) => {
    setLoading(page === 1); // Only show initial loading on page 1
    setError(null);
    try {
      const response = await fetch("/api/movieReel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword: selectedKeyword, page }),
      });
      if (!response.ok) throw new Error("Failed to fetch movies");
      const { movies: newMovies, totalPages: pages } = await response.json();
      setMovies(newMovies);
      setTotalPages(pages);
      setCurrentIndex(0); // Reset to first movie of the page
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
      setNextLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies(currentPage);
    router.push(`/app/reel?keyword=${selectedKeyword}&page=${currentPage}`, {
      scroll: false,
    });
  }, [selectedKeyword, currentPage]);

  // Initialize YouTube Player
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
    }

    const initializePlayer = () => {
      if (
        playerRef.current &&
        movies[currentIndex]?.trailer &&
        window.YT?.Player
      ) {
        const videoId = movies[currentIndex].trailer.split("embed/")[1];
        const newPlayer = new window.YT.Player(playerRef.current, {
          height: "100%",
          width: "100%",
          videoId,
          playerVars: {
            autoplay: 1,
            mute: 1,
            controls: 1,
          },
          events: {
            onReady: (event: YT.PlayerEvent) => {
              setPlayer(event.target);
            },
            onStateChange: (event: YT.OnStateChangeEvent) => {
              if (event.data === window.YT.PlayerState.PLAYING) {
                event.target.unMute();
              }
              if (event.data === window.YT.PlayerState.ENDED) {
                nextReel();
              }
            },
          },
        });
      }
    };

    if (window.YT && window.YT.Player) {
      initializePlayer();
    } else {
      window.onYouTubeIframeAPIReady = initializePlayer;
    }

    return () => {
      if (player) {
        player.destroy();
        setPlayer(null);
      }
    };
  }, [movies, currentIndex]);

  const nextReel = () => {
    if (currentIndex + 1 < movies.length) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      if (player && movies[nextIndex]?.trailer) {
        const nextVideoId = movies[nextIndex].trailer.split("embed/")[1];
        player.loadVideoById(nextVideoId);
      }
    } else if (currentPage < totalPages) {
      setNextLoading(true);
      setCurrentPage((prev) => prev + 1);
    }
  };

  const prevReel = () => {
    if (currentIndex > 0) {
      const prevIndex = currentIndex - 1;
      setCurrentIndex(prevIndex);
      if (player && movies[prevIndex]?.trailer) {
        const prevVideoId = movies[prevIndex].trailer.split("embed/")[1];
        player.loadVideoById(prevVideoId);
      }
    } else if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSelectedKeyword(searchInput.trim());
      setSearchInput("");
      setCurrentPage(1);
    }
  };

  const handlePageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newPage = parseInt(e.target.value, 10);
    setCurrentPage(newPage);
  };

  const handleItemChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newIndex = parseInt(e.target.value, 10);
    setCurrentIndex(newIndex);
    if (player && movies[newIndex]?.trailer) {
      const videoId = movies[newIndex].trailer.split("embed/")[1];
      player.loadVideoById(videoId);
    }
  };

  return (
    <div className=" justify-center  items-center text-neutral-200 flex">
      {/* Header with Search Bar */}

      {/* Main Layout */}
      <div className="max-w-6xl w-full flex flex-col md:flex-row flex-1 overflow-hidden">
        {/* Sidebar with Top Keywords */}
        <aside className="w-full md:w-64 p-4   overflow-y-auto">
          <h2 className="text-xl font-bold my-4 text-neutral-100 hidden md:block">
            Top Keywords
          </h2>
          <div
            className="
          flex flex-row gap-2 md:flex-col  "
          >
            {topKeywords.map((keyword) => (
              <button
                key={keyword}
                onClick={() => {
                  setCurrentPage(1);
                  setSelectedKeyword(keyword);
                }}
                className={`w-full text-left py-2 px-3 rounded-lg capitalize transition-all duration-200 text-sm sm:text-base ${
                  selectedKeyword === keyword
                    ? "bg-neutral-700 text-neutral-100 shadow-md"
                    : "bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
                }`}
              >
                {keyword}
              </button>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col   items-center justify-center gap-2 p-4 overflow-y-auto">
          <form onSubmit={handleSearch} className="w-full max-w-md mx-auto">
            <div className="relative">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search for a keyword..."
                className="w-full py-2 px-4 bg-neutral-700 text-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-neutral-500 placeholder-neutral-400 text-sm sm:text-base"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-neutral-600 text-neutral-100 p-1.5 rounded-md hover:bg-neutral-500"
              >
                Search
              </button>
            </div>
          </form>
          {loading ? (
            <p className="text-neutral-400 text-sm sm:text-base">
              Loading reels...
            </p>
          ) : error ? (
            <p className="text-red-400 text-sm sm:text-base">Error: {error}</p>
          ) : movies.length > 0 ? (
            <div className="w-full max-w-3xl space-y-4">
              {/* Video Player */}
              <div className="relative aspect-[16/9] bg-black rounded-xl overflow-hidden shadow-lg">
                <div ref={playerRef} className="w-full h-full" />
              </div>

              {/* Video Info and Controls */}
              <div className="space-y-4 text-center">
                <Link
                  target="_blank"
                  href={`/app/movie/${movies[currentIndex].id}`}
                  className="text-lg sm:text-xl font-semibold text-neutral-100 hover:underline"
                >
                  {movies[currentIndex].title}{" "}
                  <span className="text-xs sm:text-sm text-neutral-400">
                    (view)
                  </span>
                </Link>
                <p className="text-neutral-400 text-xs sm:text-sm">
                  {currentIndex + 1} of {movies.length} (Page {currentPage} of{" "}
                  {totalPages})
                </p>

                {/* Navigation Buttons */}
                <div className="flex justify-center gap-3">
                  <button
                    onClick={prevReel}
                    disabled={currentIndex === 0 && currentPage === 1}
                    className="p-2 bg-neutral-700 text-neutral-200 rounded-full hover:bg-neutral-600 transition-colors duration-200 disabled:opacity-50"
                  >
                    <FaArrowUp size={20} />
                  </button>
                  <button
                    onClick={nextReel}
                    className={`p-2 bg-neutral-700 text-neutral-200 rounded-full hover:bg-neutral-600 transition-colors duration-200 flex items-center gap-2 ${
                      nextLoading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {nextLoading ? (
                      <span className="animate-spin text-sm">⏳</span>
                    ) : (
                      <FaArrowDown size={20} />
                    )}
                  </button>
                </div>

                {/* Page and Item Selectors */}
                <div className="flex flex-col sm:flex-row justify-center gap-3">
                  <select
                    value={currentIndex}
                    onChange={handleItemChange}
                    className="w-full sm:w-48 bg-neutral-700 text-neutral-200 py-2 px-3 rounded-lg text-sm"
                  >
                    {movies.map((movie, index) => (
                      <option key={movie.id} value={index}>
                        {movie.title}
                      </option>
                    ))}
                  </select>
                  <select
                    value={currentPage}
                    onChange={handlePageChange}
                    className="w-full sm:w-32 bg-neutral-700 text-neutral-200 py-2 px-3 rounded-lg text-sm"
                  >
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (page) => (
                        <option key={page} value={page}>
                          Page {page}
                        </option>
                      )
                    )}
                  </select>
                </div>

                {/* Three Preference Buttons */}
                {/* <div className="mt-2">
                  <ThreePrefrencebtn
                    cardId={movies[currentIndex].id}
                    cardType="movie"
                    cardName={movies[currentIndex].title}
                    cardAdult={false}
                    cardImg=""
                    genres={[]}
                  />
                </div> */}
              </div>
            </div>
          ) : (
            <p className="text-neutral-400 text-sm sm:text-base">
              No movies found for this keyword
            </p>
          )}
        </main>
      </div>
    </div>
  );
};

export default ReelViewer;
