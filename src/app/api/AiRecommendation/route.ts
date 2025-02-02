import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

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
    const { data: userFavorites, error: userFavoritesError }: any =
      await supabase
        .from("favorite_items")
        .select("item_name")
        .eq("user_id", userId);

    const { data: userWatched, error: userWatchedError }: any = await supabase
      .from("watched_items")
      .select("item_name")
      .eq("user_id", userId);

    // if (error) throw error;
    // if (!favorites?.length) return NextResponse.json([]);

    const favoriteTitles = userFavorites
      .map((movie: any) => movie.item_name)
      .join(", ");
    const watchedTitles = userWatched
      .map((movie: any) => movie.item_name)
      .join(", ");

    const prompt = `
I have watched and liked the following movies: ${favoriteTitles}. 
Additionally, I have watched these movies: ${watchedTitles}.

Based on my preferences, recommend 5 movies I might like. The recommended movies must:
1. Not be in the list of movies I have already watched or favorited.
2. Be relevant to my preferences.
3. Be returned as a comma-separated list of movie titles only.

Do not include any additional text, explanations, or formatting. Just return the 5 movie titles as a comma-separated list.
`;
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GOOGLE_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      }
    );

    const geminiData = await geminiResponse.json();
    const suggestedTitlesText =
      geminiData.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!suggestedTitlesText) {
      return NextResponse.json(
        { error: "Invalid Gemini response" },
        { status: 500 }
      );
    }

    const suggestedTitles = suggestedTitlesText
      .split(",")
      .map((title: string) => title.trim());

    const moviePromises = suggestedTitles.map(
      async (title: string | number | boolean) => {
        try {
          const tmdbSearchResponse = await fetch(
            `https://api.themoviedb.org/3/search/movie?api_key=${
              process.env.TMDB_API_KEY
            }&query=${encodeURIComponent(title)}`
          );
          const tmdbSearchData = await tmdbSearchResponse.json();

          if (tmdbSearchData.results && tmdbSearchData.results.length > 0) {
            const movie = tmdbSearchData.results[0];
            return {
              name: movie.title,
              poster_url: movie.poster_path
                ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                : null,
              tmdb_id: movie.id,
            };
          } else {
            console.log(`No TMDB match found for: ${title}`);
            return null; // Or handle no match differently
          }
        } catch (tmdbError) {
          console.error(`TMDB search error for ${title}:`, tmdbError);
          return null;
        }
      }
    );

    const movies = (await Promise.all(moviePromises)).filter(Boolean); // Filter out null results
    console.log(movies);
    return NextResponse.json(movies);
  } catch (error) {
    console.error("Recommendation error:", error);
    return NextResponse.json(
      { error: "Failed to generate recommendations" },
      { status: 500 }
    );
  }
}
