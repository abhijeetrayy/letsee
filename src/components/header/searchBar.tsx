"use client";
import { useSearch } from "@/app/contextAPI/searchContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import { FaSearch, FaTimes } from "react-icons/fa";
import { FaCircleNotch } from "react-icons/fa6";

interface SearchResult {
  id: number;
  media_type: "movie" | "tv" | "person" | "keyword";
  title?: string;
  name?: string;
  poster_path?: string;
  profile_path?: string;
}

function SearchBar() {
  const [input, setInput] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [results, setResults] = useState<{
    movie: SearchResult[];
    tv: SearchResult[];
    person: SearchResult[];
    keyword: SearchResult[];
  }>({
    movie: [],
    tv: [],
    person: [],
    keyword: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { isSearchLoading, setIsSearchLoading } = useSearch();

  // Handle form submission
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (input.trim().length >= 2) {
      search(input);
    }
  }

  // Navigate to search page
  function search(text: string) {
    setIsSearchLoading(true);
    const encodedText = encodeURIComponent(text);
    router.push(`/app/search/${encodedText}`);
    setIsModalOpen(false); // Close modal on submit
  }

  // Fetch search results on input change
  useEffect(() => {
    const fetchResults = async () => {
      if (input.trim().length < 2) {
        setResults({ movie: [], tv: [], person: [], keyword: [] });
        return;
      }

      setIsLoading(true);
      try {
        // Fetch results from the API route
        const response = await fetch(
          `/api/search?query=${encodeURIComponent(input)}`
        );
        if (!response.ok) throw new Error("Failed to fetch search results");

        const data = await response.json();
        const movie = data.results.filter(
          (item: SearchResult) => item.media_type === "movie"
        );
        const tv = data.results.filter(
          (item: SearchResult) => item.media_type === "tv"
        );
        const person = data.results.filter(
          (item: SearchResult) => item.media_type === "person"
        );

        // Keyword search
        const keywordResponse = await fetch(
          `/api/search?query=${encodeURIComponent(input)}&media_type=keyword`
        );
        if (!keywordResponse.ok) throw new Error("Failed to fetch keywords");

        const keywordData = await keywordResponse.json();
        const keyword = keywordData.results.map(
          (kw: { id: number; name: string }) => ({
            id: kw.id,
            media_type: "keyword",
            name: kw.name,
          })
        );

        setResults({ movie, tv, person, keyword });
      } catch (error) {
        console.error("Error fetching search results:", error);
        setResults({ movie: [], tv: [], person: [], keyword: [] });
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [input]);

  // Open modal on input click
  const handleInputClick = () => {
    setIsModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setInput(""); // Optional: clear input on close
  };

  return (
    <>
      <form className="relative flex flex-row items-center w-full max-w-md">
        <input
          className="hidden md:flex w-full py-2 px-4 bg-neutral-800 text-neutral-200 rounded-full focus:outline-none focus:ring-2 focus:ring-neutral-500 placeholder-neutral-400 text-sm sm:text-base"
          name="searchtext"
          type="text"
          value={input}
          onClick={handleInputClick}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setInput(e.target.value)
          }
          placeholder="Search"
        />
        <button
          onClick={handleInputClick}
          type="button"
          className=" md:absolute md:right-2 md:top-1/2 transform md:-translate-y-1/2 bg-neutral-700 text-neutral-100 p-1.5 rounded-full hover:bg-neutral-600"
          disabled={isSearchLoading}
        >
          {isSearchLoading ? (
            <div className="w-fit m-auto animate-spin">
              <FaCircleNotch size={16} />
            </div>
          ) : (
            <FaSearch size={16} />
          )}
        </button>
      </form>

      {/* Full-Screen Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex flex-col items-center justify-start pt-10">
          <div className="w-full max-w-3xl px-4">
            <div className="relative flex flex-row items-center mb-6">
              <input
                className="w-full py-3 px-5 bg-neutral-800 text-neutral-200 rounded-full focus:outline-none focus:ring-2 focus:ring-neutral-500 text-base sm:text-lg placeholder-neutral-400"
                name="searchtext"
                type="text"
                value={input}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setInput(e.target.value)
                }
                placeholder="Search movies, TV shows, people, or keywords..."
                autoFocus
              />
              <button
                type="button"
                onClick={closeModal}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-400 hover:text-neutral-200"
              >
                <FaTimes size={20} />
              </button>
            </div>

            {/* Search Results */}
            <div className="w-full max-h-[70vh] overflow-y-auto text-white">
              {isLoading ? (
                <div className="text-center py-4">
                  <FaCircleNotch
                    className="animate-spin inline-block"
                    size={24}
                  />
                </div>
              ) : (
                <>
                  {["movie", "tv", "person", "keyword"].map((category) => {
                    const items = results[category as keyof typeof results];
                    if (items.length === 0) return null;

                    return (
                      <div key={category} className="mb-6">
                        {category == "keyword" ? (
                          <h3 className="text-lg sm:text-xl font-semibold capitalize flex flex-row mb-7 items-center gap-3 ">
                            Keywords
                          </h3>
                        ) : (
                          <Link
                            onClick={() => setIsModalOpen(false)}
                            href={`/app/search/${input}?media_type=${category}`}
                            className="text-lg sm:text-xl font-semibold capitalize flex flex-row mb-7 items-center gap-3 "
                          >
                            {category === "tvShows" ? "TV Shows" : category}{" "}
                            <span className="text-sm underline">
                              (search- click)
                            </span>
                          </Link>
                        )}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 h-auto">
                          {items.map((item: any) => (
                            <Link
                              key={item.id}
                              href={
                                category === "keyword"
                                  ? `/app/search/${encodeURIComponent(
                                      item.id
                                    )}?media_type=keyword`
                                  : `/app/${category}/${item.id}-${(
                                      item.title ||
                                      item.name ||
                                      ""
                                    )
                                      .trim()
                                      .replace(/[^a-zA-Z0-9]/g, "-")
                                      .replace(/-+/g, "-")}`
                              }
                              onClick={() => setIsModalOpen(false)}
                              className="flex items-center gap-3 p-2 bg-neutral-700 rounded-md hover:bg-neutral-600 transition-colors"
                            >
                              {item.media_type !== "keyword" && (
                                <img
                                  src={
                                    item.poster_path || item.profile_path
                                      ? `https://image.tmdb.org/t/p/w92${
                                          item.poster_path || item.profile_path
                                        }`
                                      : "https://placehold.co/92x138?text=No+Image"
                                  }
                                  alt={item.title || item.name}
                                  className="w-12 h-18 object-cover rounded"
                                />
                              )}
                              <span className="text-sm sm:text-base truncate">
                                {item.title || item.name}
                              </span>
                            </Link>
                          ))}
                          {category !== "keyword" && (
                            <Link
                              onClick={() => setIsModalOpen(false)}
                              href={`/app/search/${input}?media_type=${category}`}
                              className="flex items-center gap-3 h-18  p-2 text-neutral-800 bg-neutral-300 rounded-md hover:bg-neutral-400 transition-colors"
                            >
                              more..
                            </Link>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  {Object.values(results).every((arr) => arr.length === 0) &&
                    input.trim().length >= 2 && (
                      <p className="text-center text-neutral-400">
                        No results found
                      </p>
                    )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default SearchBar;
