import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const requestClone = req.clone();
  const body = await requestClone.json();
  const { itemId, name, mediaType, imgUrl, adult } = body;

  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) {
    console.log("User isn't logged in");
    return NextResponse.json(
      { error: "User isn't logged in" },
      { status: 401 }
    );
  }

  const userId = data.user.id;

  // First, delete from watched_items if it exists
  await supabase
    .from("user_watchlist")
    .delete()
    .eq("user_id", userId)
    .eq("item_id", itemId);

  // Check if it's in user_watchlist
  const { data: existingItem } = await supabase
    .from("watched_items")
    .select()
    .eq("user_id", userId)
    .eq("item_id", itemId)
    .single();

  if (existingItem) {
    // If it exists in watchlist, delete it
    const { error: deleteError } = await supabase
      .from("watched_items")
      .delete()
      .eq("user_id", userId)
      .eq("item_id", itemId);

    if (deleteError) {
      console.log("Error deleting item from watched:", deleteError);
      return NextResponse.json(
        { error: "Error deleting item from watched" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Removed from watched", action: "removed" },
      { status: 200 }
    );
  } else {
    // If it doesn't exist in watchlist, insert it
    const { error: insertError } = await supabase.from("watched_items").insert({
      user_id: userId,
      item_name: name,
      item_id: itemId,
      item_type: mediaType,
      image_url: imgUrl,
      item_adult: adult,
    });

    if (insertError) {
      console.log("Error inserting item to watched:", insertError);
      return NextResponse.json(
        { error: "Error inserting item to watched" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Added to watched", action: "added" },
      { status: 200 }
    );
  }
}
