"use server";

import { createClient } from "@/utils/supabase/client";

/**
 * Sends a follow request from `senderId` to `receiverId`.
 * Ensures duplicate requests aren't inserted.
 */
export const sendFollowRequest = async (
  senderId: string,
  receiverId: string
) => {
  const supabase = createClient();

  // Check if a request already exists
  const { data: existingRequest, error: checkError } = await supabase
    .from("user_follow_requests")
    .select("id, status")
    .eq("sender_id", senderId)
    .eq("receiver_id", receiverId)
    .maybeSingle();

  if (checkError) return { error: checkError };

  if (existingRequest) {
    return { error: "Follow request already exists." };
  }

  // Insert new follow request
  const { data, error } = await supabase
    .from("user_follow_requests")
    .insert({
      sender_id: senderId,
      receiver_id: receiverId,
      status: "pending",
    })
    .select()
    .single();

  return { data, error };
};

/**
 * Accepts a follow request:
 * - Inserts the sender into `user_connections`
 * - Deletes the request from `user_follow_requests`
 */
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

  // Update request status to "accepted"
  const { error } = await supabase
    .from("user_follow_requests")
    .update({ status: "accepted" })
    .eq("id", requestId);

  return { error };
};

/**
 * Rejects a follow request by deleting it from `user_follow_requests`.
 */
export const rejectFollowRequest = async (requestId: number) => {
  const supabase = createClient();

  const { error } = await supabase
    .from("user_follow_requests")
    .delete()
    .eq("id", requestId);

  return { error };
};
