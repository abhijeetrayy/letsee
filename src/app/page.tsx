import Link from "next/link";
import { Film, Search, Share2, MessageCircle, Video, List } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-neutral-700 text-white">
      {/* Hero Section */}
      <header className="relative py-20 text-center">
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-900/50 to-neutral-700" />
        <div className="relative z-10">
          <h1 className="text-5xl font-bold mb-4">Welcome to Movie Social</h1>
          <p className="text-xl text-neutral-300 mb-8">
            Discover, share, and connect with friends over your favorite movies
            and TV shows.
          </p>
          <Link
            href="/app"
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-center mb-12">
          Explore Our Features
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Feature Card 1: User Movie List */}
          <div className="bg-neutral-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition transform hover:-translate-y-1">
            <List className="w-12 h-12 text-indigo-500 mb-4" />
            <h3 className="text-2xl font-semibold mb-2">Your Movie Lists</h3>
            <p className="text-neutral-400 mb-4">
              Create and manage your watchlist, favorites, and watched movies
              with ease.
            </p>
            <Link
              href="/app/lists"
              className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition"
            >
              View Lists
            </Link>
          </div>

          {/* Feature Card 2: Search Movies/TV Shows */}
          <div className="bg-neutral-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition transform hover:-translate-y-1">
            <Search className="w-12 h-12 text-indigo-500 mb-4" />
            <h3 className="text-2xl font-semibold mb-2">
              Search Any Movie or TV Show
            </h3>
            <p className="text-neutral-400 mb-4">
              Find your favorite movies and TV shows with our powerful search,
              powered by TMDB.
            </p>
            <Link
              href="/app/search"
              className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition"
            >
              Start Searching
            </Link>
          </div>

          {/* Feature Card 3: Share with Friends */}
          <div className="bg-neutral-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition transform hover:-translate-y-1">
            <Share2 className="w-12 h-12 text-indigo-500 mb-4" />
            <h3 className="text-2xl font-semibold mb-2">Share with Friends</h3>
            <p className="text-neutral-400 mb-4">
              Share your favorite movies and lists with friends directly from
              the app.
            </p>
            <Link
              href="/app/share"
              className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition"
            >
              Share Now
            </Link>
          </div>

          {/* Feature Card 4: Chat with Friends */}
          <div className="bg-neutral-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition transform hover:-translate-y-1">
            <MessageCircle className="w-12 h-12 text-indigo-500 mb-4" />
            <h3 className="text-2xl font-semibold mb-2">Chat with Friends</h3>
            <p className="text-neutral-400 mb-4">
              Discuss movies and shows in real-time with your friends through
              our chat feature.
            </p>
            <Link
              href="/app/chat"
              className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition"
            >
              Start Chatting
            </Link>
          </div>

          {/* Feature Card 5: Movie Reels */}
          <div className="bg-neutral-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition transform hover:-translate-y-1">
            <Video className="w-12 h-12 text-indigo-500 mb-4" />
            <h3 className="text-2xl font-semibold mb-2">Movie Reels</h3>
            <p className="text-neutral-400 mb-4">
              Watch curated reels of movies based on genres and keywords you
              love.
            </p>
            <Link
              href="/app/reels"
              className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition"
            >
              Watch Reels
            </Link>
          </div>

          {/* Feature Card 6: All Features */}
          <div className="bg-neutral-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition transform hover:-translate-y-1">
            <Film className="w-12 h-12 text-indigo-500 mb-4" />
            <h3 className="text-2xl font-semibold mb-2">Discover More</h3>
            <p className="text-neutral-400 mb-4">
              Explore all the features that make Movie Social your go-to movie
              platform.
            </p>
            <Link
              href="/app/features"
              className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition"
            >
              Explore All
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-800 py-6 text-center">
        <p className="text-neutral-400">
          &copy; 2025 Movie Social. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
