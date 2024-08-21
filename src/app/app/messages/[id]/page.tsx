"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { SupabaseClient, User } from "@supabase/supabase-js";
import Link from "next/link";

interface Message {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  created_at: string;
}

const isRecipientValid = async (recipientId: string): Promise<boolean> => {
  const supabase: SupabaseClient = createClient();
  const { data, error } = await supabase
    .from("users")
    .select("id")
    .eq("id", recipientId)
    .single();
  return !error && !!data;
};

const Chat = () => {
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [recipient, setRecipient] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [disable, setDisable] = useState<boolean>(false);
  const [recipientUsername, setRecipientUsername] = useState<string | null>(
    null
  );
  const [isValidRecipient, setIsValidRecipient] = useState<boolean>(true);
  const { id }: any = useParams();
  const chatRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const supabase: SupabaseClient = createClient();

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

          const { data: messageData, error: messageError } = await supabase
            .from("messages")
            .select("*")
            .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
            .or(`sender_id.eq.${id},recipient_id.eq.${id}`)
            .order("created_at", { ascending: true });

          if (messageError) {
            console.error(messageError);
          } else {
            setMessages(messageData);
          }
          setLoading(false);
        }
      }
    };
    getUserAndMessages();
  }, [id, supabase, fetchUsername]);

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
              setMessages((prevMessages: any) => [
                ...prevMessages,
                payload.new,
              ]);
              if (payload.new.sender_id === user.id) {
                setDisable(false); // Re-enable the button only if the sent message is confirmed in the state
              }
            }
          }
        )
        .subscribe();

      return () => {
        channel.unsubscribe();
      };
    }
  }, [user, recipient, isValidRecipient, supabase]);

  const sendMessage = useCallback(async () => {
    if (message.trim() !== "" && user && recipient && isValidRecipient) {
      setDisable(true); // Disable the button before processing

      const { error } = await supabase.from("messages").insert([
        {
          sender_id: user.id,
          recipient_id: recipient,
          content: message,
        },
      ]);

      if (error) {
        console.error(error);
        setDisable(false); // Re-enable the button if there's an error
      } else {
        setMessage(""); // Clear the input field after sending the message
        setTimeout(() => {
          inputRef.current?.focus(); // Ensure the input remains focused after sending
        }, 0); // Ensure focus is set after the message is sent
      }
    }
  }, [message, user, recipient, isValidRecipient, supabase]);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="">
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
          <div className="max-w-3xl w-full m-auto bg-neutral-800 p-2 md:p-4 rounded-lg shadow-md">
            <div
              className="md:bg-neutral-700 md:p-4 rounded-lg overflow-y-auto max-h-screen h-full vone-scrollbar"
              ref={chatRef}
            >
              {isValidRecipient ? (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`break-words message p-2 rounded-lg mb-2 max-w-xs ${
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
                ref={inputRef} // Attach the ref to the input
                type="text"
                placeholder="Type your message..."
                value={message}
                onChange={(e) => {
                  if (e.target.value.length <= 2000) {
                    setMessage(e.target.value);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !disable) {
                    sendMessage(); // Send the message on Enter
                  }
                }}
                className="bg-white text-neutral-700 p-2 rounded-lg shadow-sm w-full"
              />
              <button
                disabled={disable}
                onClick={sendMessage}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      ) : (
        <p>Loading</p>
      )}
    </div>
  );
};

export default Chat;
