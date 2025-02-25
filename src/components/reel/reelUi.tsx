// components/ReelViewer.tsx
"use client";
import React, { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FaArrowDown, FaArrowUp } from "react-icons/fa6";
import Link from "next/link";
import ThreePrefrenceBtn from "../buttons/threePrefrencebtn"; // Adjust path as needed
import { FaSearch } from "react-icons/fa";
import SendMessageModal from "@components/message/sendCard";
import { LuSend } from "react-icons/lu";

interface Movie {
  id: number;
  title: string;
  trailer?: string;
  poster_path?: string;
  genres: string[];
  imdb_id?: string;
  adult: boolean;
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
  const [searchedKeyword, setSearchedKeyword] = useState<string>("");
  const [searchInput, setSearchInput] = useState<string>("");
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [player, setPlayer] = useState<YT.Player | null>(null);
  const [nextLoading, setNextLoading] = useState(false);
  const [imdbRating, setImdbRating] = useState("loading..");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cardData, setCardData] = useState<any>(null);
  const playerRef = useRef<HTMLDivElement>(null);

  // Fetch movies for the current page
  const fetchMovies = async (page: number) => {
    setLoading(page === 1);
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
      setCurrentIndex(0);
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
  }, [selectedKeyword, currentPage, router]);

  useEffect(() => {
    const fetchImdb = async () => {
      setImdbRating("loading..");

      if (movies[currentIndex]?.imdb_id) {
        try {
          const response = await fetch(
            `http://www.omdbapi.com/?i=${movies[currentIndex].imdb_id}&apikey=${process.env.NEXT_PUBLIC_OMDB_API_KEY}`
          );
          const res = await response.json();
          console.log(res);
          setImdbRating(res.imdbRating);
        } catch (error) {
          console.log(error);
          setImdbRating("null");
        }
      } else {
        setImdbRating("no rating");
      }
    };
    fetchImdb();
  }, [movies, currentIndex]);
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
            modestbranding: 0,
            showinfo: 0,
            rel: 0,
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
      setSearchedKeyword(searchInput.trim());
      setSearchInput("");
      setCurrentPage(1);
    }
  };

  const handleKeywordClick = (keyword: string) => {
    setSelectedKeyword(keyword);
    setSearchedKeyword("");
    setCurrentPage(1);
  };
  const handleCardTransfer = (data: any) => {
    setCardData(data);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-neutral-200 flex flex-col items-center p-4">
      <SendMessageModal
        media_type={"movie"}
        data={cardData}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
      {/* Header */}

      {/* Main Layout */}
      <div className="w-full max-w-6xl flex flex-col md:flex-row gap-4">
        {/* Sidebar with Top Keywords */}
        <aside className="w-full md:w-64 flex-shrink-0 order-2 md:order-1">
          <h2 className="text-lg sm:text-xl font-bold text-neutral-100 mb-4 md:block hidden">
            Top Keywords
          </h2>
          <div className="flex flex-wrap md:flex-col gap-2">
            {topKeywords.map((keyword) => (
              <button
                key={keyword}
                onClick={() => handleKeywordClick(keyword)}
                className={`flex-1 md:w-full text-left py-2 px-3 rounded-lg capitalize transition-all duration-200 text-sm sm:text-base ${
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
        <main className="flex-1 order-1 md:order-2 flex flex-col items-center justify-center gap-4">
          <div className="w-full max-w-6xl mb-4">
            <form
              onSubmit={handleSearch}
              className="relative w-full max-w-md mx-auto"
            >
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search for a keyword..."
                className="w-full py-3 px-4 bg-neutral-800 text-neutral-200 rounded-full focus:outline-none focus:ring-2 focus:ring-neutral-500 placeholder-neutral-400 text-sm sm:text-base"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-neutral-700 text-neutral-100 p-2 rounded-full hover:bg-neutral-600"
              >
                <FaSearch size={16} />
              </button>
            </form>
            {/* Keyword Feedback */}
            <div className="mt-2 text-center text-sm sm:text-base text-neutral-400">
              {searchedKeyword ? (
                <p>
                  Searched:{" "}
                  <span className="text-neutral-100 capitalize">
                    {searchedKeyword}
                  </span>
                </p>
              ) : (
                <p>
                  Selected:{" "}
                  <span className="text-neutral-100 capitalize">
                    {selectedKeyword}
                  </span>
                </p>
              )}
            </div>
          </div>
          {loading ? (
            <p className="text-neutral-400 text-sm sm:text-base">
              Loading reels...
            </p>
          ) : error ? (
            <p className="text-red-400 text-sm sm:text-base">Error: {error}</p>
          ) : movies.length > 0 ? (
            <div className="w-full space-y-4">
              {/* Video Player */}
              <div className="relative aspect-[16/9] w-full max-w-3xl mx-auto bg-black rounded-xl overflow-hidden shadow-lg">
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
                {/* IMDB Rating */}
                {movies[currentIndex].imdb_id && (
                  <p className="text-neutral-400 text-xs sm:text-sm">
                    {imdbRating !== "loading.."
                      ? `IMDB Rating: ${imdbRating}`
                      : "IMDB Rating: Loading.."}
                  </p>
                )}
                {/* Navigation Buttons */}
                <div className="flex justify-center gap-4">
                  <button
                    onClick={prevReel}
                    disabled={currentIndex === 0 && currentPage === 1}
                    className="p-3 bg-neutral-700 -rotate-90 text-neutral-200 rounded-full hover:bg-neutral-600 transition-colors duration-200 disabled:opacity-50"
                  >
                    <FaArrowUp size={20} />
                  </button>
                  <button
                    onClick={nextReel}
                    className={`p-3 bg-neutral-700 -rotate-90 text-neutral-200 rounded-full hover:bg-neutral-600 transition-colors duration-200 flex items-center gap-2 ${
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
                {/* Preference Buttons */}
                <div className="mt-2">
                  <ThreePrefrenceBtn
                    cardId={movies[currentIndex].id}
                    cardType="movie"
                    cardName={movies[currentIndex].title}
                    cardAdult={movies[currentIndex].adult}
                    cardImg={movies[currentIndex].poster_path || ""}
                    genres={movies[currentIndex].genres}
                  />
                  <div className="py-2 border-t border-neutral-950 bg-neutral-800 hover:bg-neutral-700">
                    <button
                      className="w-full flex justify-center text-lg text-center text-neutral-100"
                      onClick={() => handleCardTransfer(movies[currentIndex])}
                    >
                      <LuSend />
                    </button>
                  </div>
                </div>
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
