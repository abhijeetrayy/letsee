"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";

const CleanWatchlist = () => {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const supabase = createClient();

  const cleanWatchlist = async () => {
    setLoading(true);
    setStatus("Cleaning watchlist...");

    try {
      // Fetch all users whose username is NOT NULL
      const { data: users, error: usersError } = await supabase
        .from("users")
        .select("id, username")
        .not("username", "is", null);

      if (usersError) throw usersError;

      for (const user of users) {
        const userId = user.id;
        console.log(
          `Cleaning watchlist for user: ${user.username} (${userId})`
        );

        // Fetch all watchlist items of the user
        const { data: watchlist, error: watchlistError } = await supabase
          .from("user_watchlist")
          .select("item_id")
          .eq("user_id", userId);
        if (!watchlist || watchlist.length === 0) {
          console.log(`No watchlist items found for user: ${user.username}`);
          continue;
        }
        if (watchlistError) throw watchlistError;

        for (const item of watchlist) {
          const { data: watchedItem, error: watchedError } = await supabase
            .from("watched_items")
            .select("id")
            .eq("user_id", userId)
            .eq("item_id", item.item_id)
            .single();

          if (watchedError && watchedError.code !== "PGRST116") {
            throw watchedError;
          }

          // If the item exists in watched_items, remove it from watchlist_items
          if (watchedItem) {
            const { error: deleteError } = await supabase
              .from("user_watchlist")
              .delete()
              .eq("user_id", userId)
              .eq("item_id", item.item_id);

            if (deleteError) throw deleteError;

            // Decrement watchlist_count in user_count_stats
            const { error: decrementError } = await supabase.rpc(
              "decrement_watchlist_count",
              { p_user_id: userId }
            );

            if (decrementError) throw decrementError;
          }
        }
      }

      setStatus("Watchlist cleaned successfully!");
    } catch (error) {
      console.error("Error cleaning watchlist:", error);
      setStatus("Error cleaning watchlist.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <button onClick={cleanWatchlist} disabled={loading}>
        {loading ? "Cleaning..." : "Clean Watchlist"}
      </button>
      {status && <p className="mt-2 text-gray-600">{status}</p>}
    </div>
  );
};

export default CleanWatchlist;
