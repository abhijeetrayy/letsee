import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const url = new URL(request.url);
  const path = url.pathname;

  try {
    const body = await request.json();

    // Fetch Recommendations and Watched Items
    if (path === "/api/recommendations") {
      const userId = body.user_id;
      if (!userId) {
        return NextResponse.json(
          { error: "User ID required" },
          { status: 400 }
        );
      }

      const [recoResponse, watchedResponse] = await Promise.all([
        supabase
          .from("recommendation")
          .select("*")
          .eq("user_id", userId)
          .order("recommended_at", { ascending: false }),
        supabase
          .from("watched_items")
          .select("*")
          .eq("user_id", userId)
          .order("watched_at", { ascending: false })
          .limit(10),
      ]);

      if (recoResponse.error) {
        console.error("Error fetching recommendations:", recoResponse.error);
        return NextResponse.json(
          { error: "Failed to fetch recommendations" },
          { status: 500 }
        );
      }

      if (watchedResponse.error) {
        console.error("Error fetching watched items:", watchedResponse.error);
        return NextResponse.json(
          { error: "Failed to fetch watched items" },
          { status: 500 }
        );
      }

      return NextResponse.json(
        {
          recommendations: recoResponse.data || [],
          watchedItems: watchedResponse.data || [],
        },
        { status: 200 }
      );
    }

    // Search Watched Items
    if (path === "/api/recommendations/search") {
      const query = body.query;
      if (!query) {
        return NextResponse.json(
          { error: "Search query required" },
          { status: 400 }
        );
      }

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();
      if (authError || !user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const { data, error } = await supabase
        .from("watched_items")
        .select("*")
        .eq("user_id", user.id)
        .ilike("item_name", `%${query}%`)
        .order("item_name", { ascending: true })
        .limit(10);

      if (error) {
        console.error("Error searching watched items:", error);
        return NextResponse.json(
          { error: "Failed to search watched items" },
          { status: 500 }
        );
      }

      return NextResponse.json({ results: data || [] }, { status: 200 });
    }

    // Add Recommendation
    if (path === "/api/recommendations/add") {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();
      if (authError || !user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const { item_id, name, item_type, image, adult } = body;

      const { error } = await supabase.from("recommendation").insert({
        user_id: user.id,
        item_id,
        name,
        item_type,
        image,
        adult,
      });

      if (error) {
        console.error("Error adding recommendation:", error);
        return NextResponse.json(
          { error: "Failed to add recommendation" },
          { status: 500 }
        );
      }

      const { data: updatedData } = await supabase
        .from("recommendation")
        .select("*")
        .eq("user_id", user.id)
        .order("recommended_at", { ascending: false });

      return NextResponse.json(
        { recommendations: updatedData || [] },
        { status: 201 }
      );
    }

    // Remove Recommendation
    if (path === "/api/recommendations/remove") {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();
      if (authError || !user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }

      const { item_id } = body;
      if (!item_id) {
        return NextResponse.json(
          { error: "Item ID required" },
          { status: 400 }
        );
      }

      const { error } = await supabase
        .from("recommendation")
        .delete()
        .eq("user_id", user.id)
        .eq("item_id", item_id);

      if (error) {
        console.error("Error removing recommendation:", error);
        return NextResponse.json(
          { error: "Failed to remove recommendation" },
          { status: 500 }
        );
      }

      return NextResponse.json(
        { message: "Recommendation removed" },
        { status: 200 }
      );
    }

    return NextResponse.json({ error: "Invalid endpoint" }, { status: 404 });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
