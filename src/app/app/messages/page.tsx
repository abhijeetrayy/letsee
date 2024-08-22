"use client";

import { useState, useEffect, useMemo } from "react";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";

interface UserInfo {
  id: string;
  username: string | null;
  email: string;
  unreadCount: number;
}

const Conversations = () => {
  const [user, setUser] = useState<any>(null);
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const supabase = createClient();

  // Fetch the authenticated user
  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching user:", error.message);
      } else {
        setUser(data.user);
      }
    };
    getUser();
  }, [supabase]);

  // Fetch all users and unread message counts
  useEffect(() => {
    const fetchUsers = async () => {
      if (!user) return;

      setLoading(true);

      try {
        // Fetch all users
        const { data: usersData, error: usersError } = await supabase
          .from("users")
          .select("id, username, email");

        if (usersError) {
          throw new Error(usersError.message);
        }

        // Fetch unread message count per sender for the logged-in user
        const { data: messages, error: messagesError } = await supabase
          .from("messages")
          .select("sender_id")
          .eq("recipient_id", user.id)
          .eq("is_read", false);

        if (messagesError) {
          throw new Error(messagesError.message);
        }

        // Create a map of unread messages count by sender
        const unreadCountMap = messages.reduce(
          (acc: { [key: string]: number }, message: any) => {
            acc[message.sender_id] = (acc[message.sender_id] || 0) + 1;
            return acc;
          },
          {}
        );

        // Merge the unread counts with the users data
        const updatedUsers = usersData.map((u: any) => ({
          ...u,
          unreadCount: unreadCountMap[u.id] || 0,
        }));

        setUsers(updatedUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [user, supabase]);

  const chatMemo = useMemo(() => users, [users]);

  return (
    <div className="max-w-4xl w-full m-auto bg-neutral-800 p-4 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Conversations</h1>
      {!loading ? (
        chatMemo.length > 0 ? (
          <ul className="flex flex-col">
            {chatMemo.map((user) => (
              <Link
                key={user.id}
                className="group mb-2 p-2 bg-neutral-700 rounded-lg shadow-sm"
                href={`/app/messages/${user.id}`}
              >
                <span
                  className={`text-blue-100 group-hover:underline ${
                    user.unreadCount > 0 ? "font-bold" : ""
                  }`}
                >
                  {user.username ? `@${user.username}` : user.email}
                  {user.unreadCount > 0 && (
                    <span className="text-xs text-red-500 ml-2">
                      ({user.unreadCount})
                    </span>
                  )}
                </span>
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
