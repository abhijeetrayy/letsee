import { notFound, redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { FaEdit } from "react-icons/fa";
import {
  ShowFollowing,
  ShowFollower,
  FollowerBtnClient,
} from "@/components/profile/profllebtn";
import ProfileContent from "@components/profile/profileContent";
import Visibility from "@components/profile/visibility";
import StatisticsGenre from "@components/profile/statisticsGenre";
import Logornot from "@components/guide/logornot";
import RecommendationTile from "@components/profile/recomendation";

// Fetch user data and statistics in a single function
const fetchProfileData = async (
  username: string | null,
  currentUserId: string | null
) => {
  const supabase = await createClient();

  // Get authenticated user if no username provided
  let profileId: string;
  let user: any;

  if (!username) {
    const {
      data: { user: authUser },
      error,
    } = await supabase.auth.getUser();
    if (error || !authUser) redirect("/login");

    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("id, username, about, visibility")
      .eq("id", authUser.id)
      .single();

    if (profileError || !profile) redirect("/app/profile/setup");
    if (!profile.username) redirect("/app/profile/setup");

    user = profile;
    profileId = user.id;
  } else {
    const { data, error } = await supabase
      .from("users")
      .select("id, username, about, visibility")
      .eq("username", username)
      .single();

    if (error || !data) return null; // Return null for notFound handling
    user = data;
    profileId = user.id;
  }

  const isOwner = currentUserId === profileId;

  // Fetch stats and follow data in parallel
  const [
    { count: watchedCount },
    { count: favoriteCount },
    { count: watchlistCount },
    { count: followersCount },
    { count: followingCount },
    { data: connection },
  ] = await Promise.all([
    supabase
      .from("watched_items")
      .select("*", { count: "exact", head: true })
      .eq("user_id", profileId),
    supabase
      .from("favorite_items")
      .select("*", { count: "exact", head: true })
      .eq("user_id", profileId),
    supabase
      .from("user_watchlist")
      .select("*", { count: "exact", head: true })
      .eq("user_id", profileId),
    supabase
      .from("user_connections")
      .select("*", { count: "exact" })
      .eq("followed_id", profileId),
    supabase
      .from("user_connections")
      .select("*", { count: "exact" })
      .eq("follower_id", profileId),
    isOwner || !currentUserId
      ? { data: null }
      : supabase
          .from("user_connections")
          .select("*")
          .eq("follower_id", currentUserId)
          .eq("followed_id", profileId)
          .single(),
  ]);

  return {
    user,
    isOwner,
    stats: { watchedCount, favoriteCount, watchlistCount },
    followData: {
      followersCount,
      followingCount,
      isFollowing: !!connection?.id,
    },
  };
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProfilePage({ params }: PageProps) {
  const { id: username } = await params;
  const supabase = await createClient();
  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser();
  const currentUserId = currentUser?.id || null;

  // Fetch profile data
  const profileData = await fetchProfileData(username, currentUserId);
  if (!profileData) return notFound();

  const { user, isOwner, stats, followData } = profileData;

  // Redirect if username fetched and not in URL
  if (!username && user.username) {
    redirect(`/app/profile/${user.username}`);
  }

  // Determine content visibility
  const canViewContent =
    user.visibility === "public" ||
    (followData.isFollowing && user.visibility === "followers") ||
    isOwner;

  return (
    <div className="flex flex-col items-center w-full bg-neutral-900 min-h-screen">
      <div className="flex flex-col max-w-6xl w-full gap-2 p-2">
        {/* Profile Header */}
        <div className="flex flex-col lg:flex-row p-2 gap-2">
          <div className="flex flex-col">
            <img
              width={200}
              height={200}
              className="h-32 w-32 md:h-48 md:w-48 rounded-full object-cover border-4 border-neutral-600 shadow-lg"
              src="/avatar.svg"
              alt="Profile"
            />
          </div>

          <div className="flex-1 flex flex-col gap-2">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold text-neutral-100">
                @{user.username}
              </h1>
              {isOwner && (
                <Link
                  href="/app/profile/setup"
                  className="p-2 rounded-full bg-neutral-200 hover:bg-neutral-300 transition-colors"
                >
                  <FaEdit className="text-neutral-600" />
                </Link>
              )}
            </div>

            {user.about && (
              <p className="text-neutral-400">
                <span className="font-semibold">Bio:</span> {user.about}
              </p>
            )}

            {isOwner && <Visibility />}

            <div className="flex gap-4">
              {!isOwner && currentUserId && (
                <FollowerBtnClient
                  profileId={user.id}
                  currentUserId={currentUserId}
                  initialStatus={
                    followData.isFollowing ? "following" : "follow"
                  }
                />
              )}
              {!currentUserId && (
                <Logornot message="You need to log in to follow or message." />
              )}
              {currentUserId && !isOwner && (
                <Link
                  href={`/app/messages/${user.id}`}
                  className="px-4 py-2 bg-neutral-700 text-white rounded-md hover:bg-neutral-800 transition-colors"
                >
                  Message
                </Link>
              )}
            </div>

            <div className="flex gap-6">
              <ShowFollowing
                followingCount={followData.followingCount}
                userId={user.id}
              />
              <ShowFollower
                followerCount={followData.followersCount}
                userId={user.id}
              />
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="px-2 grid grid-cols-3 gap-2">
          <StatBox
            count={stats.watchedCount}
            label="Movies/TV Watched"
            color="neutral"
          />
          <StatBox
            count={stats.favoriteCount}
            label="Favorites"
            color="neutral"
          />
          <StatBox
            count={stats.watchlistCount}
            label="WatchList"
            color="neutral"
          />
        </div>

        {/* Genre Statistics */}
        <div className="mt-8">
          <StatisticsGenre username={user.username} userId={user.id} />
        </div>

        {/* Content Visibility */}
        <div className="rounded-lg shadow-md p-1 mt-5">
          {canViewContent ? (
            <>
              <RecommendationTile
                isOwner={isOwner}
                name={user.username}
                id={user.id}
              />
              <ProfileContent profileId={user.id} />
            </>
          ) : (
            <div className="text-center py-10 text-neutral-600">
              Follow @{user.username} to see their content.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Reusable Stat Box Component
const StatBox = ({
  count,
  label,
  color,
}: {
  count: number | null;
  label: string;
  color: string;
}) => (
  <div
    className={`flex flex-col items-center justify-center p-4 rounded-lg shadow-md bg-neutral-700 hover:shadow-lg transition-shadow duration-300 border-l-4 border-${color}-200`}
  >
    <span className="text-2xl md:text-4xl font-bold text-neutral-100">
      {count ?? 0}
    </span>
    <span className="text-neutral-100 text-sm mt-2">{label}</span>
  </div>
);
