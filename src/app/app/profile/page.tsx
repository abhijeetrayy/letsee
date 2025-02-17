import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

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
  console.log(Users);

  return (
    <div className="max-w-6xl w-full mx-auto p-4">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-300">Users</h1>
        <p className="text-neutral-500">Find Your Cinema Soul</p>
      </div>

      {/* User Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {/* User Tiles */}
        {Users?.filter((item: any) => item.username !== null).map(
          (item: any) => (
            <Link
              key={item.username}
              href={`/app/profile/${item.username}`}
              className="group bg-neutral-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-neutral-700 hover:border-neutral-500 overflow-hidden"
            >
              <div className="p-6">
                {/* Avatar */}
                <div className="flex items-center gap-4">
                  <img
                    className="w-16 h-16 rounded-full object-cover border-2 border-neutral-700 group-hover:border-neutral-500 transition-colors duration-300"
                    src="/avatar.svg"
                    alt="User Avatar"
                  />
                  <div>
                    <h2 className="text-xl font-semibold text-neutral-100 group-hover:text-neutral-400 transition-colors duration-300">
                      @{item.username}
                    </h2>
                    <p className="text-sm text-neutral-400">{item.about}</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="mt-6 space-y-3">
                  <div className="flex justify-between items-center p-3 bg-neutral-700 rounded-lg group-hover:bg-neutral-900 transition-colors duration-300">
                    <p className="text-sm text-neutral-200 group-hover:text-neutral-100">
                      Watched
                    </p>
                    <span className="text-sm font-semibold text-neutral-200 group-hover:text-neutral-100">
                      {item.user_cout_stats?.watched_count || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-neutral-700 rounded-lg group-hover:bg-neutral-900 transition-colors duration-300">
                    <p className="text-sm text-neutral-200 group-hover:text-neutral-100">
                      Favorites
                    </p>
                    <span className="text-sm font-semibold text-neutral-200 group-hover:text-neutral-100">
                      {item.user_cout_stats?.favorites_count || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-neutral-700 rounded-lg group-hover:bg-neutral-900 transition-colors duration-300">
                    <p className="text-sm text-neutral-200 group-hover:text-neutral-100">
                      Watchlist
                    </p>
                    <span className="text-sm font-semibold text-neutral-200 group-hover:text-neutral-100">
                      {item.user_cout_stats?.watchlist_count || 0}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          )
        )}
      </div>
    </div>
  );
};

export default Page;
