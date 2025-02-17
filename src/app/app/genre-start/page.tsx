"use client";
import { createClient } from "@/utils/supabase/client";
import React, { useState } from "react";

function Page() {
  const [update, setUpdate] = useState("Click to update");
  const [isLoading, setIsLoading] = useState(false);

  const supabase = createClient();

  const updateGenre = async () => {
    setIsLoading(true);
    setUpdate("Updating...");

    try {
      // Fetch all users with a non-null username
      const { data: users, error: usersError } = await supabase
        .from("users")
        .select("id")
        .not("username", "is", null);

      console.log(users);

      if (usersError) throw usersError;

      // Iterate through each user
      for (const user of users) {
        const userId = user.id;
        console.log(`Updating for user: ${userId}`);

        // Fetch watched item count
        const { count: watchedCount, error: watchedError } = await supabase
          .from("watched_items")
          .select("*", { count: "exact", head: true })
          .eq("user_id", userId);
        console.log(watchedCount);
        if (watchedError) console.log(watchedError);

        // Fetch favorite item count
        const { count: favoritesCount, error: favoritesError } = await supabase
          .from("favorite_items")
          .select("*", { count: "exact", head: true })
          .eq("user_id", userId);
        console.log(favoritesCount);
        if (favoritesError) console.log(favoritesError);

        // Fetch watchlist item count
        const { count: watchlistCount, error: watchlistError } = await supabase
          .from("user_watchlist")
          .select("*", { count: "exact", head: true })
          .eq("user_id", userId);
        console.log(watchlistCount);
        if (watchlistError) console.log(watchlistError);

        // Insert or update stats in user_movie_stats table
        const { error: upsertError } = await supabase
          .from("user_cout_stats")
          .upsert(
            {
              user_id: userId,
              watched_count: watchedCount || 0,
              favorites_count: favoritesCount || 0,
              watchlist_count: watchlistCount || 0,
              updated_at: new Date().toISOString(),
            },
            { onConflict: "user_id" }
          );

        if (upsertError)
          console.log(`upsert error updated for user: ${userId}`);
        console.log(` updated for user: ${userId}`);
      }

      setUpdate("Genres updated successfully!");
    } catch (error) {
      console.error("Error updating genres:", error);
      console.log(error);
      setUpdate("Failed to update genres");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4">
      <button
        onClick={updateGenre}
        disabled={isLoading}
        className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-blue-300"
      >
        {isLoading ? "Updating..." : "Update Genres"}
      </button>
      <p className="mt-2 text-neutral-600">{update}</p>
    </div>
  );
}

export default Page;
