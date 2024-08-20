"use client";
import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { SupabaseClient, User } from "@supabase/supabase-js";
import Link from "next/link";
import { Span } from "next/dist/trace";

interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  created_at: string;
}

// Helper function to check if the recipient is valid
export const isRecipientValid = async (recipientId: string) => {
  const supabase: SupabaseClient = createClient();
  const { data, error } = await supabase
    .from("users")
    .select("id")
    .eq("id", recipientId)
    .single();

  if (error || !data) {
    console.error("Invalid recipient ID:", error?.message);
    return false;
  }

  return true;
};

const Chat = () => {
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [recipient, setRecipient] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [recipientUsername, setRecipientUsername] = useState<string | null>(
    null
  );
  const [isValidRecipient, setIsValidRecipient] = useState<boolean>(true);
  const { id }: any = useParams();
  const chatRef = useRef<HTMLDivElement>(null);

  const supabase: SupabaseClient = createClient();

  const fetchUsername = async (userId: string) => {
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
  };

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

  // Set the recipient ID from the URL parameters and validate it
  useEffect(() => {
    const validateRecipient = async (recipientId: string) => {
      const valid = await isRecipientValid(recipientId);
      setIsValidRecipient(valid);
      if (valid) {
        const username = await fetchUsername(recipientId);
        setRecipientUsername(username);
      }
    };

    if (id) {
      setRecipient(id);
      validateRecipient(id);
    }
  }, [id]);

  // Fetch existing messages when user and recipient are set
  useEffect(() => {
    if (user && recipient && isValidRecipient) {
      const fetchMessages = async () => {
        const { data, error } = await supabase
          .from("messages")
          .select("*")
          .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
          .or(`sender_id.eq.${recipient},recipient_id.eq.${recipient}`)
          .order("created_at", { ascending: true });

        if (error) {
          console.error(error);
        } else {
          setLoading(false);
          setMessages(data);
        }
      };

      fetchMessages();
    }
  }, [user, recipient, isValidRecipient]);

  // Listen for new messages in real-time
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
          (payload) => {
            if (
              (payload.new.sender_id === user.id &&
                payload.new.recipient_id === recipient) ||
              (payload.new.sender_id === recipient &&
                payload.new.recipient_id === user.id)
            ) {
              setMessages((prevMessages) => [
                ...prevMessages,
                {
                  id: payload.new.id,
                  sender_id: payload.new.sender_id,
                  recipient_id: payload.new.recipient_id,
                  content: payload.new.content,
                  created_at: payload.new.created_at,
                },
              ]);
            }
          }
        )
        .subscribe();

      return () => {
        channel.unsubscribe();
      };
    }
  }, [user, recipient, isValidRecipient]);

  // Send a message to the database
  const sendMessage = async () => {
    if (message.trim() !== "" && user && recipient && isValidRecipient) {
      const { error } = await supabase.from("messages").insert([
        {
          sender_id: user.id,
          recipient_id: recipient,
          content: message,
        },
      ]);

      if (error) {
        console.error(error);
      } else {
        setMessage(""); // Clear the input field after sending the message
      }
    }
  };

  // Scroll to the bottom of the chat whenever messages are updated
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="h-full">
      {!loading ? (
        <div>
          <div className="max-w-5xl w-full m-auto my-4">
            <h1 className="text-xl">
              Message:{" "}
              <Link
                className="text-blue-500 hover:text-blue-600"
                href={`/app/profile/${recipientUsername}`}
              >
                @{recipientUsername}
              </Link>
            </h1>
          </div>
          <div className="max-w-3xl w-full m-auto bg-neutral-800 p-4 rounded-lg shadow-md min-h-full">
            <div
              className=" bg-neutral-700 p-4 rounded-lg h-full overflow-y-auto "
              ref={chatRef}
            >
              {isValidRecipient ? (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`message p-2 rounded-lg mb-2 max-w-xs ${
                      msg.sender_id === user?.id
                        ? "bg-blue-600 text-white self-end"
                        : "bg-gray-300 text-black self-start"
                    } ${msg.sender_id === user?.id ? "ml-auto" : "mr-auto"}`}
                  >
                    <div className="text-xs text-gray-600 mb-1">
                      {msg.sender_id === user?.id ? (
                        <span className="text-gray-200">You</span>
                      ) : (
                        <Link href={`/app/profile/${recipientUsername}`}>
                          @{recipientUsername || "Unknown"}
                        </Link>
                      )}
                    </div>
                    {msg.content}
                  </div>
                ))
              ) : (
                <div className="text-red-500">
                  Invalid user. Please check the URL.
                </div>
              )}
            </div>
            <div className="chat-input mt-4 flex flex-col md:flex-row md:items-center gap-2 md:gap-0 md:space-x-4">
              <input
                type="text"
                placeholder="Type your message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    sendMessage();
                  }
                }}
                className="bg-white text-neutral-700 p-2 rounded-lg shadow-sm w-full"
              />
              <button
                onClick={sendMessage}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg"
              >
                Send
              </button>
            </div>
          </div>{" "}
        </div>
      ) : (
        <p>Loading</p>
      )}
    </div>
  );
};

export default Chat;
