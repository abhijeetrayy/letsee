"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { sendFollowRequest } from "@/utils/followerAction";
import Link from "next/link";

interface FollowerBtnClientProps {
  profileId: string;
  currentUserId: string | null;
  initialStatus: "following" | "pending" | "follow";
}

export function FollowerBtnClient({
  profileId,
  currentUserId,
  initialStatus,
}: FollowerBtnClientProps) {
  const [status, setStatus] = useState(initialStatus);
  const [isLoading, setIsLoading] = useState(false);
  const [logedin, setLogedin] = useState(false);
  const [modal, setModal] = useState(false);

  useEffect(() => {
    const fetchStatus = async () => {
      setIsLoading(true);
      if (!currentUserId) {
        setLogedin(false);
        setIsLoading(false);
        return;
      }
      try {
        const { data } = await supabase
          .from("user_connections")
          .select("id")
          .eq("follower_id", currentUserId)
          .eq("followed_id", profileId);

        if (data?.length) {
          setStatus("following");
          return;
        }

        const { data: requestData } = await supabase
          .from("user_follow_requests")
          .select("id")
          .eq("sender_id", currentUserId)
          .eq("receiver_id", profileId);

        setStatus(requestData?.length ? "pending" : "follow");
      } catch (error) {
        console.error("Error fetching follow status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStatus();

    // Subscribe to changes for real-time updates
    const subscription = supabase
      .channel("follow_requests")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "user_follow_requests" },
        fetchStatus
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [profileId, currentUserId, supabase]);

  const handleFollowClick = async () => {
    if (isLoading) return;
    setIsLoading(true);

    if (!logedin) {
      setModal(true);
      return;
    }

    try {
      if (status === "following") {
        await supabase
          .from("user_connections")
          .delete()
          .eq("follower_id", currentUserId)
          .eq("followed_id", profileId);
        setStatus("follow");
      } else if (status === "pending") {
        await supabase
          .from("user_follow_requests")
          .delete()
          .eq("sender_id", currentUserId)
          .eq("receiver_id", profileId);
        setStatus("follow");
      } else {
        if (!currentUserId) return;
        const { error } = await sendFollowRequest(currentUserId, profileId);
        if (!error) setStatus("pending");
        else console.log(error);
      }
    } catch (error) {
      console.error("Error handling follow action:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {modal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]">
          <div className="bg-neutral-700 w-full h-fit max-w-3xl sm:rounded-lg p-5 shadow-xl">
            <div className="flex justify-between items-center p-4 border-b">
              <Link
                className="bg-blue-600 hover:bg-blue-700 rounded-md px-3 py-2 text-white text-lg font-semibold"
                href={"/login"}
              >
                Log in
              </Link>
              <button
                onClick={() => {
                  setModal(false);
                  setIsLoading(false);
                }}
                className="text-white hover:text-gray-300"
              >
                ✖
              </button>
            </div>
            <div className="p-4">
              <p className="text-white">You need to log in to follow.</p>
            </div>
          </div>
        </div>
      )}
      <button
        className={`px-4 py-2 rounded ${
          status === "following"
            ? "bg-gray-500"
            : status === "pending"
            ? "bg-yellow-500"
            : "bg-blue-500"
        } text-white`}
        onClick={handleFollowClick}
        disabled={isLoading}
      >
        {isLoading
          ? "Loading..."
          : status === "following"
          ? "Unfollow"
          : status === "pending"
          ? "Requested"
          : "Follow"}
      </button>
    </>
  );
}

export function ShowFollowing({ followingCount, userId }: any) {
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [following, setFollowing] = useState([]);

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
        className=" text-gray-200 bg-neutral-700  w-full rounded-md px-4 py-2 hover:bg-neutral-600"
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
            ) : following.length !== 0 ? (
              <ul className="text-neutral-700">
                {following.map((user: any, index: number) => (
                  <Link
                    key={index}
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
        className=" text-gray-200 bg-neutral-700  w-full rounded-md px-4 py-2 hover:bg-neutral-600"
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
                {following.map((user: any, index: number) => (
                  <Link
                    key={index}
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
