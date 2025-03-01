import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") || "";
  const mediaType = searchParams.get("media_type") || "multi";

  if (!query) {
    return NextResponse.json({ error: "Query is required" }, { status: 400 });
  }

  try {
    let url: string;
    if (mediaType === "keyword") {
      // Use /discover/movie for keyword search
      url = `https://api.themoviedb.org/3/discover/movie?api_key=${
        process.env.TMDB_API_KEY
      }&with_keywords=${encodeURIComponent(query)}`;
    } else {
      // Use /search/{endpoint} for other media types
      let endpoint = "multi";
      if (mediaType === "movie") endpoint = "movie";
      else if (mediaType === "tv") endpoint = "tv";
      else if (mediaType === "person") endpoint = "person";

      url = `https://api.themoviedb.org/3/search/${endpoint}?api_key=${
        process.env.TMDB_API_KEY
      }&query=${encodeURIComponent(query)}`;
    }

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
