"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

interface RealtimeUnreadCountProps {
  userId: string;
  className?: string;
}

const RealtimeUnreadCount: React.FC<RealtimeUnreadCountProps> = ({
  userId,
  className,
}) => {
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const supabase = createClient();

  useEffect(() => {
    const fetchUnreadCount = async () => {
      const { count, error } = await supabase
        .from("messages")
        .select("*", { count: "exact", head: true })
        .eq("recipient_id", userId)
        .eq("is_read", false);

      if (error) {
        console.error("Error fetching unread messages count:", error.message);
      } else {
        setUnreadCount(count || 0);
      }
    };

    fetchUnreadCount();

    // Set up real-time subscription
    const channel = supabase
      .channel(`realtime-unread-count-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `recipient_id=eq.${userId}`,
        },
        (payload: any) => {
          setUnreadCount((prevCount) => prevCount + 1);
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "messages",
          filter: `recipient_id=eq.${userId},is_read=eq.false`,
        },
        (payload: any) => {
          fetchUnreadCount(); // Re-fetch count when a message is updated
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, userId]);

  return (
    <span className={className}>
      {unreadCount > 0 && <span>({unreadCount})</span>}
    </span>
  );
};

export default RealtimeUnreadCount;
