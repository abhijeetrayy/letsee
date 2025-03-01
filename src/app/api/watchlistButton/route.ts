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

  // Parse the request body
  const { itemId, name, mediaType, imgUrl, adult, genres } = await req.json();

  try {
    // Check if the item exists in the watchlist
    const { data: existingItem, error: findError } = await supabase
      .from("user_watchlist")
      .select()
      .eq("user_id", userId)
      .eq("item_id", itemId)
      .single();

    if (findError && findError.code !== "PGRST116") {
      throw findError;
    }

    if (existingItem) {
      await removeFromWatchlist(userId, itemId);
      return NextResponse.json(
        { message: "Removed from watchlist", action: "removed" },
        { status: 200 }
      );
    } else {
      // Remove from favorites and watched before adding to watchlist
      await removeFromFavorites(userId, itemId);
      await removeFromWatched(userId, itemId);
      await addToWatchlist(userId, {
        itemId,
        name,
        mediaType,
        imgUrl,
        adult,
        genres,
      });

      return NextResponse.json(
        { message: "Added to watchlist", action: "added" },
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
 * Adds an item to the watchlist and increments the watchlist count.
 */
async function addToWatchlist(
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

  // Insert the item into the watchlist
  const { error: insertError } = await supabase.from("user_watchlist").insert({
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

  // Increment the watchlist count
  const { error: incrementError } = await supabase.rpc(
    "increment_watchlist_count",
    {
      p_user_id: userId,
    }
  );

  if (incrementError) {
    throw incrementError;
  }
}

/**
 * Removes an item from the watchlist and decrements the watchlist count.
 */
async function removeFromWatchlist(userId: string, itemId: string) {
  const supabase = await createClient();

  // Delete the item from the watchlist
  const { error: deleteError } = await supabase
    .from("user_watchlist")
    .delete()
    .eq("user_id", userId)
    .eq("item_id", itemId);

  if (deleteError) {
    throw deleteError;
  }

  // Decrement the watchlist count
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

/**
 * Removes an item from the favorites and decrements the favorite count if it exists.
 */
async function removeFromFavorites(userId: string, itemId: string) {
  const supabase = await createClient();

  // Check if the item exists in favorites
  const { data: existingItem, error: findError } = await supabase
    .from("favorite_items")
    .select("item_id")
    .eq("user_id", userId)
    .eq("item_id", itemId)
    .single();

  if (findError && findError.code !== "PGRST116") {
    throw findError;
  }

  if (existingItem) {
    // Delete the item from favorites
    const { error: deleteError } = await supabase
      .from("favorite_items")
      .delete()
      .eq("user_id", userId)
      .eq("item_id", itemId);

    if (deleteError) {
      throw deleteError;
    }

    // Decrement the favorite count
    const { error: decrementError } = await supabase.rpc(
      "decrement_favorites_count",
      {
        p_user_id: userId,
      }
    );

    if (decrementError) {
      throw decrementError;
    }
  }
}

/**
 * Removes an item from the watched list and decrements the watched count if it exists.
 */
async function removeFromWatched(userId: string, itemId: string) {
  const supabase = await createClient();

  // Check if the item exists in watched
  const { data: existingItem, error: findError } = await supabase
    .from("watched_items")
    .select("item_id")
    .eq("user_id", userId)
    .eq("item_id", itemId)
    .single();

  if (findError && findError.code !== "PGRST116") {
    throw findError;
  }

  if (existingItem) {
    // Delete the item from watched
    const { error: deleteError } = await supabase
      .from("watched_items")
      .delete()
      .eq("user_id", userId)
      .eq("item_id", itemId);

    if (deleteError) {
      throw deleteError;
    }

    // Decrement the watched count
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
}
