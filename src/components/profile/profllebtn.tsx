// FollowerBtnClient.tsx
"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

interface FollowerBtnClientProps {
  profileId: string;
  currentUserId: string;
  isFollowing: boolean;
}

export function FollowerBtnClient({
  profileId,
  currentUserId,
  isFollowing: initialIsFollowing,
}: FollowerBtnClientProps) {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const supabase = createClient();

  async function handleFollowToggle() {
    if (isFollowing) {
      // Unfollow
      const { error } = await supabase
        .from("user_connections")
        .delete()
        .eq("follower_id", currentUserId)
        .eq("followed_id", profileId);

      if (error) {
        console.error("Error unfollowing:", error);
        return;
      }
    } else {
      // Follow
      const { error } = await supabase
        .from("user_connections")
        .insert({ follower_id: currentUserId, followed_id: profileId });

      if (error) {
        console.error("Error following:", error);
        return;
      }
    }

    setIsFollowing(!isFollowing);
  }

  return (
    <button
      className={
        isFollowing
          ? "bg-neutral-500 text-gray-200 px-3 py-2 rounded-md hover:bg-neutral-400"
          : "bg-indigo-600 text-gray-200 px-3 py-2 rounded-md hover:bg-indigo-500"
      }
      onClick={handleFollowToggle}
    >
      {isFollowing ? "Unfollow" : "Follow"}
    </button>
  );
}

export function ShowFollower({ followerCount, userId }: any) {
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [following, setFollowing] = useState([]);
  const supabase = createClient();
  async function handleToggle() {
    setModal(!true);
  }
  useEffect(() => {
    async function getFollowing() {
      if (modal) {
        setLoading(true);
        try {
          const response = await fetch("/api/getfollowing", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId }),
          });
          if (!response.ok) {
            throw new Error("Failed to fetch following");
          }
          const res = await response.json();
          setFollowing(res.connection);
          console.log(res);
        } catch (error) {
          console.error("Error fetching following:", error);
        } finally {
          setLoading(false);
        }
      }
    }
    getFollowing();
  }, [modal, userId]);

  if (modal) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-4 rounded-md max-w-md w-full max-h-[80vh] overflow-y-auto">
          <button
            className="float-right text-gray-600 hover:text-gray-800"
            onClick={() => setModal(!modal)}
          >
            X
          </button>
          <h2 className="text-xl font-bold mb-4 text-neutral-700">Followers</h2>
          {loading ? (
            <p>Loading...</p>
          ) : following.length > 0 ? (
            <ul className="text-neutral-700">
              {following.map((user: any) => (
                <li className="mb-2">{user.users.email}</li>
              ))}
            </ul>
          ) : (
            <p>No following users found.</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <button
      className="border border-gray-300 w-full rounded-l-md px-4 py-2 hover:bg-neutral-800"
      onClick={() => setModal(!modal)}
    >
      {followerCount} Following
    </button>
  );
}

export function ShowFollowing({ followingCount, userId }: any) {
  const [modal, setModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [following, setFollowing] = useState([]);
  const supabase = createClient();
  async function handleToggle() {
    setModal(!true);
  }
  useEffect(() => {
    async function getFollowing() {
      if (modal) {
        setLoading(true);
        try {
          const response = await fetch("/api/getfollower", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId }),
          });
          if (!response.ok) {
            throw new Error("Failed to fetch following");
          }
          const res = await response.json();
          setFollowing(res.connection);
          console.log(res);
        } catch (error) {
          console.error("Error fetching following:", error);
        } finally {
          setLoading(false);
        }
      }
    }
    getFollowing();
  }, [modal, userId]);

  if (modal) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-4 rounded-md max-w-md w-full max-h-[80vh] overflow-y-auto">
          <button
            className="float-right text-gray-600 hover:text-gray-800"
            onClick={() => setModal(!modal)}
          >
            X
          </button>
          <h2 className="text-xl font-bold mb-4">Following</h2>
          {loading ? (
            <p>Loading...</p>
          ) : following.length > 0 ? (
            <ul>
              {following.map((user: any) => (
                <li className="mb-2">{user.users.email}</li>
              ))}
            </ul>
          ) : (
            <p>No following users found.</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <button
      className="border border-gray-300 w-full rounded-l-md px-4 py-2 hover:bg-neutral-800"
      onClick={() => setModal(!modal)}
    >
      {followingCount} Following
    </button>
  );
}
