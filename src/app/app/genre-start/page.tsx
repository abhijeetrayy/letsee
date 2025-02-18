"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

const SyncFavoritesToWatched = () => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const supabase = createClient();

  const syncFavoritesToWatched = async () => {
    setLoading(true);
    setStatus("Syncing favorites to watched...");

    try {
      // Fetch all users whose username is NOT NULL
      const { data: users, error: usersError } = await supabase
        .from("users")
        .select("id, username")
        .not("username", "is", null);

      if (usersError) throw usersError;

      for (const user of users) {
        const userId = user.id;

        // Fetch all favorite items of the user
        const { data: favorites, error: favoritesError } = await supabase
          .from("favorite_items")
          .select(
            "item_id, item_name, item_type, image_url, item_adult, genres"
          )
          .eq("user_id", userId);

        if (favoritesError) throw favoritesError;

        for (const item of favorites) {
          const { data: watchedItem, error: watchedError } = await supabase
            .from("watched_items")
            .select("id")
            .eq("user_id", userId)
            .eq("item_id", item.item_id)
            .single();

          if (watchedError && watchedError.code !== "PGRST116") {
            throw watchedError;
          }

          // If the item is not in watched_items, add it
          if (!watchedItem) {
            const { error: insertError } = await supabase
              .from("watched_items")
              .insert({
                user_id: userId,
                item_id: item.item_id,
                item_name: item.item_name,
                item_type: item.item_type,
                image_url: item.image_url,
                item_adult: item.item_adult,
                genres: item.genres,
              });

            if (insertError) throw insertError;

            // Increment watched_count in user_count_stats
            const { error: incrementError } = await supabase.rpc(
              "increment_watched_count",
              { p_user_id: userId }
            );

            if (incrementError) throw incrementError;
          }
        }
      }

      setStatus("Favorites successfully synced to watched!");
    } catch (error) {
      console.error("Error syncing favorites to watched:", error);
      setStatus("Error syncing favorites to watched.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <button onClick={syncFavoritesToWatched} disabled={loading}>
        {loading ? "Syncing..." : "Sync Favorites to Watched"}
      </button>
      {status && <p className="mt-2 text-gray-600">{status}</p>}
    </div>
  );
};

export default SyncFavoritesToWatched;
