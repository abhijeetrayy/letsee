"use client";
import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/utils/supabase/client";
import { FaCheck } from "react-icons/fa";
import { MdContentCopy } from "react-icons/md";
import { FaInstagram, FaTwitter, FaWhatsapp } from "react-icons/fa6";
import { IoIosCopy } from "react-icons/io";

interface User {
  id: string;
  username: string;
}

interface Media {
  id: string;
  name?: string;
  title?: string;
  poster_path?: string;
  backdrop_path?: string;
  media_type?: string;
  seasons?: any[]; // For TV shows
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  data?: Media | null; // Movie or TV show data from props (optional)
  media_type: string | null;
}

interface Message {
  sender_id: string;
  recipient_id: string;
  content: string;
  message_type: "cardmix" | "text";
  metadata: {
    media_type?: string;
    media_id?: string;
    media_name?: string;
    media_image?: string;
  } | null;
}

const SendMessageModal: React.FC<Props> = ({
  isOpen,
  onClose,
  data,
  media_type,
}) => {
  const [search, setSearch] = useState<string>("");
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);
  const [sender, setSender] = useState<User | null>(null);
  const [logedin, setLogedin] = useState(false);
  const [copyToggle, setCopyToggle] = useState(false);

  const supabase = createClient();

  const link = `https://letsee-dusky.vercel.app/app/${
    media_type ? media_type : data?.media_type
  }/${data?.id}`;

  const shareText = `${data?.name || data?.title}`;

  const shareOnTwitter = (url: string, text: string) => {
    const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      url
    )}&text=${encodeURIComponent(text)}`;
    window.open(twitterUrl, "_blank");
  };

  const shareOnWhatsApp = (url: string, text: string) => {
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
      text + " " + url
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  // const shareOnInstagram = (url: string, text: string) => {
  //   // Instagram does not support direct sharing via URL, so we open the web version
  //   const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  //   if (isMobile) {
  //     // Try to open Instagram Direct Messenger (mobile only)
  //     const instagramUrl = `instagram://direct`;
  //     window.location.href = instagramUrl;

  //     // Fallback: Copy the link to the clipboard
  //     navigator.clipboard
  //       .writeText(url)
  //       .then(() => {
  //         alert(
  //           "Link copied to clipboard! Open Instagram and paste it to share."
  //         );
  //       })
  //       .catch((err) => {
  //         console.error("Failed to copy link: ", err);
  //       });
  //   } else {
  //     // Open Instagram's website on desktop
  //     const instagramUrl = `https://www.instagram.com/`;
  //     navigator.clipboard
  //       .writeText(url)
  //       .then(() => {
  //         alert(
  //           "Link copied to clipboard! Open Instagram and paste it to share."
  //         );
  //       })
  //       .catch((err) => {
  //         console.error("Failed to copy link: ", err);
  //       });
  //     window.open(instagramUrl, "_blank");
  //   }
  // };

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopyToggle(true);
      })
      .catch((err) => {
        console.error("Failed to copy link: ", err);
      });
  };

  // Fetch sender info on mount
  useEffect(() => {
    const fetchSender = async () => {
      const { data: userData, error: userError } =
        await supabase.auth.getUser();

      if (userError) {
        console.log("Error fetching sender info:", userError.message);
        setLogedin(false);
        return;
      }

      if (userData.user) {
        const { data, error } = await supabase
          .from("users")
          .select("id, username")
          .eq("id", userData.user.id)
          .single();

        if (error) {
          console.error("Error fetching sender info:", error.message);
        } else {
          setSender(data);
          setLogedin(true);
        }
      }
    };

    fetchSender();
  }, [supabase]);

  // Fetch users based on search query
  useEffect(() => {
    if (!search.trim() || !sender) {
      setUsers([]);
      return;
    }

    const fetchUsers = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("users")
        .select("id, username")
        .ilike("username", `%${search}%`)
        .neq("id", sender.id) // Exclude sender from search results
        .limit(10)
        .order("username", { ascending: true });

      if (error) {
        setError("Error fetching users. Please try again.");
        console.error("Error fetching users:", error.message);
      } else {
        setUsers(data || []);
      }
      setLoading(false);
    };

    fetchUsers();
  }, [search, sender, supabase]);

  // Toggle user selection
  const toggleUserSelection = useCallback(
    (user: User) => {
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
    },
    [selectedUsers]
  );

  // Send message
  const sendMessage = useCallback(async () => {
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
      const messages: Message[] = selectedUsers.map((user) => ({
        sender_id: sender.id,
        recipient_id: user.id,
        content: message.trim() || "", // Store message content
        message_type: data ? "cardmix" : "text", // Identify message type
        metadata: data
          ? {
              media_type: data.media_type
                ? data.media_type
                : data.seasons
                ? "tv"
                : "movie",
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
      setCopyToggle(false);
      setSearch("");

      setTimeout(() => onClose(), 1500);
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      console.error("Unexpected error:", err);
    } finally {
      setLoading(false);
    }
  }, [data, message, selectedUsers, sender, supabase, onClose]);

  if (!isOpen) return null;

  if (!logedin) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]">
        <div className="bg-neutral-700 w-full h-fit max-w-3xl sm:rounded-lg p-5 shadow-xl">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-white text-lg font-semibold">
              Please Log In First
            </h2>
            <button
              onClick={onClose}
              className="text-white hover:text-gray-300"
            >
              ✖
            </button>
          </div>
          <div className="p-4">
            <p className="text-white">You need to log in to send messages.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[9999]">
      <div className="bg-neutral-700 w-full max-h-screen h-fit max-w-3xl sm:rounded-lg p-5 shadow-xl">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-white text-lg font-semibold">
            Send Message: {(data?.name || data?.title)?.slice(0, 10)}..
          </h2>
          <button
            onClick={() => {
              setCopyToggle(false);

              setSelectedUsers([]);
              setSearch("");
              setMessage("");
              onClose();
            }}
            className="text-white hover:text-gray-300"
          >
            ✖
          </button>
        </div>

        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <span className="text-white">{link.slice(0, 30)}...</span>
            <button onClick={() => copyToClipboard(link)}>
              {copyToggle ? <IoIosCopy /> : <MdContentCopy />}
            </button>
          </div>

          <div className="flex space-x-4 mb-4">
            <button
              onClick={() => shareOnTwitter(link, shareText)}
              className="text-white hover:text-blue-400"
            >
              <FaTwitter size={24} />
            </button>
            <button
              onClick={() => shareOnWhatsApp(link, shareText)}
              className="text-white hover:text-green-400"
            >
              <FaWhatsapp size={24} />
            </button>
            {/* <button
              onClick={() => shareOnInstagram(link, shareText)}
              className="text-white hover:text-pink-400"
            >
              <FaInstagram size={24} />
            </button> */}
          </div>
          <label>Search username</label>
          <input
            type="text"
            placeholder="Search users..."
            className="mt-2 text-gray-600 bg-white w-full border rounded-lg p-2 mb-4"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className=" max-h-40 overflow-y-auto mb-4">
            {loading ? (
              <p className="text-gray-100">Loading users...</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-5  gap-3">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className={`flex flex-col items-center justify-between p-2 cursor-pointer rounded-full mb-2`}
                    onClick={() => toggleUserSelection(user)}
                  >
                    <img
                      className={`rounded-full w-20 h-20  ${
                        selectedUsers.some((u) => u.id === user.id)
                          ? "border-2 border-blue-500 text-white"
                          : "border-2 border-neutral-600 hover:border-neutral-500"
                      }`}
                      src="/avatar.svg"
                      alt={user.username}
                    />
                    <span className={` `}>{user.username}</span>
                    {/* {selectedUsers.some((u) => u.id === user.id) && <FaCheck />} */}
                  </div>
                ))}
              </div>
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
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Message"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SendMessageModal;
