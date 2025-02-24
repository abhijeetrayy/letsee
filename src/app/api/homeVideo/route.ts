// app/api/top-movies/route.ts
import { NextRequest, NextResponse } from "next/server";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchWithRetry(
  url: string,
  retries = 3,
  delayMs = 1000
): Promise<Response> {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, {
        headers: { Accept: "application/json" },
      });
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      return response;
    } catch (error) {
      if (i === retries - 1) throw error;
      console.warn(`Retrying fetch (${i + 1}/${retries}) for ${url}: ${error}`);
      await delay(delayMs);
    }
  }
  throw new Error("Unexpected fetch failure");
}

export async function POST(req: NextRequest) {
  try {
    // Fetch "Now Playing" movies from TMDB
    const response = await fetchWithRetry(
      `https://api.themoviedb.org/3/movie/now_playing?api_key=${process.env.TMDB_API_KEY}&language=en-US&page=1`
    );
    const data = await response.json();
    const topMovies = data.results.slice(0, 10); // Get top 10 to ensure we find 5 with trailers

    // Fetch trailers for each movie
    const moviesWithTrailers = await Promise.all(
      topMovies.map(async (movie: any, index: number) => {
        await delay(index * 100); // Stagger requests
        const videoResponse = await fetchWithRetry(
          `https://api.themoviedb.org/3/movie/${movie.id}/videos?api_key=${process.env.TMDB_API_KEY}`
        );
        const videoData = await videoResponse.json();
        const trailer = videoData.results.find(
          (v: any) => v.type === "Trailer" && v.site === "YouTube"
        );

        return {
          id: movie.id,
          title: movie.title,
          trailer: trailer
            ? `https://www.youtube.com/embed/${trailer.key}`
            : undefined,
        };
      })
    );

    const filteredMovies = moviesWithTrailers.filter((movie) => movie.trailer);
    return NextResponse.json(filteredMovies, {
      status: 200,
      headers: {
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=43200", // Cache for 1 day
      },
    });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
