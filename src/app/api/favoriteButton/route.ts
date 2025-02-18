import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const requestClone = req.clone();
  const body = await requestClone.json();
  console.log(body);
  const { itemId, name, mediaType, imgUrl, adult, genres } = body;

  const supabase = await createClient();

  // Authenticate the user
  const { data, error: authError } = await supabase.auth.getUser();
  if (authError || !data?.user) {
    console.log("User isn't logged in");
    return NextResponse.json(
      { error: "User isn't logged in" },
      { status: 401 }
    );
  }

  const userId = data.user.id;

  try {
    // Insert the item into favorite_items
    const { error: insertError } = await supabase
      .from("favorite_items")
      .insert({
        user_id: userId,
        item_name: name,
        item_id: itemId,
        item_type: mediaType,
        image_url: imgUrl,
        item_adult: adult,
        genres: genres,
      });

    if (insertError) {
      if (insertError.code === "23505") {
        console.log("Duplicate item in favorites:", insertError);
        return NextResponse.json(
          { error: "Item is already marked as favorite" },
          { status: 409 }
        );
      } else {
        console.log("Error inserting favorite item:", insertError);
        return NextResponse.json(
          { error: "Error inserting favorite item" },
          { status: 500 }
        );
      }
    }

    // Increment favorites_count in user_count_stats
    const { error: incrementFavoritesError } = await supabase.rpc(
      "increment_favorites_count",
      {
        p_user_id: userId,
      }
    );

    if (incrementFavoritesError) {
      console.log(
        "Error incrementing favorites_count:",
        incrementFavoritesError
      );
      return NextResponse.json(
        { error: "Error updating favorites count" },
        { status: 500 }
      );
    }

    // Check if the item already exists in watched_items
    const { data: existingWatchedItem, error: watchedFindError } =
      await supabase
        .from("watched_items")
        .select()
        .eq("user_id", userId)
        .eq("item_id", itemId)
        .single();

    if (watchedFindError && watchedFindError.code !== "PGRST116") {
      throw watchedFindError;
    }

    let watchedAdded = false;

    if (!existingWatchedItem) {
      // Add the item to watched_items
      const { error: insertWatchedError } = await supabase
        .from("watched_items")
        .insert({
          user_id: userId,
          item_name: name,
          item_id: itemId,
          item_type: mediaType,
          image_url: imgUrl,
          item_adult: adult,
          genres: genres,
        });

      if (insertWatchedError) {
        console.log("Error inserting watched item:", insertWatchedError);
        return NextResponse.json(
          { error: "Error inserting watched item" },
          { status: 500 }
        );
      }

      // Increment watched_count in user_count_stats
      const { error: incrementWatchedError } = await supabase.rpc(
        "increment_watched_count",
        {
          p_user_id: userId,
        }
      );

      if (incrementWatchedError) {
        console.log("Error incrementing watched_count:", incrementWatchedError);
        return NextResponse.json(
          { error: "Error updating watched count" },
          { status: 500 }
        );
      }

      watchedAdded = true;
    }

    return NextResponse.json(
      {
        message:
          "Item added to favorites" + (watchedAdded ? " and watched" : ""),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in POST request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
