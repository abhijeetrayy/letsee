"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { sendFollowRequest } from "@/utils/followerAction";

import Link from "next/link";

interface FollowerBtnClientProps {
  profileId: string;
  currentUserId: string;
  initialStatus: "following" | "pending" | "follow";
}

export function FollowerBtnClient({
  profileId,
  currentUserId,
  initialStatus,
}: FollowerBtnClientProps) {
  const [status, setStatus] = useState(initialStatus);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function fetchStatus() {
      const { data } = await supabase
        .from("user_connections")
        .select("*")
        .eq("follower_id", currentUserId)
        .eq("followed_id", profileId);

      if (data?.length) {
        setStatus("following");
      } else {
        const { data: requestData } = await supabase
          .from("user_follow_requests")
          .select("*")
          .eq("sender_id", currentUserId)
          .eq("receiver_id", profileId);

        setStatus(requestData?.length ? "pending" : "follow");
      }
      setIsLoading(false);
    }

    fetchStatus();
  }, [profileId, currentUserId, supabase]);

  const handleFollowClick = async () => {
    setIsLoading(true);

    try {
      if (status === "following") {
        const { error } = await supabase
          .from("user_connections")
          .delete()
          .eq("follower_id", currentUserId)
          .eq("followed_id", profileId);
        if (!error) setStatus("follow");
      } else if (status === "pending") {
        const { error } = await supabase
          .from("user_follow_requests")
          .delete()
          .eq("sender_id", currentUserId)
          .eq("receiver_id", profileId);
        if (!error) setStatus("follow");
      } else {
        const { error } = await sendFollowRequest(currentUserId, profileId);
        if (!error) setStatus("pending");
      }
    } catch (error) {
      console.error("Error handling follow action:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      className={`px-3 py-2 rounded-md text-gray-200 transition-all duration-200 ${
        status === "following"
          ? "bg-neutral-500 hover:bg-neutral-400"
          : status === "pending"
          ? "bg-gray-500 hover:bg-gray-600"
          : "bg-indigo-600 hover:bg-indigo-500"
      } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
      onClick={handleFollowClick}
      disabled={isLoading}
    >
      {isLoading
        ? "Loading..."
        : status === "following"
        ? "Following"
        : status === "pending"
        ? "Requested"
        : "Follow"}
    </button>
  );
}

export function ShowFollowing({ followingCount, userId }: any) {
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [following, setFollowing] = useState([]);
  const supabase = createClient();

  useEffect(() => {
    async function getFollowing() {
      if (modal) {
        setLoading(true);
        try {
          const response = await fetch("/api/getfollowing", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId }),
          });
          if (!response.ok) throw new Error("Failed to fetch following");
          const res = await response.json();
          setFollowing(res.connection);
        } catch (error) {
          console.error("Error fetching following:", error);
        } finally {
          setLoading(false);
        }
      }
    }
    getFollowing();
  }, [modal, userId]);

  return (
    <>
      <button
        className="border border-gray-300 w-full rounded-l-md px-4 py-2 hover:bg-neutral-800"
        onClick={() => setModal(true)}
      >
        {followingCount} Following
      </button>

      {modal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="z-50 bg-white p-4 rounded-md max-w-md w-full max-h-[80vh] overflow-y-auto">
            <button
              className="float-right text-gray-600"
              onClick={() => setModal(false)}
            >
              X
            </button>
            <h2 className="text-xl font-bold mb-4 text-neutral-700">
              Following
            </h2>

            {loading ? (
              <p>Loading...</p>
            ) : following.length > 0 ? (
              <ul className="text-neutral-700">
                {following.map((user: any) => (
                  <Link
                    key={user.follower_id}
                    href={`/app/profile/${user.users.username}`}
                    className="block mb-2 hover:text-indigo-700"
                  >
                    @{user.users.username}
                  </Link>
                ))}
              </ul>
            ) : (
              <p>No followers found.</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export function ShowFollower({ followerCount, userId }: any) {
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [following, setFollowing] = useState([]);
  const supabase = createClient();

  useEffect(() => {
    async function getFollowing() {
      if (modal) {
        setLoading(true);
        try {
          const response = await fetch("/api/getfollower", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId }),
          });
          if (!response.ok) throw new Error("Failed to fetch following");
          const res = await response.json();
          setFollowing(res.connection);
        } catch (error) {
          console.error("Error fetching following:", error);
        } finally {
          setLoading(false);
        }
      }
    }
    getFollowing();
  }, [modal, userId]);

  return (
    <>
      <button
        className="border border-gray-300 w-full rounded-r-md px-4 py-2 hover:bg-neutral-800"
        onClick={() => setModal(true)}
      >
        {followerCount} Follower
      </button>

      {modal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="z-50 bg-white p-4 rounded-md max-w-md w-full max-h-[80vh] overflow-y-auto">
            <button
              className="float-right text-gray-600"
              onClick={() => setModal(false)}
            >
              X
            </button>
            <h2 className="text-xl font-bold mb-4 text-neutral-700">
              Follower
            </h2>

            {loading ? (
              <p>Loading...</p>
            ) : following.length > 0 ? (
              <ul className="text-neutral-700">
                {following.map((user: any) => (
                  <Link
                    key={user.follower_id}
                    href={`/app/profile/${user.users.username}`}
                    className="block mb-2 hover:text-indigo-700"
                  >
                    @{user.users.username}
                  </Link>
                ))}
              </ul>
            ) : (
              <p>No following users found.</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
