"use client";

import { supabase } from "@/utils/supabase/client";
import {
  acceptFollowRequest,
  rejectFollowRequest,
} from "@/utils/followerAction";
import { useEffect, useState } from "react";

const NotificationsPage = () => {
  const [requests, setRequests] = useState<any[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      setUserId(user.id);

      const { data, error } = await supabase
        .from("user_follow_requests")
        .select(
          "id, sender_id, created_at, users!user_follow_requests_sender_id_fkey(username)"
        )
        .eq("receiver_id", user.id)
        .eq("status", "pending") // Ensure only pending requests are shown
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching requests:", error);
      } else {
        setRequests(data || []);
      }
      setLoading(false);
    };

    fetchRequests();
  }, []);

  useEffect(() => {
    if (!userId) return;

    const subscription = supabase
      .channel("follow_requests")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "user_follow_requests" },
        (payload) => {
          if (payload.new.receiver_id === userId) {
            setRequests((prev) => [payload.new, ...prev]);
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "user_follow_requests" },
        (payload) => {
          if (payload.new.status !== "pending") {
            setRequests((prev) =>
              prev.filter((req) => req.id !== payload.new.id)
            );
          }
        }
      )
      .on(
        "postgres_changes",
        { event: "DELETE", schema: "public", table: "user_follow_requests" },
        (payload) => {
          setRequests((prev) =>
            prev.filter((req) => req.id !== payload.old.id)
          );
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [userId]);

  const handleAccept = async (requestId: number, senderId: string) => {
    if (!userId) return;

    const { error } = await acceptFollowRequest(requestId, senderId, userId);
    if (!error) {
      setRequests((prev) => prev.filter((req) => req.id !== requestId));
    }
  };

  const handleReject = async (requestId: number) => {
    const { error } = await rejectFollowRequest(requestId);
    if (!error) {
      setRequests((prev) => prev.filter((req) => req.id !== requestId));
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Follow Requests</h1>
      {loading ? (
        <p>Loading...</p>
      ) : requests.length > 0 ? (
        requests.map((req) => (
          <div
            key={req.id}
            className="flex justify-between items-center p-3 border-b"
          >
            <p>@{req.users?.username} wants to follow you</p>
            <div className="flex gap-3">
              <button
                className="bg-green-500 text-white px-3 py-1 rounded"
                onClick={() => handleAccept(req.id, req.sender_id)}
              >
                Accept
              </button>
              <button
                className="bg-red-500 text-white px-3 py-1 rounded"
                onClick={() => handleReject(req.id)}
              >
                Reject
              </button>
            </div>
          </div>
        ))
      ) : (
        <p>No new follow requests</p>
      )}
    </div>
  );
};

export default NotificationsPage;
