// pages/api/movies.js
import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const requestClone = req.clone();
  const body = await requestClone.json();
  const { id } = body;

  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/${id}/recommendations?api_key=${process.env.TMDB_API_KEY}?language=en-US&page=1`
    );

    return NextResponse.json(response.data.results, { status: 200 });
  } catch (error) {
    return NextResponse.json(error, { status: 500 });
  }
}
