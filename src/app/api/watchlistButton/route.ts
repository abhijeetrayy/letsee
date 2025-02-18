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
  console.log(
    { itemId, name, mediaType, imgUrl, adult, genres },
    "Request Body"
  );

  try {
    // Check if the item exists in the watchlist
    const { data: existingItem, error: findError } = await supabase
      .from("user_watchlist")
      .select()
      .eq("user_id", userId)
      .eq("item_id", itemId)
      .single();

    if (findError && findError.code !== "PGRST116") {
      // PGRST116 means "No rows found", which is expected if the item doesn't exist
      throw findError;
    }

    if (existingItem) {
      // If the item exists, remove it and decrement the watchlist count
      await removeFromWatchlist(userId, itemId);
      return NextResponse.json(
        { message: "Removed from watchlist", action: "removed" },
        { status: 200 }
      );
    } else {
      // If the item doesn't exist, add it and increment the watchlist count
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
    item_img: item.imgUrl,
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
