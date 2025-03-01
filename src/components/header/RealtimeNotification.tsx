"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

interface RealtimeUnreadCountProps {
  userId: any;
}

const RealtimeUnreadCount: React.FC<RealtimeUnreadCountProps> = ({
  userId,
}) => {
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const supabase = createClient();

  useEffect(() => {
    const fetchUnreadCount = async () => {
      const { count, error } = await supabase
        .from("user_follow_requests")
        .select("*", { count: "exact", head: true })
        .eq("receiver_id", userId)
        .eq("status", "pending");

      if (error) {
        console.error(
          "Error fetching unread follow requests count:",
          error.message
        );
      } else {
        setUnreadCount(count || 0);
      }
    };

    fetchUnreadCount();

    // ✅ Real-time subscription for new follow requests
    const subscription = supabase
      .channel(`realtime-unread-follow-requests-${userId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "user_follow_requests" },
        (payload) => {
          setUnreadCount((prevCount) => prevCount + 1);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "user_follow_requests",
          filter: `receiver_id=eq.${userId},status=eq.pending`,
        },
        fetchUnreadCount // Re-fetch count when status changes
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [userId]);

  return (
    <span>
      {unreadCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          ({unreadCount})
        </span>
      )}
    </span>
  );
};

export default RealtimeUnreadCount;
