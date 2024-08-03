import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const requestClone = req.clone();
  const body = await requestClone.json();
  const { genreId, page = 1 } = body;
  console.log(genreId);
  try {
    const response = await fetch(
      `https://api.themoviedb.org/3/discover/tv?api_key=${process.env.TMDB_API_KEY}&with_genres=${genreId}&with_original_language=hi&page=${page}`
    );
    const data = await response.json();
    console.log(data);
    return NextResponse.json(data);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ error });
  }
}
