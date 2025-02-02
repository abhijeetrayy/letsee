// app/api/AIRecommendation/[userId]/route.ts
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

interface MovieRecommendation {
  id: number;
  title: string;
  overview: string;
  poster_path?: string;
}

export async function GET() {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    console.log("User isn't logged in");
    return NextResponse.json(
      { error: "User isn't logged in" },
      { status: 401 }
    );
  }

  const userId = data.user.id;

  try {
    // Fetch user's favorite movies
    const { data: favorites, error } = await supabase
      .from("favorite_items")
      .select("item_name")
      .eq("user_id", userId);

    if (error) throw error;
    if (!favorites?.length) return NextResponse.json([]);

    // Prepare AI prompt
    const movieTitles = favorites.map((movie) => movie.item_name).join(", ");
    const prompt = `I have watched: ${movieTitles}. Recommend 5 movies I might like. Return only TMDB movie IDs in a comma-separated list.`;

    // Get AI recommendations
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GOOGLE_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      }
    );

    const geminiData = await geminiResponse.json();
    const recommendationIds =
      geminiData.candidates?.[0]?.content?.parts?.[0]?.text
        ?.split(",")
        .map((id: string) => parseInt(id.trim()))
        .filter((id: number) => !isNaN(id)) || [];

    // Fetch movie details from TMDB
    const moviePromises = recommendationIds.map(async (id: number) => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${process.env.TMDB_API_KEY}`
        );
        return response.json();
      } catch (error) {
        console.error(`Error fetching movie ${id}:`, error);
        return null;
      }
    });

    const movies = (await Promise.all(moviePromises)).filter(Boolean);

    return NextResponse.json<MovieRecommendation[]>(movies.slice(0, 5));
  } catch (error) {
    console.error("Recommendation error:", error);
    return NextResponse.json(
      { error: "Failed to generate recommendations" },
      { status: 500 }
    );
  }
}
