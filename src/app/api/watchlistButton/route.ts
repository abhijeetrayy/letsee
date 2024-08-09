import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const requestClone = req.clone();
  const body = await requestClone.json();
  const { itemId, name, mediaType, imgUrl, adult } = body;

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

  const { error: insertError } = await supabase.from("user_watchlist").insert({
    user_id: userId,
    item_name: name,
    item_id: itemId,
    item_type: mediaType,
    item_img: imgUrl,
    item_adult: adult,
  });
  if (insertError) {
    if (
      insertError.code === "23505" // PostgreSQL unique violation error code
    ) {
      console.log("Duplicate item:", insertError);
      return NextResponse.json(
        { error: "already in watchlist" },
        { status: 409 }
      );
    } else {
      console.log("Error inserting item:", insertError);
      return NextResponse.json(
        { error: "Error inserting item" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ message: "Added" }, { status: 200 });
}

export async function DELETE(req: NextRequest) {
  const requestClone = req.clone();
  const body = await requestClone.json();
  const { itemId, name, mediaType, imgUrl, adult } = body;

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

  // Check if the item exists before attempting to delete it
  const { data: existingItem, error: fetchError } = await supabase
    .from("watched_items")
    .select()
    .eq("user_id", userId)
    .eq("item_id", itemId)
    .single();

  // Proceed to delete the item
  if (existingItem && !fetchError) {
    const { error: deleteError } = await supabase
      .from("watched_items")
      .delete()
      .eq("user_id", userId)
      .eq("item_id", itemId);

    if (deleteError) {
      console.log("Error deleting item:", deleteError);
      return NextResponse.json({ error: "Error " }, { status: 500 });
    }
  }
  if (fetchError) {
    return NextResponse.json(
      { message: "Fetch Error Try again" },
      { status: 500 }
    );
  }

  return NextResponse.json({ message: "Cleared.." }, { status: 200 });
}
