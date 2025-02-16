import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { FiMessageSquare, FiUser } from "react-icons/fi";
import { createClient } from "@/utils/supabase/server";

import { Suspense } from "react";
import LoadingSpinner from "@/components/clientComponent/Loadingspin";

interface UserInfo {
  id: string;
  username: string | null;
  email: string;
  unreadCount: number;
  lastMessageTime: string | null;
}

async function fetchConversations(userId: string) {
  const supabase = await createClient();

  const { data: messagesData, error: messagesError } = await supabase
    .from("messages")
    .select("sender_id, recipient_id, created_at")
    .or(`sender_id.eq.${userId},recipient_id.eq.${userId}`)
    .order("created_at", { ascending: false });

  if (messagesError) throw messagesError;

  const uniqueUserIds = Array.from(
    new Set(
      messagesData
        .flatMap((msg: any) => [msg.sender_id, msg.recipient_id])
        .filter((id: string) => id !== userId)
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
    .eq("recipient_id", userId)
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
        message.sender_id === userId ? message.recipient_id : message.sender_id;
      if (!acc[otherUserId]) {
        acc[otherUserId] = message.created_at;
      }
      return acc;
    },
    {}
  );

  return usersData.map((u: any) => ({
    ...u,
    unreadCount: unreadCountMap[u.id] || 0,
    lastMessageTime: lastMessageTimeMap[u.id] || null,
  }));
}

async function ConversationsList() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <div>Please log in to view conversations.</div>;
  }

  const conversations = await fetchConversations(user.id);

  const sortedConversations = [...conversations].sort((a, b) => {
    const dateA = new Date(a.lastMessageTime || 0).getTime();
    const dateB = new Date(b.lastMessageTime || 0).getTime();
    return dateB - dateA;
  });

  return (
    <div className="max-w-4xl w-full mx-auto bg-neutral-900 p-6 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6 text-neutral-100">
        Conversations
      </h1>
      {sortedConversations.length > 0 ? (
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
}

export default function ConversationsPage() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <ConversationsList />
    </Suspense>
  );
}
