"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import {
  FaChevronLeft,
  FaChevronRight,
  FaVolumeMute,
  FaVolumeUp,
} from "react-icons/fa";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

// Extend Window interface for YouTube IFrame API
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: (() => void) | undefined;
  }
}

interface Movie {
  id: number;
  title: string;
  trailer?: string;
  poster_path?: string;
}

const FALLBACK_IMAGE = "/backgroundjpeg.webp";

const HomeReelViewer: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [useFallback, setUseFallback] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const playerRef = useRef<HTMLDivElement>(null);
  const playerInstance = useRef<YT.Player | null>(null);
  const videoSectionRef = useRef<HTMLDivElement>(null);
  const isMounted = useRef(false);

  // Fetch top 5 movies with trailers
  useEffect(() => {
    const fetchTopMovies = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/homeVideo", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          cache: "force-cache",
          next: { revalidate: 86400 },
        });
        if (!response.ok) throw new Error("Failed to fetch top movies");
        const data = await response.json();
        const validMovies = data
          .slice(0, 5)
          .filter((movie: Movie) => movie.id && movie.title);
        setMovies(
          validMovies.length > 0
            ? validMovies
            : [
                {
                  id: 0,
                  title: "No Video Available",
                  poster_path: FALLBACK_IMAGE,
                },
              ]
        );
      } catch (err) {
        console.error("Fetch Error:", err);
        setMovies([
          { id: 0, title: "No Video Available", poster_path: FALLBACK_IMAGE },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchTopMovies();
  }, []);

  // Load YouTube script with error handling
  useEffect(() => {
    const loadYouTubeScript = () => {
      if (window.YT && window.YT.Player) {
        setScriptLoaded(true);
        return;
      }

      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      tag.async = true;
      tag.onload = () => {
        if (isMounted.current) setScriptLoaded(true);
      };
      tag.onerror = () => {
        console.error("Failed to load YouTube IFrame API script");
        if (isMounted.current) setUseFallback(true);
      };
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
    };

    isMounted.current = true;
    loadYouTubeScript();

    return () => {
      isMounted.current = false;
    };
  }, []);

  // Initialize and update YouTube player with safe cleanup
  useEffect(() => {
    if (
      !isMounted.current ||
      !movies[currentIndex]?.trailer ||
      useFallback ||
      !scriptLoaded
    ) {
      setIsVideoReady(false); // Ensure video state is reset when using fallback
      return;
    }

    const videoId = movies[currentIndex].trailer?.split("embed/")[1];

    const initializePlayer = () => {
      if (!playerRef.current || !window.YT?.Player) return;

      // Cleanup existing player safely
      if (playerInstance.current) {
        try {
          if (typeof playerInstance.current.stopVideo === "function") {
            playerInstance.current.stopVideo();
          }
          playerInstance.current.destroy();
        } catch (err) {
          console.error("Error during player cleanup:", err);
        } finally {
          playerInstance.current = null;
        }
      }

      setIsVideoReady(false);
      setIsPlaying(false);
      setIsMuted(true);

      try {
        playerInstance.current = new window.YT.Player(playerRef.current, {
          width: "1280",
          height: "720",
          videoId,
          playerVars: {
            autoplay: 1,
            mute: 1,
            controls: 0,
            modestbranding: 0,
            showinfo: 0,
            rel: 0,
          },
          events: {
            onReady: (event: YT.PlayerEvent) => {
              if (isMounted.current) {
                event.target.playVideo();
                setIsVideoReady(true);
                setIsPlaying(true);
              }
            },
            // onStateChange: (event: YT.OnStateChangeEvent) => {
            //   if (!isMounted.current) return;
            //   if (event.data === window.YT.PlayerState.ENDED) {
            //     nextMovie();
            //   } else if (event.data === window.YT.PlayerState.PAUSED) {
            //     setIsPlaying(false);
            //   } else if (event.data === window.YT.PlayerState.PLAYING) {
            //     setIsPlaying(true);
            //   }
            // },
            // onError: (event: YT.OnErrorEvent) => {
            //   console.error("YouTube Player Error:", event.data);
            //   if (isMounted.current) {
            //     setUseFallback(true); // Switch to fallback on any error
            //     setIsVideoReady(false); // Reset video state
            // }
            //   },
          },
        });
      } catch (err) {
        console.error("Player Initialization Error:", err);
        // if (isMounted.current) {
        //   setUseFallback(true);
        //   setIsVideoReady(false);
        // }
      }
    };

    if (window.YT && window.YT.Player) {
      initializePlayer();
    } else {
      window.onYouTubeIframeAPIReady = initializePlayer;
    }

    return () => {
      if (playerInstance.current) {
        try {
          if (typeof playerInstance.current.stopVideo === "function") {
            playerInstance.current.stopVideo();
          }
          playerInstance.current.destroy();
        } catch (err) {
          console.error("Cleanup Error:", err);
        } finally {
          playerInstance.current = null;
        }
      }
    };
  }, [currentIndex, movies, useFallback, scriptLoaded]);

  // Navigation handlers
  const nextMovie = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % movies.length);
    setIsVideoReady(false);
    setUseFallback(false);
  }, [movies.length]);

  const prevMovie = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + movies.length) % movies.length);
    setIsVideoReady(false);
    setUseFallback(false);
  }, [movies.length]);

  const goToMovie = useCallback((index: number) => {
    setCurrentIndex(index);
    setIsVideoReady(false);
    setUseFallback(false);
  }, []);

  const toggleMute = useCallback(() => {
    if (
      playerInstance.current &&
      !useFallback &&
      typeof playerInstance.current.mute === "function"
    ) {
      setIsMuted((prev) => {
        if (prev) {
          playerInstance.current?.unMute();
        } else {
          playerInstance.current?.mute();
        }
        return !prev;
      });
    }
  }, [useFallback]);

  // Swipe-to-scroll logic
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchMove, setTouchMove] = useState<number | null>(null);

  const handleTouchStart = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      setTouchStart(clientX);
    },
    []
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent | React.MouseEvent) => {
      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
      setTouchMove(clientX);
    },
    []
  );

  const handleTouchEnd = useCallback(() => {
    if (touchStart !== null && touchMove !== null) {
      const deltaX = touchMove - touchStart;
      if (Math.abs(deltaX) > 50) {
        if (deltaX > 0) {
          prevMovie();
        } else {
          nextMovie();
        }
      }
    }
    setTouchStart(null);
    setTouchMove(null);
  }, [touchStart, touchMove, prevMovie, nextMovie]);

  return (
    <div className="relative max-w-[1920px] mx-auto w-full h-[40rem] bg-black flex flex-col md:flex-row rounded-md overflow-hidden">
      {/* Video Section (3/4 width) */}
      <div ref={videoSectionRef} className="relative w-full md:w-3/4 h-full">
        {loading ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 overflow-hidden">
            <img
              src={FALLBACK_IMAGE}
              alt="Loading background"
              className="w-full h-full object-cover animate-pulse"
            />
            <AiOutlineLoading3Quarters className="absolute size-12 text-white animate-spin" />
          </div>
        ) : useFallback || !movies[currentIndex]?.trailer ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <img
              src={movies[currentIndex]?.poster_path || FALLBACK_IMAGE}
              alt={movies[currentIndex]?.title || "No Video"}
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <>
            <div className="absolute inset-0 aspect-[16/9] w-full h-full">
              <div
                ref={playerRef}
                onMouseDown={handleTouchStart}
                onMouseMove={handleTouchMove}
                onMouseUp={handleTouchEnd}
                onMouseLeave={handleTouchEnd}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
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

            {/* Scroll Buttons */}
            {movies.length > 1 && (
              <>
                <button
                  onClick={prevMovie}
                  className="md:block hidden absolute left-2 top-1/2 transform -translate-y-1/2 bg-neutral-800 text-neutral-100 p-2 sm:p-3 rounded-full hover:bg-neutral-700 transition-colors duration-200 z-10 shadow-md"
                >
                  <FaChevronLeft size={16} />
                </button>
                <button
                  onClick={nextMovie}
                  className="md:block hidden absolute right-2 top-1/2 transform -translate-y-1/2 bg-neutral-800 text-neutral-100 p-2 sm:p-3 rounded-full hover:bg-neutral-700 transition-colors duration-200 z-10 shadow-md"
                >
                  <FaChevronRight size={16} />
                </button>
              </>
            )}
          </>
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
