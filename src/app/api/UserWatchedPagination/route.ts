import { createClient } from "@/utils/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const { userID, page, genre } = await request.json();

  // Initialize the query
  let query = supabase
    .from("watched_items")
    .select("*", { count: "exact" }) // Fetch total count
    .eq("user_id", userID)
    .order("watched_at", { ascending: false }); // Sort by newest first

  // Apply genre filter if provided
  if (genre) {
    query = query.contains("genres", [genre]); // Filter by genre
  }

  // Apply pagination
  const itemsPerPage = 50;
  query = query.range((page - 1) * itemsPerPage, page * itemsPerPage - 1);

  // Execute the query
  const { data, error, count } = await query;

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }

  // Calculate total items and pages
  const totalItems = count || 0; // Use the count returned by Supabase
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return new Response(
    JSON.stringify({
      data,
      totalItems,
      totalPages,
    })
  );
}
