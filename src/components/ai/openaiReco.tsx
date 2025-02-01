"use client";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import ThreePrefrenceBtn from "../buttons/threePrefrencebtn";

const preparePrompt = (movies: any[]) => {
  if (!movies || movies.length === 0) {
    console.error("No movies found.");
    return "";
  }

  const movieTitles = movies.map((movie) => movie.item_name).join(", ");
  return `I have watched the following movies: ${movieTitles}. 
            Recommend 5 movies I might like based on my preferences. 
            Return only the movie tmdb id in a comma-separated list.`;
};

const fetchRecommendations = async (prompt: string) => {
  if (!prompt) return [];

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.NEXT_PUBLIC_GOOGLE_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      }
    );

    const data = await response.json();
    if (!data?.candidates?.[0]?.content?.parts?.[0]?.text) {
      console.error("Invalid response from Gemini API:", data);
      return [];
    }
    const output = data.candidates[0].content.parts[0].text
      .split(", ")
      .map((title: any) => title.trim());
    console.log(output, "from fetch");
    return output;
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    return [];
  }
};

const getUserData = async (id: string) => {
  const supabase = createClient();
  try {
    const { data: favorites, error } = await supabase
      .from("favorite_items")
      .select("item_name") // ✅ Correct column name
      .eq("user_id", id)
      .order("item_name", { ascending: false }); // ✅ Ordering by the correct column

    if (error) {
      console.error("Error fetching user data:", error);
      return { favorites: [] };
    }
    return { favorites };
  } catch (error) {
    console.error("Error in getUserData:", error);
    return { favorites: [] };
  }
};

