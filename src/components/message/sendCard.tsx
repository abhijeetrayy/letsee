"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { FaCheck } from "react-icons/fa";

interface User {
  id: string;
  username: string;
}

interface Movie {
  id: string;
  name: string;
  image: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  data?: Movie; // Movie or TV show data from props
}

const SendMessageModal: React.FC<Props> = ({ isOpen, onClose, data }: any) => {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [sender, setSender] = useState<User | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const fetchSender = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data, error } = await supabase
          .from("users")
          .select("id, username")
          .eq("id", user.id)
          .single();

        if (error) {
          console.error("Error fetching sender info:", error.message);
        } else {
          setSender(data);
        }
      }
    };

    fetchSender();
  }, []);

  useEffect(() => {
    if (search.trim() === "") {
      setUsers([]);
      return;
    }

    const fetchUsers = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("users")
        .select("id, username")
        .ilike("username", `%${search}%`)
        .neq("id", sender?.id) // Exclude sender from search results
        .limit(10);

      if (error) {
        setError("Error fetching users. Please try again.");
        console.error("Error fetching users:", error.message);
      } else {
        setUsers(data || []);
      }
      setLoading(false);
    };

    if (sender) fetchUsers();
  }, [search, sender]);

  const toggleUserSelection = (user: User) => {
    if (selectedUsers.some((u) => u.id === user.id)) {
      setSelectedUsers((prev) => prev.filter((u) => u.id !== user.id));
      setWarning(null);
    } else {
      if (selectedUsers.length >= 5) {
        setWarning("You can select up to 5 users only.");
        return;
      }
      setSelectedUsers((prev) => [...prev, user]);
      setWarning(null);
    }
  };

  const sendMessage = async () => {
    if (!message && !data) {
      setError("Please enter a message or attach a movie/TV show.");
      return;
    }

    if (selectedUsers.length === 0) {
      setError("Please select at least one recipient.");
      return;
    }

    if (!sender) {
      setError("Could not fetch sender information. Try again.");
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const messages = selectedUsers.map((user) => ({
        sender_id: sender.id,
        recipient_id: user.id,
        content: message.trim() || "", // Store message content
        message_type: data ? "cardmix" : "text", // Identify message type
        metadata: data
          ? {
              media_type: data.media_type,
              media_id: data.id,
              media_name: data.name || data.title,
              media_image: data.poster_path || data.backdrop_path,
            }
          : null, // Store movie metadata if present
      }));

      const { error } = await supabase.from("messages").insert(messages);

      if (error) {
        throw new Error("Error sending messages");
      }

      setSuccess("Messages sent successfully!");
      setMessage("");
      setSelectedUsers([]);
      setTimeout(() => onClose(), 1500);
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error("Unexpected error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]">
      <div className="bg-neutral-700 w-full h-fit max-w-3xl sm:rounded-lg p-5 shadow-xl">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-white text-lg font-semibold">
            Send Message :{(data.name || data.title)?.slice(0, 10)}..
          </h2>
          <button onClick={onClose} className="text-white hover:text-gray-300">
            ✖
          </button>
        </div>

        <div className="p-4">
          <label>Search username</label>
          <input
            type="text"
            placeholder="Search users..."
            className="mt-2 text-gray-600 bg-white w-full border rounded-lg p-2 mb-4"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="max-h-40 overflow-y-auto mb-4">
            {loading ? (
              <p className="text-gray-100">Loading users...</p>
            ) : (
              users.map((user) => (
                <div
                  key={user.id}
                  className={`flex items-center justify-between p-2 cursor-pointer rounded-lg mb-2 ${
                    selectedUsers.some((u) => u.id === user.id)
                      ? "bg-blue-500 text-white"
                      : "bg-neutral-600 hover:bg-neutral-500"
                  }`}
                  onClick={() => toggleUserSelection(user)}
                >
                  <span>{user.username}</span>
                  {selectedUsers.some((u) => u.id === user.id) && <FaCheck />}
                </div>
              ))
            )}
          </div>

          {selectedUsers.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-medium mb-2">Selected Users:</p>
              <div className="flex flex-wrap gap-2">
                {selectedUsers.map((user) => (
                  <div
                    key={user.id}
                    className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm"
                  >
                    {user.username}
                  </div>
                ))}
              </div>
            </div>
          )}

          {warning && <p className="text-yellow-500 text-sm mb-2">{warning}</p>}

          {/* {data && (
            <div className="bg-gray-800 p-3 rounded-lg mb-4 flex items-center gap-3">
              <img
                src={data.image}
                alt={data.name}
                className="w-12 h-12 rounded-lg"
              />
              <span className="text-white">{data.name}</span>
            </div>
          )} */}

          <textarea
            className="text-neutral-800 w-full border rounded-lg p-2 mb-4"
            placeholder="Type your message..."
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          {success && <p className="text-green-500 text-sm mb-4">{success}</p>}

          <button
            className="w-full bg-blue-500 text-white p-2 rounded-lg"
            onClick={sendMessage}
          >
            {loading ? "Sending..." : "Send Message"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SendMessageModal;
