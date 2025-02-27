// app/users/page.tsx
import { createClient } from "@/utils/supabase/server";
import SearchAndFilters from "@components/profile/SearchAndFilters";

const getUserData = async () => {
  const supabase = await createClient();

  const { data: Users, error } = await supabase
    .from("users")
    .select(
      `username,
      about,
      user_cout_stats (
        watched_count,
        favorites_count,
        watchlist_count
      )
    `
    )
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Error fetching users:", error);
    return { Users: [] };
  }

  return { Users };
};

const Page = async () => {
  const { Users } = await getUserData();

  return (
    <div className="max-w-6xl w-full mx-auto p-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-300">Users</h1>
        <p className="text-neutral-500">Find Your Cinema Soul</p>
      </div>

      {/* Pass users data to the Client Component */}
      <SearchAndFilters users={Users} />
    </div>
  );
};

export default Page;
