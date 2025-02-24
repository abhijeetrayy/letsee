// components/HomeReelViewer.tsx
"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { FaVolumeMute, FaVolumeUp } from "react-icons/fa";

interface Movie {
  id: number;
  title: string;
  trailer?: any;
}

const HomeReelViewer: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const playerRef = useRef<HTMLDivElement>(null);
  const playerInstance = useRef<YT.Player | null>(null);

  // Mark component as mounted on client
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Fetch top 5 movies with trailers
  useEffect(() => {
    const fetchTopMovies = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch("/api/homeVideo", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          cache: "force-cache",
          next: { revalidate: 86400 }, // Cache for 1 day
        });
        if (!response.ok) throw new Error("Failed to fetch top movies");
        const data = await response.json();
        setMovies(data.slice(0, 5));
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchTopMovies();
  }, []);

  // Initialize YouTube Player only after mount
  useEffect(() => {
    if (!isMounted || !movies[currentIndex]?.trailer) return;

    const loadPlayerScript = () => {
      if (!window.YT) {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName("script")[0];
        firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
      }
    };

    const initializePlayer = () => {
      if (playerRef.current && window.YT?.Player) {
        const videoId = movies[currentIndex].trailer.split("embed/")[1];
        if (playerInstance.current) {
          playerInstance.current.destroy();
        }
        playerInstance.current = new window.YT.Player(playerRef.current, {
          width: "1280", // 720p resolution
          height: "720",
          videoId,
          playerVars: {
            autoplay: 1,
            mute: 1,
            controls: 0,
            modestbranding: 1,
            showinfo: 0,
            rel: 0,
          },
          events: {
            onReady: (event: YT.PlayerEvent) => {
              event.target.playVideo();
              setIsMuted(true);
            },
            onStateChange: (event: YT.OnStateChangeEvent) => {
              if (event.data === window.YT.PlayerState.ENDED) {
                nextMovie();
              }
            },
          },
        });
      }
    };

    loadPlayerScript();
    if (window.YT && window.YT.Player) {
      initializePlayer();
    } else {
      window.onYouTubeIframeAPIReady = initializePlayer;
    }

    return () => {
      if (playerInstance.current) {
        playerInstance.current.destroy();
        playerInstance.current = null;
      }
    };
  }, [isMounted, movies, currentIndex]);

  const nextMovie = () => {
    const nextIndex = (currentIndex + 1) % movies.length;
    setCurrentIndex(nextIndex);
  };

  const prevMovie = () => {
    const prevIndex = (currentIndex - 1 + movies.length) % movies.length;
    setCurrentIndex(prevIndex);
  };

  const goToMovie = (index: number) => {
    setCurrentIndex(index);
  };

  const toggleMute = () => {
    if (playerInstance.current) {
      if (isMuted) {
        playerInstance.current.unMute();
      } else {
        playerInstance.current.mute();
      }
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="relative max-w-[1920px] mx-auto w-full h-[40rem] bg-black flex flex-col md:flex-row rounded-md overflow-hidden">
      {/* Video Section (3/4 width) */}
      <div className="relative w-full md:w-3/4 h-full">
        {loading ? (
          <p className="text-neutral-400 text-center absolute inset-0 flex items-center justify-center">
            Loading top movies...
          </p>
        ) : error ? (
          <p className="text-red-400 text-center absolute inset-0 flex items-center justify-center">
            Error: {error}
          </p>
        ) : movies.length > 0 ? (
          <>
            <div className="absolute inset-0 aspect-[16/9] w-full h-full">
              <div
                ref={playerRef}
                className="w-full h-full"
                suppressHydrationWarning
              />
            </div>

            {/* Title Overlay */}
            <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 z-10">
              <Link
                href={`/app/movie/${movies[currentIndex].id}`}
                target="_blank"
                className="text-white text-base sm:text-xl md:text-2xl font-bold drop-shadow-lg hover:underline"
              >
                {movies[currentIndex].title}
              </Link>
            </div>

            {/* Mute/Unmute Button */}
            <button
              onClick={toggleMute}
              className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 p-2 bg-neutral-800 bg-opacity-70 text-white rounded-full hover:bg-opacity-90 transition-all duration-200"
            >
              {isMuted ? <FaVolumeMute size={20} /> : <FaVolumeUp size={20} />}
            </button>

            {/* Navigation Dots */}
            <div className="absolute bottom-2 sm:bottom-4 left-1/2 transform -translate-x-1/2 z-10 flex gap-2">
              {movies.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToMovie(index)}
                  className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
                    currentIndex === index
                      ? "bg-white scale-125"
                      : "bg-neutral-500 hover:bg-neutral-300"
                  }`}
                />
              ))}
            </div>
          </>
        ) : (
          <p className="text-neutral-400 text-center absolute inset-0 flex items-center justify-center">
            No top movies found
          </p>
        )}
      </div>

      {/* Promo Section (1/4 width) */}
      <div className="w-full md:w-1/4 h-full bg-neutral-800 flex flex-col items-center justify-center p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold text-neutral-100 mb-4 text-center">
          Explore More Reels
        </h2>
        <p className="text-sm sm:text-base text-neutral-400 mb-6 text-center">
          Dive into personalized movie recommendations with our reels feature.
        </p>
        <Link
          href="/app/reel"
          className="bg-blue-600 text-white py-2 px-4 sm:py-3 sm:px-6 rounded-lg text-sm sm:text-base font-semibold hover:bg-blue-700 transition-colors duration-300"
        >
          Watch Reels
        </Link>
      </div>
    </div>
  );
};

export default HomeReelViewer;
