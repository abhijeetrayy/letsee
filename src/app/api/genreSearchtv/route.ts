import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const requestClone = req.clone();
  const body = await requestClone.json();
  const { genreId, page = 1 } = body;

  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/discover/tv?api_key=${process.env.TMDB_API_KEY}&with_genres=${genreId}&page=${page}`
    );
    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error });
  }
}
