// components/HomeReelViewer.tsx
"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  FaChevronLeft,
  FaChevronRight,
  FaVolumeMute,
  FaVolumeUp,
} from "react-icons/fa";

interface Movie {
  id: number;
  title: string;
  trailer?: any;
  poster_path?: string; // Optional, kept for compatibility
}

const HomeReelViewer: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true); // Track play/pause state
  const playerRef = useRef<HTMLDivElement>(null);
  const playerInstance = useRef<YT.Player | null>(null);
  const videoSectionRef = useRef<HTMLDivElement>(null);
  const [isMuted, setIsMuted] = useState(true);

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
        setIsVideoReady(false);
        setIsPlaying(true); // Start playing by default
        playerInstance.current = new window.YT.Player(playerRef.current, {
          width: "1280",
          height: "720",
          videoId,
          playerVars: {
            autoplay: 1,
            mute: 1, // Muted by default
            controls: 0, // No controls
            modestbranding: 0,
            showinfo: 0,
            rel: 0,
          },
          events: {
            onReady: (event: YT.PlayerEvent) => {
              event.target.playVideo();
              setIsVideoReady(true);
            },
            onStateChange: (event: YT.OnStateChangeEvent) => {
              if (event.data === window.YT.PlayerState.ENDED) {
                nextMovie();
              } else if (event.data === window.YT.PlayerState.PAUSED) {
                setIsPlaying(false);
              } else if (event.data === window.YT.PlayerState.PLAYING) {
                setIsPlaying(true);
              }
            },
            onError: (event: YT.OnErrorEvent) => {
              console.error("YouTube Player Error:", event.data);
              setError("Failed to load video");
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
      setIsVideoReady(false);
    };
  }, [isMounted, movies, currentIndex]);

  const nextMovie = () => {
    const nextIndex = (currentIndex + 1) % movies.length;
    setCurrentIndex(nextIndex);
    setIsVideoReady(false);
  };

  const prevMovie = () => {
    const prevIndex = (currentIndex - 1 + movies.length) % movies.length;
    setCurrentIndex(prevIndex);
    setIsVideoReady(false);
  };

  // Swipe-to-scroll logic
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchMove, setTouchMove] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    setTouchStart(clientX);
  };

  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    setTouchMove(clientX);
  };

  const handleTouchEnd = () => {
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

  // Get YouTube thumbnail URL
  const getYouTubeThumbnail = (trailer: string) => {
    const videoId = trailer.split("embed/")[1];
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  };

  return (
    <div className="relative max-w-[1920px] mx-auto w-full h-[40rem] bg-black flex flex-col md:flex-row rounded-md overflow-hidden">
      {/* Video Section (3/4 width) */}
      <div
        ref={videoSectionRef}
        className="relative w-full md:w-3/4 h-full"
        onMouseDown={handleTouchStart}
        onMouseMove={handleTouchMove}
        onMouseUp={handleTouchEnd}
        onMouseLeave={handleTouchEnd}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {loading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <img src="backgroundjpeg.webp" alt="letsee" />
          </div>
        ) : error ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-red-400 text-center">Error: {error}</p>
          </div>
        ) : movies.length > 0 ? (
          <>
            {/* Thumbnail Display */}
            {(!isVideoReady || !isPlaying) && (
              <div className="absolute inset-0 aspect-[16/9] w-full h-full">
                <img
                  onClick={() => setIsPlaying(true)}
                  src={
                    movies[currentIndex].trailer
                      ? getYouTubeThumbnail(movies[currentIndex].trailer)
                      : "/no-photo.webp"
                  }
                  alt={movies[currentIndex].title}
                  className="w-full h-full object-cover opacity-65"
                />
              </div>
            )}

            {/* YouTube Player */}
            <div
              className={`absolute inset-0 aspect-[16/9] w-full h-full ${
                isVideoReady && isPlaying ? "block" : "hidden"
              }`}
            >
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

            {/* Scroll Buttons (Hidden below md) */}
            {movies.length > 1 && (
              <>
                <button
                  onClick={prevMovie}
                  className="md:block hidden absolute left-2 top-1/2 transform -translate-y-1/2 bg-neutral-800 text-neutral-100 p-2 sm:p-3 rounded-full hover:bg-neutral-700 transition-colors duration-200 z-10 shadow-md"
                >
                  <FaChevronLeft size={16} className="sm:size-20" />
                </button>
                <button
                  onClick={nextMovie}
                  className="md:block hidden absolute right-2 top-1/2 transform -translate-y-1/2 bg-neutral-800 text-neutral-100 p-2 sm:p-3 rounded-full hover:bg-neutral-700 transition-colors duration-200 z-10 shadow-md"
                >
                  <FaChevronRight size={16} className="sm:size-20" />
                </button>
              </>
            )}
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-neutral-400 text-center">No top movies found</p>
          </div>
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
