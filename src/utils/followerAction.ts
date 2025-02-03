"use server";

import { createClient } from "@/utils/supabase/server";

/**
 * Sends a follow request from `senderId` to `receiverId`.
 * Returns `{ error }` if there's an issue.
 */
export const sendFollowRequest = async (
  senderId: string,
  receiverId: string
) => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("user_follow_requests")
    .insert({
      sender_id: senderId,
      receiver_id: receiverId,
      status: "pending",
    })
    .select(); // Returns inserted row for UI sync

  return { data, error };
};

/**
 * Accepts a follow request by moving the request to `user_connections`
 * and updating the `user_follow_requests` table.
 */
export const acceptFollowRequest = async (
  requestId: number,
  senderId: string,
  receiverId: string
) => {
  const supabase = createClient();

  // Transactional flow: Insert into `user_connections`, then delete request
  const { data, error: connError } = await supabase
    .from("user_connections")
    .insert({
      follower_id: senderId,
      followed_id: receiverId,
    })
    .select();

  if (connError) return { error: connError };

  // Remove the follow request after accepting
  const { error } = await supabase
    .from("user_follow_requests")
    .delete()
    .eq("id", requestId);

  return { data, error };
};

/**
 * Rejects a follow request by deleting it from the `user_follow_requests` table.
 */
export const rejectFollowRequest = async (requestId: number) => {
  const supabase = createClient();

  const { error } = await supabase
    .from("user_follow_requests")
    .delete()
    .eq("id", requestId);

  return { error };
};
