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

  // Check if the item already exists for the user
  const { data: existingItems, error: checkError } = await supabase
    .from("user_watchlist")
    .select("id")
    .eq("user_id", userId)
    .eq("item_id", itemId);

  if (checkError) {
    console.log("Error checking for existing item:", checkError);
    return NextResponse.json(
      { error: "Error checking for existing item" },
      { status: 500 }
    );
  }

  if (existingItems && existingItems.length > 0) {
    console.log("Item already exists for user");
    return NextResponse.json(
      { message: "Item already exists for user" },
      { status: 200 }
    );
  }

  // Insert the item if it doesn't exist
  const { error: insertError } = await supabase.from("user_watchlist").insert({
    user_id: userId,
    item_name: name,
    item_id: itemId,
    item_type: mediaType,
    image_url: imgUrl,
    item_adult: adult,
  });

  if (insertError) {
    console.log("Error inserting item:", insertError);
    return NextResponse.json(
      { error: "Error inserting item" },
      { status: 500 }
    );
  }

  return NextResponse.json({ message: "Added" }, { status: 200 });
}
