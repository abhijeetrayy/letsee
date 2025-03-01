import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const {
    query,
    page,
    media_type,
    include_adult,
    year,
    region,
    language,
    keyword,
  } = body;

  if (!query) {
    return NextResponse.json({ error: "Query is required" }, { status: 400 });
  }

  try {
    let endpoint = "multi";
    if (media_type === "movie") endpoint = "movie";
    else if (media_type === "tv") endpoint = "tv";
    else if (media_type === "person") endpoint = "person";
    else if (media_type === "keyword") endpoint = "keyword";

    const url = new URL(`https://api.themoviedb.org/3/search/${endpoint}`);
    url.searchParams.append("api_key", process.env.TMDB_API_KEY || "");
    url.searchParams.append("query", query);
    url.searchParams.append("page", page.toString());
    url.searchParams.append("include_adult", include_adult ? "true" : "false");
    if (year)
      url.searchParams.append(
        media_type === "movie" ? "year" : "first_air_date_year",
        year
      );
    if (region) url.searchParams.append("region", region);
    url.searchParams.append("language", language || "en-US");

    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(`TMDb API error: ${response.status}`);
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
