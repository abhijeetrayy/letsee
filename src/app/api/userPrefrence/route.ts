import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
  const supabase = createClient();
  const { data: user, error: userError } = await supabase.auth.getUser();
  if (userError) {
    return NextResponse.json({ error: userError });
  }

  const { data: userFavorites, error: userFavoritesError } = await supabase
    .from("favorite_items")
    .select("item_id")
    .eq("user_id", user?.user.id);

  const { data: userWatched, error: userWatchedError } = await supabase
    .from("watched_items")
    .select("item_id")
    .eq("user_id", user?.user.id);
  const { data: userWatchlist, error: userWatchlistError } = await supabase
    .from("user_watchlist")
    .select("item_id")
    .eq("user_id", user?.user.id);

  return NextResponse.json({
    favorite: userFavorites,
    watched: userWatched,
    watchlater: userWatchlist,
  });
};
