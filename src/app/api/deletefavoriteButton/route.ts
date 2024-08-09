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

  // Check if the item exists before attempting to delete it
  const { data: existingItem, error: fetchError } = await supabase
    .from("favorite_items")
    .select("item_id")
    .eq("user_id", userId)
    .eq("item_id", itemId)
    .single();

  if (fetchError || !existingItem) {
    console.log("Item not found in the database:", fetchError);
    return NextResponse.json({ error: "Item not found" }, { status: 404 });
  }

  // Proceed to delete the item
  const { error: deleteError } = await supabase
    .from("favorite_items")
    .delete()
    .eq("user_id", userId)
    .eq("item_id", itemId);

  if (deleteError) {
    console.log("Error deleting item:", deleteError);
    return NextResponse.json({ error: "Error deleting item" }, { status: 500 });
  }

  return NextResponse.json({ message: "Removed" }, { status: 200 });
}
