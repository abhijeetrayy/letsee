import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import { FaEdit } from "react-icons/fa";
import {
  ShowFollowing,
  ShowFollower,
  FollowerBtnClient,
} from "@/components/profile/profllebtn";
import ChataiReco from "@/components/ai/openaiReco";
import ProfileContent from "@components/profile/profileContent";
import Visibility from "@components/profile/visibility";
import StatisticsGenre from "@components/profile/statisticsGenre";
import Logornot from "@components/guide/logornot";
import RecommendationTile from "@components/profile/recomendation";

// Fetch user data and statistics
const getUserData = async (id: string) => {
  const supabase = await createClient();

  const [
    { count: watchedCount },
    { count: favoriteCount },
    { count: watchlistCount },
  ] = await Promise.all([
    supabase
      .from("watched_items")
      .select("*", { count: "exact", head: true })
      .eq("user_id", id),
    supabase
      .from("favorite_items")
      .select("*", { count: "exact", head: true })
      .eq("user_id", id),
    supabase
      .from("user_watchlist")
      .select("*", { count: "exact", head: true })
      .eq("user_id", id),
  ]);

  return { watchedCount, favoriteCount, watchlistCount };
};

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ProfilePage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // Fetch user data by username
  const { data: user, error } = await supabase
    .from("users")
    .select("id, username, about, visibility")
    .eq("username", id)
    .single();

  if (!user || error) return notFound();

  // Get currently authenticated user
  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser();

  const currentUserId = currentUser?.id || null;
  const profileId = user.id;

  // Fetch follow status and counts in parallel
  const [
    { count: followersCount },
    { count: followingCount },
    { data: connection },
    userStats,
  ] = await Promise.all([
    supabase
      .from("user_connections")
      .select("*", { count: "exact" })
      .eq("followed_id", profileId),
    supabase
      .from("user_connections")
      .select("*", { count: "exact" })
      .eq("follower_id", profileId),
    currentUserId
      ? supabase
          .from("user_connections")
          .select("*")
          .eq("follower_id", currentUserId)
          .eq("followed_id", profileId)
          .single()
      : { data: null },
    getUserData(profileId),
  ]);

  const isFollowing = !!connection?.id;
  const isOwner = currentUserId === profileId;
  const canViewContent =
    user.visibility === "public" ||
    (isFollowing && user.visibility === "followers");

  return (
    <div className="flex flex-col items-center w-full bg-neutral-900 min-h-screen">
      <div className="flex flex-col max-w-6xl w-full gap-4 p-2">
        {/* Profile Header */}
        <div className="flex flex-col lg:flex-row p-2 gap-8">
          {/* Profile Picture */}
          <div className="flex flex-col ">
            <img
              width={200}
              height={200}
              className="h-32 w-32 md:h-48 md:w-48 rounded-full object-cover border-4 border-neutral-600 shadow-lg"
              src={"/avatar.svg"}
              alt="Profile"
            />
          </div>

          {/* Profile Info */}
          <div className="flex-1 flex flex-col gap-4">
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

            {/* Bio */}
            {user.about && (
              <p className="text-neutral-400">
                <span className="font-semibold">Bio:</span> {user.about}
              </p>
            )}

            {/* Visibility */}
            {isOwner && <Visibility />}

            {/* Follow Button & Message */}
            <div className="flex gap-4">
              {!isOwner && (
                <FollowerBtnClient
                  profileId={profileId}
                  currentUserId={currentUserId}
                  initialStatus={isFollowing ? "following" : "follow"}
                />
              )}
              {!currentUserId && (
                <Logornot message={"You need to log in to send messages."} />
              )}
              {currentUserId && !isOwner && (
                <Link
                  href={`/app/messages/${profileId}`}
                  className="px-4 py-2 bg-neutral-700 text-white rounded-md hover:bg-neutral-800 transition-colors"
                >
                  Message
                </Link>
              )}
            </div>

            {/* Followers & Following */}
            <div className="flex gap-6">
              <ShowFollowing
                followingCount={followingCount}
                userId={profileId}
              />
              <ShowFollower followerCount={followersCount} userId={profileId} />
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className=" p-2 grid grid-cols-3 gap-6">
          <StatBox
            count={userStats.watchedCount}
            label="Movies/TV Watched"
            color="neutral"
          />
          <StatBox
            count={userStats.favoriteCount}
            label="Favorites"
            color="neutral"
          />
          <StatBox
            count={userStats.watchlistCount}
            label="WatchList"
            color="neutral"
          />
        </div>

        {/* Genre Statistics */}
        <div className="">
          <StatisticsGenre username={user.username} userId={profileId} />
        </div>

        {/* AI Recommendation */}
        {/* {isOwner && (
          <div className="  p-1">
            <h2 className="text-2xl font-bold text-neutral-100 mb-4">
              Your Personal Recommendations
            </h2>
            <p className="text-neutral-300 mb-4">
              Based on your{" "}
              <span className="text-neutral-200 font-semibold">Favorites</span>{" "}
              and{" "}
              <span className="text-neutral-200 font-semibold">Watched</span>{" "}
              list, powered by AI.
            </p>
            <ChataiReco />
          </div>
        )} */}

        {/* Conditional Content */}
        {!currentUser ? (
          <div className="w-full flex items-center justify-center h-52">
            Log in to view @{user.username}&apos;s content.
          </div>
        ) : user.visibility === "private" && !isOwner ? (
          <div className="text-center py-10">
            <p className="text-lg text-neutral-600">
              This profile is private. Only the user can see it.
            </p>
          </div>
        ) : !canViewContent && !isOwner ? (
          <div className="text-center py-10">
            <p className="text-lg text-neutral-600">
              This profile is private. Follow to see content and message.
            </p>
          </div>
        ) : (
          <div className=" rounded-lg shadow-md p-1">
            <RecommendationTile
              isOwner={isOwner}
              name={user.username}
              id={user.id}
            />
            <ProfileContent profileId={profileId} />
          </div>
        )}
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
    className={`flex flex-col items-center justify-center p-6 rounded-lg shadow-md bg-neutral-700 hover:shadow-lg transition-shadow duration-300 border-l-4 border-${color}-200`}
  >
    <span className={`text-2xl md:text-4xl font-bold text-neutral-100`}>
      {count}
    </span>
    <span className="text-neutral-100 text-sm mt-2">{label}</span>
  </div>
);
