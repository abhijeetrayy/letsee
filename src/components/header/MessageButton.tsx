// components/MessageButton.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { LuSend } from "react-icons/lu";

interface MessageButtonProps {
  userId: string;
}

const MessageButton: React.FC<MessageButtonProps> = ({ userId }) => {
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

    const channel = supabase
      .channel(`realtime-unread-count-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "messages",
          filter: `recipient_id=eq.${userId}`,
        },
        () => {
          fetchUnreadCount();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase, userId]);

  return (
    <Link
      href="/app/messages"
      className="flex items-center justify-center px-4 py-2 rounded-md bg-neutral-600 hover:bg-neutral-500 relative"
    >
      <LuSend />
      {unreadCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
          {unreadCount}
        </span>
      )}
    </Link>
  );
};

export default MessageButton;