const fetchMovieDetails = async (movieId: string) => {
  const apiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  if (!apiKey) {
    console.error("TMDB API Key is missing.");
    return null;
  }

  console.log(`Fetching details for movie ID: ${movieId}`);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000); // Timeout after 5 seconds

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}`,
      { signal: controller.signal }
    );

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const data = await response.json();
    console.log("Movie Details:", data);
    return data; // ✅ Returns the entire movie object, NOT data.results[0]
  } catch (error: any) {
    if (error.name === "AbortError") {
      console.error("Request timed out for:", movieId);
    } else {
      console.error("Error fetching movie details:", error);
    }
    return null;
  }
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const displayRecommendations = async (userId: string) => {
  const { favorites } = await getUserData(userId);
  console.log(favorites);
  if (!favorites.length) return [];

  const prompt = preparePrompt(favorites);
  if (!prompt) return [];

  const recommendations = await fetchRecommendations(prompt);
  if (recommendations.length < 5) {
    console.warn(
      `Expected 5 recommendations but got ${recommendations.length}`
    );
  }

  // Function to retry failed requests up to 2 times
  const fetchWithRetry = async (movieId: string, retries = 2) => {
    for (let attempt = 1; attempt <= retries; attempt++) {
      const movieDetails = await fetchMovieDetails(movieId);
      if (movieDetails) return movieDetails;
      console.warn(`Retry ${attempt} failed for Movie ID: ${movieId}`);
    }
    return null; // Return null if all retries fail
  };

  // Fetch all movie details concurrently
  const results = await Promise.allSettled(
    recommendations.map((movieId: any) => fetchWithRetry(movieId))
  );

  // Filter out failed results
  const movies = results
    .filter((res) => res.status === "fulfilled" && res.value !== null)
    .map((res: any) => res.value);

  console.log(`Successfully fetched ${movies.length} movies`, movies);

  // If we still have fewer than 5 movies, fill the gaps with fallback movies
  if (movies.length < 5) {
    console.warn(`Only retrieved ${movies.length} movies, expected 5.`);
  }

  return movies.slice(0, 5); // Ensure exactly 5 results
};

export default function Recommendations({ userId }: { userId: string }) {
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleGetRecommendations = async () => {
    setLoading(true);
    const movies = await displayRecommendations(userId);
    setRecommendations(movies);
    setLoading(false);
  };

  return (
    <div>
      <button
        onClick={handleGetRecommendations}
        className="px-4 py-2 bg-blue-500 text-white rounded flex items-center justify-center"
        disabled={loading}
      >
        {loading ? (
          <span className="flex items-center">
            <svg
              className="animate-spin h-5 w-5 mr-2 text-white"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"
              />
            </svg>
            Loading...
          </span>
        ) : (
          "Get Recommendations"
        )}
      </button>
      <h2 className="mt-4 text-xl font-semibold">Recommendations</h2>
      <div className=" mt-4">
        {recommendations.length === 0 ? (
          <p className="text-gray-500">No recommendations found.</p>
        ) : (
          <div className="">
            <div className="relative w-full">
              <div className="w-full grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 no-scrollbar gap-3 z-40">
                {recommendations.map((data: any) => (
                  <div className="" key={data.id}>
                    <div className=" relative group flex flex-col justify-between rounded-md bg-black  w-full h-full  text-gray-300 overflow-hidden duration-300  lg:hover:scale-105 ">
                      <Link
                        className="relative flex w-full"
                        href={`/app/movie/${data.id}-${(data.name || data.title)
                          .trim()
                          .replace(/[^a-zA-Z0-9]/g, "-")
                          .replace(/-+/g, "-")}`}
                      >
                        <div className="absolute top-0 left-0 z-10 lg:opacity-0 lg:group-hover:opacity-100">
                          {data.adult ? (
                            <p className="p-1 bg-red-600 text-white rounded-br-md text-sm">
                              Adult
                            </p>
                          ) : (
                            <p className="p-1 bg-black text-white rounded-br-md text-sm">
                              {data.media_type}
                            </p>
                          )}
                        </div>
                        <div className="absolute top-0 right-0 z-10">
                          {(data.release_date || data.first_air_date) && (
                            <p className="p-1 bg-indigo-600 text-white rounded-tr-sm rounded-bl-md text-sm">
                              {new Date(data.release_date).getFullYear() ||
                                new Date(data.first_air_date).getFullYear()}
                            </p>
                          )}
                        </div>
                        <img
                          className={`${"h-full w-full object-cover"}  `}
                          src={
                            (data.poster_path || data.backdrop_path) &&
                            !data.adult
                              ? `https://image.tmdb.org/t/p/w342${
                                  data.poster_path || data.backdrop_path
                                }`
                              : data.adult
                              ? "/pixeled.webp"
                              : "/no-photo.webp"
                          }
                          loading="lazy"
                          alt={data.title}
                        />
                      </Link>
                      <div className="lg:absolute bottom-0 w-full bg-neutral-900 lg:opacity-0 lg:group-hover:opacity-100 z-10">
                        <ThreePrefrenceBtn
                          cardId={data.id}
                          cardType={data.media_type}
                          cardName={data.name || data.title}
                          cardAdult={data.adult}
                          cardImg={data.poster_path || data.backdrop_path}
                        />

                        <div
                          title={data.name || data.title}
                          className="w-full h-12 lg:h-fit flex flex-col gap-2  px-4  bg-indigo-700  text-gray-200 "
                        >
                          <Link
                            href={`/app/${data.media_type}/${data.id}-${(
                              data.name || data.title
                            )
                              .trim()
                              .replace(/[^a-zA-Z0-9]/g, "-")
                              .replace(/-+/g, "-")}`}
                            className="h-full"
                          >
                            <span className="">
                              {data?.title
                                ? data.title.length > 20
                                  ? data.title?.slice(0, 20) + "..."
                                  : data.title
                                : data.name.length > 20
                                ? data.name?.slice(0, 20) + "..."
                                : data.name}
                            </span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {/* {canScrollLeft && (
                  <button
                    onClick={scrollLeft}
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-neutral-600 p-2 py-5 rounded-sm z-10"
                    style={{
                      boxShadow: "0 4px 15px rgba(0, 0, 0, 0.9)", // Outer shadow
                    }}
                  >
                    {"<"}
                  </button>
                )}
                {canScrollRight && (
                  <button
                    onClick={scrollRight}
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-neutral-600 p-2 py-5 rounded-sm z-10"
                    style={{
                      boxShadow: "0 4px 15px rgba(0, 0, 0, .9)", // Outer shadow
                    }}
                  >
                    {">"}
                  </button>
                )} */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
