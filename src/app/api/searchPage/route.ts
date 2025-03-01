import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { query, media_type, page } = await request.json();

    if (!query) {
      return NextResponse.json(
        { error: "Search query is required" },
        { status: 400 }
      );
    }

    let url: URL;
    if (media_type === "keyword") {
      // Use /discover/movie for keyword search
      url = new URL(`https://api.themoviedb.org/3/discover/movie`);
      url.searchParams.append("with_keywords", query);
    } else {
      // Use /search/{endpoint} for other media types
      let endpoint = "multi";
      if (media_type === "movie") endpoint = "movie";
      else if (media_type === "tv") endpoint = "tv";
      else if (media_type === "person") endpoint = "person";

      url = new URL(`https://api.themoviedb.org/3/search/${endpoint}`);
      url.searchParams.append("query", query);
    }

    url.searchParams.append("api_key", process.env.TMDB_API_KEY || "");
    url.searchParams.append("page", page.toString());
    url.searchParams.append("include_adult", "false"); // Default to false
    url.searchParams.append("language", "en-US"); // Default to English

    const response = await fetch(url.toString());
    if (!response.ok) {
      throw new Error(`TMDB API failed: ${response.status}`);
    }

    const data = await response.json();

    // Normalize the response to match SearchResponse interface
    const normalizedData = {
      results: data.results,
      total_pages: data.total_pages,
      total_results: data.total_results,
    };

    return NextResponse.json(normalizedData, { status: 200 });
  } catch (error) {
    console.error("Search API Error:", error);
    return NextResponse.json(
      {
        error:
          (error as Error).message || "An error occurred while fetching data",
      },
      { status: 500 }
    );
  }
}
