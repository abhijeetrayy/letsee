"use client";

import { createClient } from "@/utils/supabase/client";
import {
  acceptFollowRequest,
  rejectFollowRequest,
} from "@/utils/followerAction";
import { useEffect, useState } from "react";

const NotificationsPage = () => {
  const supabase = createClient();
  const [requests, setRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) return;
      console.log(userData);
      const userId = userData.user.id;
      const { data, error } = await supabase
        .from("user_follow_requests")
        .select(
          "id, sender_id, status, users!user_follow_requests_sender_id_fkey(username)"
        )
        .eq("receiver_id", userId)
        .eq("status", "pending")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching follow requests:", error);
        console.log("Follow Requests:", data);
      } else {
        setRequests(data || []);
      }
      setLoading(false);
    };

    fetchRequests();
  }, []);

  const handleAccept = async (requestId: number, senderId: string) => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) return;

    const { error } = await acceptFollowRequest(
      requestId,
      senderId,
      userData.user.id
    );
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
            <p>@{req.users.username} wants to follow you</p>
            <div className="flex gap-3">
              <button
                className="bg-green-500 px-3 py-1 text-white rounded hover:bg-green-600"
                onClick={() => handleAccept(req.id, req.sender_id)}
              >
                Accept
              </button>
              <button
                className="bg-red-500 px-3 py-1 text-white rounded hover:bg-red-600"
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
