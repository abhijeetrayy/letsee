"use client";

import { useState, useEffect, useMemo } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { format, formatDistanceToNow } from "date-fns";
import { FiMessageSquare, FiUser } from "react-icons/fi";

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

  useEffect(() => {
    if (!user) return;

    const fetchConversations = async () => {
      setLoading(true);

      try {
        const { data: messagesData, error: messagesError } = await supabase
          .from("messages")
          .select("sender_id, recipient_id, created_at")
          .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
          .order("created_at", { ascending: false });

        if (messagesError) throw messagesError;

        const uniqueUserIds = Array.from(
          new Set(
            messagesData
              .flatMap((msg: any) => [msg.sender_id, msg.recipient_id])
              .filter((id: string) => id !== user.id)
          )
        );

        const { data: usersData, error: usersError } = await supabase
          .from("users")
          .select("id, username, email")
          .in("id", uniqueUserIds);

        if (usersError) throw usersError;

        const { data: unreadMessages, error: unreadError } = await supabase
          .from("messages")
          .select("sender_id")
          .eq("recipient_id", user.id)
          .eq("is_read", false);

        if (unreadError) throw unreadError;

        const unreadCountMap = unreadMessages.reduce(
          (acc: { [key: string]: number }, message: any) => {
            acc[message.sender_id] = (acc[message.sender_id] || 0) + 1;
            return acc;
          },
          {}
        );

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

        const updatedConversations = usersData.map((u: any) => ({
          ...u,
          unreadCount: unreadCountMap[u.id] || 0,
          lastMessageTime: lastMessageTimeMap[u.id] || null,
        }));

        setConversations(updatedConversations);

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
            handleNewMessage
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

  const handleNewMessage = (payload: any) => {
    setConversations((prevConversations) => {
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
        fetchNewUserDetails(payload.new.sender_id);
        return prevConversations;
      }
    });
  };

  const fetchNewUserDetails = async (userId: string) => {
    const { data, error } = await supabase
      .from("users")
      .select("id, username, email")
      .eq("id", userId)
      .single();

    if (!error && data) {
      setConversations((prev) => [
        ...prev,
        {
          ...data,
          unreadCount: 1,
          lastMessageTime: new Date().toISOString(),
        },
      ]);
    }
  };

  const sortedConversations = useMemo(() => {
    return [...conversations].sort((a, b) => {
      const dateA = new Date(a.lastMessageTime || 0).getTime();
      const dateB = new Date(b.lastMessageTime || 0).getTime();
      return dateB - dateA;
    });
  }, [conversations]);

  return (
    <div className="max-w-4xl w-full mx-auto bg-neutral-900 p-6 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-neutral-100">
        Conversations
      </h1>
      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : sortedConversations.length > 0 ? (
        <ul className="space-y-4">
          {sortedConversations.map((conversation) => (
            <li key={conversation.id}>
              <Link
                href={`/app/messages/${conversation.id}`}
                className="block p-4 bg-neutral-800 hover:bg-neutral-700 rounded-lg transition duration-150 ease-in-out"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <FiUser className="h-10 w-10 text-neutral-400" />
                    </div>
                    <div>
                      <p className="text-lg font-medium text-neutral-100">
                        {conversation.username || conversation.email}
                      </p>
                      {conversation.lastMessageTime && (
                        <p className="text-sm text-neutral-400">
                          {formatDistanceToNow(
                            new Date(conversation.lastMessageTime),
                            { addSuffix: true }
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                  {conversation.unreadCount > 0 && (
                    <div className="flex items-center">
                      <span className="bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        {conversation.unreadCount}
                      </span>
                    </div>
                  )}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center py-8">
          <FiMessageSquare className="mx-auto h-12 w-12 text-neutral-400" />
          <p className="mt-4 text-lg text-neutral-300">No conversations yet</p>
          <p className="text-sm text-neutral-400">
            Start chatting with someone to see your conversations here.
          </p>
        </div>
      )}
    </div>
  );
};

export default Conversations;
