import { NextResponse } from "next/server";
import { supabase } from "@/utils/supabase/client";
import { createClient } from "@/utils/supabase/server";

// Define the User type
interface User {
  username: string;
  about?: string;
  watched_count: number;
  favorites_count: number;
  watchlist_count: number;
}

export async function GET(request: Request) {
  const supabase = await createClient();
  try {
    // Check if the user is authenticated (optional, depending on your requirements)
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      // If auth is not required, you can remove this block
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch users and their stats from Supabase
    const { data: usersData, error: dbError } = await supabase
      .from("users")
      .select(
        `username,
        about,
        user_cout_stats (
          watched_count,
          favorites_count,
          watchlist_count
        )`
      )
      .not("username", "is", null) // Filter out null usernames
      .neq("username", "") // Filter out empty usernames
      .order("updated_at", { ascending: false })
      .limit(10);

    if (dbError || !usersData) {
      console.error("Error fetching users:", dbError);
      return NextResponse.json(
        { error: "Error fetching users" },
        { status: 500 }
      );
    }

    // Map the data to the User interface
    const users: User[] = usersData.map((user: any) => {
      const stats = user.user_cout_stats || {};
      return {
        username: user.username,
        about: user.about || "",
        watched_count: stats.watched_count || 0,
        favorites_count: stats.favorites_count || 0,
        watchlist_count: stats.watchlist_count || 0,
      };
    });

    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
