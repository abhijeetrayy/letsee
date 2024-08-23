"use client";

import { useState, useEffect, useMemo } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";

const options: Intl.DateTimeFormatOptions = {
  year: "numeric", // Correct type
  month: "long", // Correct type for month
  day: "numeric", // Correct type for day
  hour: "numeric", // Correct type for hour
  minute: "numeric", // Correct type for minute
  second: "numeric", // Correct type for second
  hour12: true, // Correct type for hour12
};

interface UserInfo {
  id: string;
  username: string | null;
  email: string;
  unreadCount: number;
  lastMessageTime: string | null;
}

const Conversations = () => {
  const [user, setUser] = useState<any>(null);
  const [conversations, setConversations] = useState<UserInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const supabase = createClient();

  // Fetch the authenticated user
  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching user:", error.message);
      } else {
        setUser(data.user);
      }
    };
    fetchUser();
  }, [supabase]);

  // Fetch conversations and set up real-time subscription
  useEffect(() => {
    if (!user) return;

    const fetchConversations = async () => {
      setLoading(true);

      try {
        // Fetch all conversations where the user is either the sender or recipient
        const { data: messagesData, error: messagesError } = await supabase
          .from("messages")
          .select("sender_id, recipient_id, created_at")
          .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
          .order("created_at", { ascending: false });

        if (messagesError) throw messagesError;

        // Extract unique user IDs excluding the current user
        const uniqueUserIds = Array.from(
          new Set(
            messagesData
              .flatMap((msg: any) => [msg.sender_id, msg.recipient_id])
              .filter((id: string) => id !== user.id)
          )
        );

        // Fetch user details for these IDs
        const { data: usersData, error: usersError } = await supabase
          .from("users")
          .select("id, username, email")
          .in("id", uniqueUserIds);

        if (usersError) throw usersError;

        // Fetch unread message count per sender for the logged-in user
        const { data: unreadMessages, error: unreadError } = await supabase
          .from("messages")
          .select("sender_id")
          .eq("recipient_id", user.id)
          .eq("is_read", false);

        if (unreadError) throw unreadError;

        // Create a map of unread messages count by sender
        const unreadCountMap = unreadMessages.reduce(
          (acc: { [key: string]: number }, message: any) => {
            acc[message.sender_id] = (acc[message.sender_id] || 0) + 1;
            return acc;
          },
          {}
        );

        // Create a map of last message times by user
        const lastMessageTimeMap = messagesData.reduce(
          (acc: { [key: string]: string }, message: any) => {
            const otherUserId =
              message.sender_id === user.id
                ? message.recipient_id
                : message.sender_id;
            if (!acc[otherUserId]) {
              acc[otherUserId] = message.created_at;
            }
            return acc;
          },
          {}
        );

        // Merge the unread counts and last message times with the user details
        const updatedConversations = usersData.map((u: any) => ({
          ...u,
          unreadCount: unreadCountMap[u.id] || 0,
          lastMessageTime: lastMessageTimeMap[u.id] || null,
        }));

        setConversations(updatedConversations);

        // Set up real-time subscription for new messages
        const channel = supabase
          .channel("messages")
          .on(
            "postgres_changes",
            {
              event: "INSERT",
              schema: "public",
              table: "messages",
              filter: `recipient_id=eq.${user.id}`,
            },
            (payload: any) => {
              setConversations((prevConversations: UserInfo[]) => {
                const existingUser = prevConversations.find(
                  (u) => u.id === payload.new.sender_id
                );
                if (existingUser) {
                  return prevConversations.map((u) =>
                    u.id === payload.new.sender_id
                      ? {
                          ...u,
                          unreadCount: u.unreadCount + 1,
                          lastMessageTime: payload.new.created_at,
                        }
                      : u
                  );
                } else {
                  // Fetch the new user's details and add them to the conversations
                  supabase
                    .from("users")
                    .select("id, username, email")
                    .eq("id", payload.new.sender_id)
                    .single()
                    .then(({ data, error }: any) => {
                      if (!error && data) {
                        setConversations((prev) => [
                          ...prev,
                          {
                            ...data,
                            unreadCount: 1,
                            lastMessageTime: payload.new.created_at,
                          },
                        ]);
                      }
                    });
                  return prevConversations;
                }
              });
            }
          )
          .subscribe();

        return () => {
          supabase.removeChannel(channel);
        };
      } catch (error) {
        console.error("Error fetching conversations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, [user, supabase]);

  const markAsRead = async (senderId: string) => {
    try {
      await supabase
        .from("messages")
        .update({ is_read: true })
        .eq("sender_id", senderId)
        .eq("recipient_id", user.id);

      setConversations((prevConversations: UserInfo[]) =>
        prevConversations.map((u) =>
          u.id === senderId ? { ...u, unreadCount: 0 } : u
        )
      );
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  };

  const conversationsMemo = useMemo(() => conversations, [conversations]);

  return (
    <div className="max-w-4xl w-full m-auto bg-neutral-800 p-4 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Conversations</h1>
      {!loading ? (
        conversationsMemo.length > 0 ? (
          <ul className="flex flex-col">
            {conversationsMemo
              .sort((a: any, b: any) => {
                const dateA = new Date(a.lastMessageTime).getTime();
                const dateB = new Date(b.lastMessageTime).getTime();
                return dateB - dateA;
              })
              .map((conversation: UserInfo) => (
                <Link
                  key={conversation.id}
                  className="group w-full flex flex-col mb-2 p-2 bg-neutral-700 hover:bg-opacity-80 rounded-lg shadow-sm"
                  href={`/app/messages/${conversation.id}`}
                  onClick={() => markAsRead(conversation.id)}
                >
                  <span
                    className={`text-gray-100  ${
                      conversation.unreadCount > 0 ? "font-bold" : ""
                    }`}
                  >
                    {conversation.username
                      ? `@${conversation.username}`
                      : conversation.email}
                    {conversation.unreadCount > 0 && (
                      <span className="text-xs text-green-500 ml-2">
                        ({conversation.unreadCount})
                      </span>
                    )}
                  </span>
                  {conversation.lastMessageTime && (
                    <div className="w-full text-xs text-gray-400 mt-1 text-right">
                      Last message{" "}
                      {new Date(conversation.lastMessageTime).toLocaleString(
                        "en-US",
                        options
                      )}
                    </div>
                  )}
                </Link>
              ))}
          </ul>
        ) : (
          <p>No conversations found.</p>
        )
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Conversations;
