import { createClient } from "@/utils/supabase/server";
import BarChart from "./BarChart";

// Define types
type GenreCounts = Record<string, number>;
type GenreStat = [string, number];

// Fetch genre statistics for a user
async function getUserGenreStatistics(userId: string): Promise<GenreCounts> {
  const supabase = await createClient();
  const { data: items, error } = await supabase
    .from("watched_items")
    .select("genres")
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching user items:", error);
    return {};
  }

  const genreCounts: GenreCounts = {};

  items?.forEach((item) => {
    if (Array.isArray(item.genres)) {
      item.genres.forEach((genre: string) => {
        genreCounts[genre] = (genreCounts[genre] || 0) + 1;
      });
    }
  });

  return genreCounts;
}

// Get top N genres
function getTopGenres(genreCounts: GenreCounts, topN: number = 5): GenreStat[] {
  return Object.entries(genreCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN);
}

// Main component
export default async function StatisticsGenre({
  userId,
  username,
}: {
  userId?: any;
  username?: any;
}) {
  const genreCounts = await getUserGenreStatistics(userId);
  const topGenres = getTopGenres(genreCounts);

  // Prepare data for the chart
  const chartData = {
    labels: topGenres.map(([genre]) => genre),
    values: topGenres.map(([, count]) => count),
  };

  return (
    <div className="flex flex-col items-center justify-center  p-1 ">
      <div className="w-full max-w-6xl">
        <h2 className="text-xl font-semibold mb-6 text-gray-100">
          @{username} Top Genres
        </h2>
      </div>
      {topGenres.length > 0 ? (
        <div className="w-full max-w-5xl  bg-neutral-800 p-6 rounded-lg shadow-md h-96">
          <BarChart data={chartData} />
        </div>
      ) : (
        <p className="text-gray-500">No genres found.</p>
      )}
    </div>
  );
}
