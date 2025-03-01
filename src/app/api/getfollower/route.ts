import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const requestClone = req.clone();
  const body = await requestClone.json();
  const { userId } = body;

  const supabase = await createClient();

  // Get user details from Supabase (authenticated user)
  const { data: userData, error: userError } = await supabase.auth.getUser();

  // Query to get emails of users followed by the specified user
  const { data: connection, error: connectionError } = await supabase
    .from("user_connections")
    .select("follower_id, users!fk_follower(username)")
    .eq("followed_id", userId);

  if (connectionError) {
    console.error("Error fetching connections:", connectionError);
    return NextResponse.json(
      { error: "Error fetching connections" },
      { status: 500 }
    );
  }

  return NextResponse.json({ connection }, { status: 200 });
}
