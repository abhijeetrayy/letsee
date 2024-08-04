// pages/api/genres.js
import axios from "axios";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/genre/tv/list?api_key=${process.env.TMDB_API_KEY}`
    );
    return NextResponse.json(response.data.genres, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching genres" },
      { status: 500 }
    );
  }
}
