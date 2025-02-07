"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import { FiSend, FiArrowDown } from "react-icons/fi";
import Image from "next/image";

interface Message {
  is_read: boolean;
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  created_at: string;
  message_type: string;
  metadata: {
    media_id: string;
    media_name: string;
    media_image: string;
    media_type: string;
  };
}

const options: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "long",
  day: "numeric",
  hour: "numeric",
  minute: "numeric",
  second: "numeric",
  hour12: true,
};

const dateOptions: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "long",
  day: "numeric",
};

const isRecipientValid = async (recipientId: string): Promise<boolean> => {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("users")
    .select("id")
    .eq("id", recipientId)
    .single();
  if (error) {
    console.error("Error validating recipient:", error.message);
    return false;
  }
  return !!data;
};

const Chat = () => {
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [user, setUser] = useState<any>(null);
  const [recipient, setRecipient] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [disable, setDisable] = useState<boolean>(false);
  const [recipientUsername, setRecipientUsername] = useState<string | null>(
    null
  );
  const [isValidRecipient, setIsValidRecipient] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [newMessageCount, setNewMessageCount] = useState<number>(0);
  const lastMessageRef = useRef<HTMLDivElement>(null);
  const [hasMoreMessages, setHasMoreMessages] = useState<boolean>(true);
  const [offset, setOffset] = useState<number>(0);
  const { id } = useParams<{ id: string }>();
  const chatRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const supabase = createClient();

  const fetchUsername = useCallback(
    async (userId: string) => {
      const { data, error } = await supabase
        .from("users")
        .select("username")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching username:", error.message);
        return null;
      }
      return data?.username || null;
    },
    [supabase]
  );

  const fetchMessages = useCallback(
    async (user: any, recipientId: string, offsetValue: number) => {
      const { data: messageData, error: messageError } = await supabase
        .from("messages")
        .select("*")
        .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
        .or(`sender_id.eq.${recipientId},recipient_id.eq.${recipientId}`)
        .order("created_at", { ascending: false })
        .range(offsetValue, offsetValue + 49);

      if (messageError) {
        console.error(messageError);
        return [];
      }

      setHasMoreMessages(messageData.length === 50);
      return messageData.reverse();
    },
    [supabase]
  );

  const scrollToBottom = useCallback(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, []);

  useEffect(() => {
    const getUserAndMessages = async () => {
      const { data: userData, error: userError } =
        await supabase.auth.getUser();
      if (userError) {
        console.error(userError);
        return;
      }

      const user = userData.user;
      setUser(user);

      if (id) {
        setRecipient(id);
        const valid = await isRecipientValid(id);
        setIsValidRecipient(valid);
        if (valid) {
          const username = await fetchUsername(id);
          setRecipientUsername(username);

          const messageData = await fetchMessages(user, id, 0);
          setMessages(messageData);

          const unreadMessageIds = messageData
            .filter(
              (msg: Message) =>
                msg.recipient_id === user.id && msg.is_read === false
            )
            .map((msg: Message) => msg.id);

          if (unreadMessageIds.length > 0) {
            await supabase
              .from("messages")
              .update({ is_read: true })
              .in("id", unreadMessageIds);
          }

          setLoading(false);
        }
      }
    };
    getUserAndMessages();
  }, [id, supabase, fetchUsername, fetchMessages]);

  useEffect(() => {
    if (!loading) {
      scrollToBottom();
    }
  }, [loading, scrollToBottom]);

  useEffect(() => {
    if (user && recipient && isValidRecipient) {
      const channel = supabase
        .channel("public:messages")
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "messages",
          },
          (payload: { new: Message }) => {
            if (
              (payload.new.sender_id === user.id &&
                payload.new.recipient_id === recipient) ||
              (payload.new.sender_id === recipient &&
                payload.new.recipient_id === user.id)
            ) {
              setMessages((prevMessages) => [...prevMessages, payload.new]);
              if (payload.new.sender_id === user.id) {
                setDisable(false);
                scrollToBottom();
              } else if (!isScrolledToBottom()) {
                setNewMessageCount((prev) => prev + 1);
              } else {
                scrollToBottom();
              }
            }
          }
        )
        .subscribe();

      return () => {
        channel.unsubscribe();
      };
    }
  }, [user, recipient, isValidRecipient, supabase, scrollToBottom]);

  const isScrolledToBottom = () => {
    if (chatRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = chatRef.current;
      return Math.abs(scrollHeight - clientHeight - scrollTop) < 1;
    }
    return false;
  };

  const loadMoreMessages = async () => {
    if (user && recipient && isValidRecipient) {
      setLoadingMore(true);
      console.log("Loading more messages...");
      console.log("Current offset:", offset);

      if (chatRef.current) {
        const previousScrollHeight = chatRef.current.scrollHeight;
        const previousScrollTop = chatRef.current.scrollTop;

        const newOffset = offset + 50;
        const olderMessages = await fetchMessages(user, recipient, newOffset);

        console.log("Fetched messages:", olderMessages.length);

        setMessages((prevMessages) => [...olderMessages, ...prevMessages]);
        setOffset(newOffset);
        setHasMoreMessages(olderMessages.length === 50);

        setTimeout(() => {
          if (chatRef.current) {
            chatRef.current.scrollTop =
              chatRef.current.scrollHeight -
              previousScrollHeight +
              previousScrollTop;
          }
        }, 0);
      }
      setLoadingMore(false);
    }
  };

  const sendMessage = useCallback(async () => {
    if (message.trim() !== "" && user && recipient && isValidRecipient) {
      setDisable(true);

      const { error } = await supabase.from("messages").insert([
        {
          sender_id: user.id,
          recipient_id: recipient,
          content: message.trim(),
        },
      ]);

      if (error) {
        console.error(error);
        setDisable(false);
      } else {
        setMessage("");
        setTimeout(() => {
          inputRef.current?.focus();
          scrollToBottom();
        }, 0);
      }
    }
  }, [message, user, recipient, isValidRecipient, supabase, scrollToBottom]);

  const renderMessages = (messages: Message[]) => {
    return messages.map((msg) => (
      <div
        key={msg.id}
        className={`flex ${
          msg.sender_id === user?.id ? "justify-end" : "justify-start"
        } mb-4`}
      >
        <div
          className={`break-words p-3 rounded-lg max-w-xs md:max-w-md lg:max-w-lg ${
            msg.sender_id === user?.id
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-black"
          }`}
        >
          <div className="text-xs text-gray-500 mb-1">
            {msg.sender_id === user?.id ? (
              <span className="text-gray-200">You</span>
            ) : (
              <Link href={`/app/profile/${recipientUsername}`}>
                @{recipientUsername || "Unknown"}
              </Link>
            )}
          </div>

          {msg.message_type === "text" ? (
            <p className="text-sm">{msg.content}</p>
          ) : (
            <div className="flex flex-col gap-2">
              <Link
                href={`/app/${msg.metadata.media_type}/${msg.metadata.media_id}`}
                className="bg-gray-100 p-3 rounded-lg flex flex-col gap-2"
              >
                <Image
                  width={342}
                  height={513}
                  src={`https://image.tmdb.org/t/p/w342${msg.metadata.media_image}`}
                  alt={msg.metadata.media_name}
                  className="w-full h-40 object-cover rounded-lg mb-2"
                />
                <h3 className="text-gray-900 font-semibold">
                  {msg.metadata.media_name}
                </h3>
              </Link>
              <p className="text-sm ">{msg.content}</p>
            </div>
          )}

          <span className="block text-xs text-right mt-1 opacity-70">
            {new Date(msg.created_at).toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      </div>
    ));
  };

  return (
    <div className="chat-container flex flex-col max-w-4xl w-full m-auto ">
      <div className=" shadow-sm p-4">
        <h2 className="text-xl font-semibold">
          Message{" "}
          <Link href={`/app/profile/${recipientUsername}`}>
            @{recipientUsername}
          </Link>
        </h2>
      </div>
      {!loading ? (
        <div className="flex-grow flex flex-col max-h-[calc(100vh-130px)] max-w-3xl w-full m-auto">
          <div
            className="chat-messages flex-grow overflow-y-auto bg-neutral-700 rounded-t-md vone-scrollbar p-4 "
            ref={chatRef}
          >
            {isValidRecipient ? (
              <>
                {hasMoreMessages && (
                  <button
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-full text-sm w-full max-w-xs mx-auto mb-4 transition duration-150 ease-in-out"
                    onClick={loadMoreMessages}
                    disabled={loadingMore}
                  >
                    {loadingMore ? "Loading..." : "Load More Messages"}
                  </button>
                )}
                {renderMessages(messages)}
              </>
            ) : (
              <div className="text-red-500 text-center">
                Invalid user. Please check the URL.
              </div>
            )}
          </div>
          {newMessageCount > 0 && (
            <div
              className="bg-blue-500 text-white text-center py-2 px-4 cursor-pointer flex items-center justify-center"
              onClick={() => {
                scrollToBottom();
                setNewMessageCount(0);
              }}
            >
              <FiArrowDown className="mr-2" />
              {newMessageCount} new message{newMessageCount > 1 ? "s" : ""}
            </div>
          )}
          <div className="chat-input p-4 bg-neutral-800 rounded-b-md shadow-lg">
            <div className="flex items-center space-x-2 max-w-4xl mx-auto">
              <textarea
                ref={inputRef}
                placeholder="Type your message..."
                value={message}
                onChange={(e) => {
                  if (e.target.value.length <= 2000) {
                    setMessage(e.target.value);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey && !disable) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                className="flex-grow bg-gray-100 text-gray-800 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                style={{
                  minHeight: "2.5rem",
                  maxHeight: "10rem",
                  resize: "none",
                }}
                onInput={(e) => {
                  e.currentTarget.style.height = "auto";
                  e.currentTarget.style.height = `${Math.min(
                    e.currentTarget.scrollHeight,
                    160
                  )}px`;
                }}
              />
              <button
                disabled={disable || message.trim() === ""}
                onClick={sendMessage}
                className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full disabled:opacity-50 transition duration-150 ease-in-out"
              >
                <FiSend size={20} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-grow flex items-center justify-center">
          <p className="">Loading...</p>
        </div>
      )}
    </div>
  );
};

export default Chat;
