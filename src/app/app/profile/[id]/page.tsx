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
    <div className="flex flex-col items-center w-full">
      <div className="flex flex-col max-w-6xl w-full min-h-screen gap-5">
        {isOwner && (
          <p className="text-sm w-fit my-2 font-sans py-1 px-1 bg-neutral-700 rounded-md">
            My Profile
          </p>
        )}

        <div className="w-full flex flex-col lg:flex-row p-6">
          {/* Profile Info */}
          <div className="flex-1 flex flex-col">
            <img
              width={300}
              height={300}
              className="h-72 w-72 object-cover mb-4"
              src={"/avatar.svg"}
              alt="Profile"
            />
            <div className="flex flex-row gap-3 my-2 items-center">
              <Link
                className="w-fit text-xl hover:text-green-600"
                href={`/app/profile/${user.username}`}
              >
                @{user.username}
              </Link>

              {isOwner && (
                <Link
                  className="w-fit px-1 text-lg border rounded-md hover:text-neutral-100"
                  href="/app/profile/setup"
                >
                  <FaEdit />
                </Link>
              )}
            </div>
            {isOwner && <Visibility />}

            {user.about && (
              <p className="text-sm">
                <span className="text-neutral-400">bio: </span> {user.about}
              </p>
            )}
          </div>

          {/* User Stats & Follow Button */}
          <div className="flex-[2] mt-6 flex flex-col gap-4">
            <div className="flex flex-col md:flex-row gap-2">
              {currentUserId && !isOwner && (
                <FollowerBtnClient
                  profileId={profileId}
                  currentUserId={currentUserId}
                  initialStatus={isFollowing ? "following" : "follow"}
                />
              )}
              {!isOwner && (
                <Link
                  className="bg-blue-600 p-2 rounded-md"
                  href={`/app/messages/${profileId}`}
                >
                  Message
                </Link>
              )}
            </div>

            {/* Followers & Following */}
            <div className="flex w-full">
              <ShowFollowing
                followingCount={followingCount}
                userId={profileId}
              />
              <ShowFollower followerCount={followersCount} userId={profileId} />
            </div>

            {/* Statistics */}
            <div className="w-full flex flex-col md:flex-row min-h-64 h-full">
              <StatBox
                count={userStats.watchedCount}
                label="Movies/TV Watched"
                hoverColor="orange"
              />
              <StatBox
                count={userStats.favoriteCount}
                label="Favorites"
                hoverColor="indigo"
              />
              <StatBox
                count={userStats.watchlistCount}
                label="WatchList"
                hoverColor="green"
              />
            </div>
          </div>
        </div>

        {isOwner && (
          <div className="flex flex-col gap-3">
            <h1 className="text-3xl font-bold">Your Personal Recommendation</h1>
            <p>
              Favorite List + Watched List with{" "}
              <span className="text-blue-700">AI</span>
            </p>
            <ChataiReco />
          </div>
        )}

        {/* Conditional Content */}
        {user.visibility === "private" && !isOwner ? (
          <div className="text-center py-10">
            <p className="text-lg text-gray-600">
              This profile is private, Only user can see.
            </p>
          </div>
        ) : !canViewContent && !isOwner ? (
          <div className="text-center py-10">
            <p className="text-lg text-gray-600">
              This profile is private. Follow to see content and message.
            </p>
          </div>
        ) : (
          <div>
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
  hoverColor,
}: {
  count: number | null;
  label: string;
  hoverColor: string;
}) => (
  <div
    className={`group flex-1 flex justify-center items-center flex-col border border-gray-500 ${
      hoverColor === "orange"
        ? "rounded-l-md"
        : hoverColor === "green"
        ? "rounded-r-md"
        : ""
    }`}
  >
    <span
      className={`text-2xl group-hover:text-4xl group-hover:text-${hoverColor}-500 duration-300`}
    >
      {count}
    </span>
    <span className="text-sm">{label}</span>
  </div>
);
