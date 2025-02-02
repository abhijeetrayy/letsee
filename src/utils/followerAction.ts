// utils/followerAction.ts
"use server";

import { createClient } from "@/utils/supabase/server";

export const sendFollowRequest = async (
  senderId: string,
  receiverId: string
) => {
  const supabase = createClient();

  const { error } = await supabase.from("user_follow_requests").insert({
    sender_id: senderId,
    receiver_id: receiverId,
    status: "pending",
  });

  return { error };
};

export const acceptFollowRequest = async (
  requestId: number,
  senderId: string,
  receiverId: string
) => {
  const supabase = createClient();

  // Add to user_connections
  const { error: connError } = await supabase.from("user_connections").insert({
    follower_id: senderId,
    followed_id: receiverId,
  });

  if (connError) return { error: connError };

  // Update request status
  const { error } = await supabase
    .from("user_follow_requests")
    .update({ status: "accepted" })
    .eq("id", requestId);

  return { error };
};

export const rejectFollowRequest = async (requestId: number) => {
  const supabase = createClient();

  const { error } = await supabase
    .from("user_follow_requests")
    .update({ status: "rejected" })
    .eq("id", requestId);

  return { error };
};
