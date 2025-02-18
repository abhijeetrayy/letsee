import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const requestClone = req.clone();
  const body = await requestClone.json();
  const { itemId } = body;

  const supabase = await createClient();

  // Authenticate the user
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
    let removedFromWatched = false;
    let removedFromFavorites = false;

    // Check if the item exists in watched_items
    const { data: watchedItem } = await supabase
      .from("watched_items")
      .select("id")
      .eq("user_id", userId)
      .eq("item_id", itemId)
      .single();

    if (watchedItem) {
      await removeFromWatched(userId, itemId);
      removedFromWatched = true;
    }

    // Check if the item exists in favorite_items
    const { data: favoriteItem } = await supabase
      .from("favorite_items")
      .select("id")
      .eq("user_id", userId)
      .eq("item_id", itemId)
      .single();

    if (favoriteItem) {
      await removeFromFavorites(userId, itemId);
      removedFromFavorites = true;
    }

    if (!removedFromWatched && !removedFromFavorites) {
      return NextResponse.json(
        { error: "Item not found in watched or favorites" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Item removed successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
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
    console.error("Error deleting item from watched:", deleteError);
    throw deleteError;
  }

  // Decrement watched count
  const { error: decrementError } = await supabase.rpc(
    "decrement_watched_count",
    { p_user_id: userId }
  );

  if (decrementError) {
    console.error("Error decrementing watched count:", decrementError);
    throw decrementError;
  }
}

/**
 * Removes an item from the favorite list and decrements the favorite count.
 */
async function removeFromFavorites(userId: string, itemId: string) {
  const supabase = await createClient();

  const { error: deleteError } = await supabase
    .from("favorite_items")
    .delete()
    .eq("user_id", userId)
    .eq("item_id", itemId);

  if (deleteError) {
    console.error("Error deleting item from favorites:", deleteError);
    throw deleteError;
  }

  // Decrement favorites count
  const { error: decrementError } = await supabase.rpc(
    "decrement_favorites_count",
    { p_user_id: userId }
  );

  if (decrementError) {
    console.error("Error decrementing favorites count:", decrementError);
    throw decrementError;
  }
}
