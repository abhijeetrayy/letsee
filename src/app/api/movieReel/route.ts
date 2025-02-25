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

    const apiKey = process.env.TMDB_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    // Step 1: Search for the keyword ID
    const keywordResponse = await fetchWithRetry(
      `https://api.themoviedb.org/3/search/keyword?api_key=${apiKey}&query=${encodeURIComponent(
        keyword
      )}&page=1`
    );
    const keywordData = await keywordResponse.json();
    const keywordId = keywordData.results[0]?.id;

    if (!keywordId) {
      return NextResponse.json({ error: "Keyword not found" }, { status: 404 });
    }

    // Step 2: Fetch movies for the specified page with discover
    const discoverResponse = await fetchWithRetry(
      `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&with_keywords=${keywordId}&page=${page}&include_video=true`
    );
    const discoverData = await discoverResponse.json();
    const movieIds = discoverData.results.map((movie: any) => movie.id);

    // Step 3: Fetch detailed movie info including trailers and IMDB ratings
    const moviesWithDetails = await Promise.all(
      movieIds.map(async (id: number, index: number) => {
        await delay(index * 100); // Stagger requests to avoid rate limits (10ms delay per request)

        const movieResponse = await fetchWithRetry(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&append_to_response=videos,external_ids`
        );
        const movieData = await movieResponse.json();
        console.log(movieData);

        const trailer = movieData.videos.results.find(
          (v: any) => v.type === "Trailer" && v.site === "YouTube"
        );

        return {
          id: movieData.id,
          title: movieData.title,
          trailer: trailer
            ? `https://www.youtube.com/embed/${trailer.key}`
            : undefined,
          poster_path: movieData.poster_path,
          genres: movieData.genres.map((g: any) => g.name), // Extract genre names
          imdb_id: movieData.external_ids.imdb_id, // IMDB ID for rating
          adult: movieData.adult,
        };
      })
    );

    // Filter movies with trailers
    const filteredMovies = moviesWithDetails.filter((movie) => movie.trailer);

    return NextResponse.json(
      {
        movies: filteredMovies,
        totalPages: discoverData.total_pages,
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
