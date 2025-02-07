// pages/api/watched-movies.ts
import { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "../../../utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const requestClone = req.clone();
  const body = await requestClone.json();
  const { userID, page = 1, limit = 30 } = body;
  console.log(userID);
  const supabase = await createClient();

  if (!userID) {
    return NextResponse.json({ error: "User ID is required" });
  }

  const pageNumber = Number(page);
  const itemsPerPage = Number(limit);
  const offset = (pageNumber - 1) * itemsPerPage;

  try {
    // Fetch total count
    const { count } = await supabase
      .from("watched_items")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userID);

    // Fetch paginated results
    const { data, error } = await supabase
      .from("watched_items")
      .select("*")
      .eq("user_id", userID)
      .range(offset, offset + itemsPerPage - 1)
      .order("watched_at", { ascending: false });

    if (error) throw error;

    const totalPages = Math.ceil((count || 0) / itemsPerPage);
    const perloadLength = data.length;

    return NextResponse.json({
      data,
      page: pageNumber,
      totalPages,
      totalItems: count,
      perloadLength,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "An error occurred", details: error },
      { status: 500 }
    );
  }
}
