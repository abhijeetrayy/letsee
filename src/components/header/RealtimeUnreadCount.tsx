"use client";

import React, { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";

interface UnreadMessageCounterProps {
  userId: string | undefined;
  className?: string;
}

const UnreadMessageCounter: React.FC<UnreadMessageCounterProps> = ({
  userId,
  className,
}) => {
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const supabase = createClient();

  useEffect(() => {
    if (!userId) return;

    const fetchUnreadCount = async () => {
      const { count, error } = await supabase
        .from("messages")
        .select("*", { count: "exact", head: true })
        .eq("recipient_id", userId)
        .eq("is_read", false);

      if (error) {
        console.error("Error fetching unread messages:", error.message);
        return;
      }

      setUnreadCount(count || 0);
    };

    const setupSubscription = () => {
      const channel = supabase
        .channel(`messages:recipient:${userId}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "messages",
            filter: `recipient_id=eq.${userId}`,
          },
          (payload: any) => {
            console.log("New message received:", payload);
            if (!payload.new.is_read) {
              setUnreadCount((prevCount) => prevCount + 1);
            }
          }
        )
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "messages",
            filter: `recipient_id=eq.${userId}`,
          },
          (payload: any) => {
            console.log("Message read status updated:", payload);
            if (payload.old.is_read === false && payload.new.is_read === true) {
              setUnreadCount((prevCount) => Math.max(prevCount - 1, 0));
            }
          }
        )
        .subscribe();

      return channel;
    };

    fetchUnreadCount();
    const channel = setupSubscription();

    // Cleanup subscription on component unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, supabase]);

  if (unreadCount === 0) return null;

  return <span className={className}>({unreadCount})</span>;
};

export default UnreadMessageCounter;
