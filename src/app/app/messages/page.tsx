"use client";
import { useState, useEffect, useMemo } from "react";
import { createClient } from "@/utils/supabase/client";
import { SupabaseClient, User } from "@supabase/supabase-js";
import Link from "next/link";

interface UserInfo {
  id: string;
  username: string | null;
  email: string;
}

const Conversations = () => {
  const [user, setUser] = useState<User | null>(null);
  const [conversationalists, setConversationalists] = useState<UserInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const supabase: SupabaseClient = createClient();

  // Fetch the authenticated user
  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error(error);
      } else {
        setUser(data.user);
      }
    };
    getUser();
  }, []);

  // Fetch all users who have messaged or been messaged by the authenticated user
  useEffect(() => {
    const fetchConversationalists = async () => {
      setLoading(true);
      if (user) {
        const { data, error } = await supabase
          .from("messages")
          .select("sender_id, recipient_id")
          .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`);

        if (error) {
          console.error("Error fetching messages:", error.message);
          return;
        }

        // Extract unique user IDs from messages
        const userIds = Array.from(
          new Set(
            data
              .flatMap((msg) =>
                msg.sender_id === user.id ? [msg.recipient_id] : [msg.sender_id]
              )
              .filter((id) => id !== user.id)
          )
        );

        // Fetch user details for these IDs
        const { data: usersData, error: usersError } = await supabase
          .from("users")
          .select("id, username, email")
          .in("id", userIds);

        if (usersError) {
          console.error("Error fetching user details:", usersError.message);
        } else {
          setConversationalists(usersData);
        }
        setLoading(false);
      }
    };

    fetchConversationalists();
  }, [user]);

  const chatMemo = useMemo(() => conversationalists, [conversationalists]);

  return (
    <div className="max-w-4xl w-full m-auto bg-neutral-800 p-4 rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4">Conversations</h1>
      {!loading ? (
        chatMemo.length > 0 ? (
          <ul className="flex flex-col">
            {chatMemo.map((conversationalist) => (
              <Link
                key={conversationalist.id}
                className=" group mb-2 p-2 bg-neutral-700 rounded-lg shadow-sm"
                href={`/app/messages/${conversationalist.id}`}
              >
                <span className="text-blue-100 group-hover:underline">
                  {(conversationalist.username &&
                    "@" + conversationalist.username) ||
                    conversationalist.email}
                </span>
              </Link>
            ))}
          </ul>
        ) : (
          <p>No conversations found.</p>
        )
      ) : (
        <p>Loading..</p>
      )}
    </div>
  );
};

export default Conversations;
