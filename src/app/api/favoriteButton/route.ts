import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const requestClone = req.clone();
  const body = await requestClone.json();
  const { itemId, name, mediaType, imgUrl, adult, genres } = body;

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

  const { error: insertError } = await supabase.from("favorite_items").insert({
    user_id: userId,
    item_name: name,
    item_id: itemId,
    item_type: mediaType,
    image_url: imgUrl,
    item_adult: adult,
    genres: genres,
  });

  if (insertError) {
    if (
      insertError.code === "23505" // PostgreSQL unique violation error code
    ) {
      console.log("Duplicate item:", insertError);
      return NextResponse.json(
        { error: "already marked favorite" },
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
