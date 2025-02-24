// app/api/movieReel/route.ts
import { NextRequest, NextResponse } from "next/server";

// Utility function to add delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Fetch with retry logic
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
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
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
    const body = await req.json();
    const { keyword, page = 1 } = body;

    if (!keyword) {
      return NextResponse.json({ error: "Missing keyword" }, { status: 400 });
    }

    // Step 1: Search for the keyword ID
    const keywordResponse = await fetchWithRetry(
      `https://api.themoviedb.org/3/search/keyword?api_key=${
        process.env.TMDB_API_KEY
      }&query=${encodeURIComponent(keyword)}&page=1`
    );
    const keywordData = await keywordResponse.json();
    const keywordId = keywordData.results[0]?.id;

    if (!keywordId) {
      return NextResponse.json({ error: "Keyword not found" }, { status: 404 });
    }

    // Step 2: Fetch movies for the specified page
    const response = await fetchWithRetry(
      `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.TMDB_API_KEY}&with_keywords=${keywordId}&page=${page}&include_video=true`
    );
    const data = await response.json();
    const movies = data.results;

    // Step 3: Fetch trailers for movies on this page
    const moviesWithTrailers = await Promise.all(
      movies.map(async (movie: any, index: number) => {
        await delay(index * 100); // Staggered delay
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
          //   poster: movie.poster_path,
          // genre: movie.genre.maps(genre => genre.name)
        };
      })
    );

    return NextResponse.json(
      {
        movies: moviesWithTrailers.filter((movie) => movie.trailer),
        totalPages: data.total_pages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
