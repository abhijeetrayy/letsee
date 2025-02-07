import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const requestClone = req.clone();
  const body = await requestClone.json();
  const { itemId, name, mediaType, imgUrl, adult } = body;
  console.log(body, "body");

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
    .from("watched_items")
    .delete()
    .eq("user_id", userId)
    .eq("item_id", itemId);

  // Check if it's in user_watchlist
  const { data: existingItem } = await supabase
    .from("user_watchlist")
    .select()
    .eq("user_id", userId)
    .eq("item_id", itemId)
    .single();

  if (existingItem) {
    // If it exists in watchlist, delete it
    console.log(existingItem, "wl exist");
    const { error: deleteError } = await supabase
      .from("user_watchlist")
      .delete()
      .eq("user_id", userId)
      .eq("item_id", itemId);

    if (deleteError) {
      console.log("Error deleting item from watchlist:", deleteError);
      return NextResponse.json(
        { error: "Error deleting item from watchlist" },
        { status: 500 }
      );
    }
  }
  // If it doesn't exist in watchlist, insert it
  const { data: insertData, error: insertError } = await supabase
    .from("user_watchlist")
    .insert({
      user_id: userId,
      item_name: name,
      item_id: itemId,
      item_type: mediaType,
      item_img: imgUrl,
      item_adult: adult,
    });
  console.log(insertData);

  console.log(insertError, "wlist ins errr");
  if (insertError) {
    console.log("Error inserting item to watchlist:", insertError);
    return NextResponse.json(
      { error: "Error inserting item to watchlist" },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { message: "Added to watchlist", action: "added" },
    { status: 200 }
  );
}
