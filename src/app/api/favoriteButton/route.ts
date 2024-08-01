import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  const requestClone = req.clone();
  const body = await requestClone.json();
  const { itemId, name, mediaType, imgUrl, adult } = body;

  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();
  if (error) {
    console.log("user isn't loged in ");
    return;
  }

  const userId = data?.user.id;

  const { error: insertError } = await supabase.from("favorite_items").insert({
    user_id: userId,
    item_name: name,
    item_id: itemId,
    item_type: mediaType,
    image_url: imgUrl,
    item_adult: adult,
  });
  if (insertError) {
    console.log(insertError);
    return NextResponse.json("insertError");
  }
  return NextResponse.json("Added");
}
