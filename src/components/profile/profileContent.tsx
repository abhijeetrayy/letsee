import { createClient } from "@/utils/supabase/server";
import React from "react";
import ProfileFavorite from "./ProfileFavorite";
import ProfileWatchlater from "./ProfileWatchlater";
import ProfileWatched from "./profileWatched";

const getUserData = async (id: any) => {
  const supabase = await createClient();

  const { count: watchedCount, error: countError } = await supabase
    .from("watched_items")
    .select("*", { count: "exact", head: true })
    .eq("user_id", id);

  const { data: watchlist } = await supabase
    .from("user_watchlist")
    .select()
    .eq("user_id", id)
    .order("id", { ascending: false });
  const { count: watchlistCount } = await supabase
    .from("user_watchlist")
    .select("*", { count: "exact", head: true })
    .eq("user_id", id);
  const { count: favoriteCount } = await supabase
    .from("favorite_items")
    .select("*", { count: "exact", head: true })
    .eq("user_id", id);
  const { data: favorates } = await supabase
    .from("favorite_items")
    .select()
    .eq("user_id", id)
    .order("id", { ascending: false });
  return { watchlistCount, watchedCount, favoriteCount, favorates, watchlist };
};

async function profileContent({ profileId }: any) {
  const {
    watchlistCount,
    watchedCount,
    favoriteCount,
    favorates,
    watchlist,
  }: any = await getUserData(profileId);
  console.log(watchedCount, favoriteCount, watchlistCount);
  return (
    <div>
      {favoriteCount > 0 && (
        <ProfileFavorite favorites={favorates} favoriteCount={favoriteCount} />
      )}
      {watchlistCount > 0 && (
        <ProfileWatchlater
          watchlist={watchlist}
          watchlistCount={watchlistCount}
        />
      )}
      {watchedCount > 0 && (
        <div className="z-40">
          <div className="my-3">
            <h1 className="text-2xl font-bold mb-4">
              Watched &quot;{watchedCount}&quot;
            </h1>
          </div>
          <ProfileWatched userId={profileId} />
        </div>
      )}
    </div>
  );
}

export default profileContent;
