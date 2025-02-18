import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();

  // Authenticate the user
  const { data: userData, error: authError } = await supabase.auth.getUser();
  if (authError || !userData?.user) {
    console.log("User isn't logged in");
    return NextResponse.json(
      { error: "User isn't logged in" },
      { status: 401 }
    );
  }

  const userId = userData.user.id;
  const { itemId, name, mediaType, imgUrl, adult, genres } = await req.json();

  try {
    // Check if the item is already in watched_items
    const { data: existingItem, error: findError } = await supabase
      .from("watched_items")
      .select()
      .eq("user_id", userId)
      .eq("item_id", itemId)
      .single();

    if (findError && findError.code !== "PGRST116") {
      throw findError;
    }

    if (existingItem) {
      // If the item exists in watched_items, remove it
      await removeFromWatched(userId, itemId);
      return NextResponse.json(
        { message: "Removed from watched", action: "removed" },
        { status: 200 }
      );
    } else {
      // Check if the item exists in watchlist_items before adding to watched
      const { data: watchlistItem, error: watchlistError } = await supabase
        .from("watchlist_items")
        .select()
        .eq("user_id", userId)
        .eq("item_id", itemId)
        .single();

      if (watchlistError && watchlistError.code !== "PGRST116") {
        throw watchlistError;
      }

      if (watchlistItem) {
        // If the item exists in watchlist, remove it and decrement watchlist count
        await removeFromWatchlist(userId, itemId);
      }

      // Add the item to watched_items and increment watched count
      await addToWatched(userId, {
        itemId,
        name,
        mediaType,
        imgUrl,
        adult,
        genres,
      });

      return NextResponse.json(
        { message: "Added to watched", action: "added" },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * Adds an item to the watched list and increments the watched count.
 */
async function addToWatched(
  userId: string,
  item: {
    itemId: string;
    name: string;
    mediaType: string;
    imgUrl: string;
    adult: boolean;
    genres: string[];
  }
) {
  const supabase = await createClient();

  const { error: insertError } = await supabase.from("watched_items").insert({
    user_id: userId,
    item_name: item.name,
    item_id: item.itemId,
    item_type: item.mediaType,
    image_url: item.imgUrl,
    item_adult: item.adult,
    genres: item.genres,
  });

  if (insertError) {
    throw insertError;
  }

  const { error: incrementError } = await supabase.rpc(
    "increment_watched_count",
    {
      p_user_id: userId,
    }
  );

  if (incrementError) {
    throw incrementError;
  }
}

/**
 * Removes an item from the watched list and decrements the watched count.
 */
async function removeFromWatched(userId: string, itemId: string) {
  const supabase = await createClient();

  const { error: deleteError } = await supabase
    .from("watched_items")
    .delete()
    .eq("user_id", userId)
    .eq("item_id", itemId);

  if (deleteError) {
    throw deleteError;
  }

  const { error: decrementError } = await supabase.rpc(
    "decrement_watched_count",
    {
      p_user_id: userId,
    }
  );

  if (decrementError) {
    throw decrementError;
  }
}

/**
 * Removes an item from the watchlist and decrements the watchlist count.
 */
async function removeFromWatchlist(userId: string, itemId: string) {
  const supabase = await createClient();

  const { error: deleteError } = await supabase
    .from("watchlist_items")
    .delete()
    .eq("user_id", userId)
    .eq("item_id", itemId);

  if (deleteError) {
    throw deleteError;
  }

  const { error: decrementError } = await supabase.rpc(
    "decrement_watchlist_count",
    {
      p_user_id: userId,
    }
  );

  if (decrementError) {
    throw decrementError;
  }
}
