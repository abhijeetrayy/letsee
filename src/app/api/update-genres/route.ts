import { createClient } from "@/utils/supabase/server";

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const MAX_RETRIES = 3;
const BASE_DELAY = 1000; // 1 second

// Helper function to delay execution
const delay = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

interface WatchedItem {
  id: number;
  item_id: number;
  item_type: string;
  genres: string[] | null;
}

interface TMDBGenre {
  name: string;
}

interface TMDBResponse {
  genres: TMDBGenre[];
}

async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeout = 15000
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

// Function to fetch genres with retry logic
async function fetchGenres(
  item: WatchedItem,
  attempt = 1
): Promise<string[] | null> {
  try {
    const tmdbUrl = `https://api.themoviedb.org/3/${item.item_type}/${item.item_id}?api_key=${TMDB_API_KEY}&language=en-US`;

    const response = await fetchWithTimeout(tmdbUrl, { method: "GET" });

    if (response.status === 429) {
      if (attempt < MAX_RETRIES) {
        console.warn(
          `Rate limit hit, retrying in ${BASE_DELAY * attempt}ms...`
        );
        await delay(BASE_DELAY * attempt);
        return fetchGenres(item, attempt + 1);
      } else {
        console.error(`Max retries reached for item ${item.item_id}`);
        return null;
      }
    }

    if (!response.ok) {
      console.error(
        `Failed to fetch data for item ${item.item_id}: ${response.statusText}`
      );
      return null;
    }

    const tmdbData: TMDBResponse = await response.json();
    return tmdbData.genres.map((genre: TMDBGenre) => genre.name);
  } catch (error) {
    console.error(`Error fetching TMDB data for item ${item.item_id}:`, error);
    return null;
  }
}
// API route function
export async function POST(req: Request) {
  try {
    const supabase = await createClient();

    // Fetch watched items with null genres
    const { data: watchedItems, error } = await supabase
      .from("watched_items")
      .select("*")
      .is("genres", null);

    if (error) {
      console.error("Supabase fetch error:", error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
      });
    }

    if (!watchedItems || watchedItems.length === 0) {
      return new Response(JSON.stringify({ message: "No items to update" }), {
        status: 200,
      });
    }

    for (const item of watchedItems) {
      const genres = await fetchGenres(item);
      if (genres) {
        const { error: updateError } = await supabase
          .from("watched_items")
          .update({ genres })
          .eq("id", item.id);

        if (updateError) {
          console.error(`Error updating item ${item.item_id}:`, updateError);
        }
      }
      console.log(`Updated genres for item ${item.item_id}:`, genres);
      await delay(250); // Respect TMDB rate limits (4 requests per second)
    }

    return new Response(
      JSON.stringify({ message: "Genres updated successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating genres:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
