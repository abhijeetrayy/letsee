"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import SignOut from "../buttons/signOut";
import { CiSearch } from "react-icons/ci";
import { useRouter } from "next/navigation"; // use next/navigation for client components
import { createClient } from "@/utils/supabase/client";

interface BurgerMenuProps {
  userID: string | undefined; // Define the type for the userID prop
}

const BurgerMenu: React.FC<BurgerMenuProps> = ({ userID }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [unread, setUnread] = useState<number | null>(0);

  const router = useRouter();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  async function search(e: React.FormEvent) {
    e.preventDefault();
    router.push(`/app/search/${searchText}`);
    setIsOpen(!isOpen);
  }
  function link(link: string) {
    router.push(`${link}`);
    setIsOpen(!isOpen);
  }

  const supabase = createClient();
  useEffect(() => {
    const unread = async () => {
      const { data, error } = await supabase.auth.getUser();

      const { count: messages, error: messagesError } = await supabase

        .from("messages")
        .select("*", { count: "exact", head: true })
        .eq("recipient_id", data.user?.id)
        .eq("is_read", false);

      if (messagesError) {
        throw new Error(messagesError.message);
      }
      setUnread(messages);
    };
    unread();
  }, []);

  return (
    <div className="relative">
      {/* Burger Icon */}
      <button
        className=" text-white focus:outline-none md:hidden"
        onClick={toggleMenu}
      >
        {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>

      {/* Menu */}
      <div
        className={`z-50 fixed top-0 left-0 w-full h-full bg-neutral-800 transition-transform transform ${
          isOpen ? "translate-x-0" : "-translate-x-full hidden"
        } md:hidden`}
      >
        <button
          className="z-50 absolute top-5 right-4 border rounded-md border-neutral-300 p-1 text-white focus:outline-none md:hidden"
          onClick={toggleMenu}
        >
          {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>

        <div className=" absolute top-5 w-full ">
          <h1 className="text-3xl font-bold w-fit m-auto">Let's see</h1>
        </div>

        <ul className="flex flex-col items-center justify-center h-full space-y-8 text-white">
          <li>
            <div>
              <form
                className="flex flex-row items-center gap-2"
                onSubmit={search}
              >
                <input
                  className="pl-3 ring-2 ring-gray-200 outline-0 rounded-sm focus:bg-neutral-200 bg-gray-200 text-gray-900"
                  name="searchtext"
                  type="text"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="Search"
                />
                <button
                  type="submit"
                  className="px-4 py-2 rounded-md bg-neutral-600 hover:bg-neutral-500"
                >
                  <CiSearch />
                </button>
              </form>
            </div>
          </li>
          <li>
            <button
              onClick={() => link("/app")}
              className="text-2xl hover:text-gray-400"
            >
              Let's see
            </button>
          </li>
          <li>
            <button
              onClick={() => link(`/app/messages`)}
              className="text-2xl hover:text-gray-400"
            >
              Message's{" "}
              {(unread !== 0 || unread !== null) && (
                <span className="text-green-500">({unread})</span>
              )}
            </button>
          </li>
          <li>
            <button
              onClick={() => link(`/app/profile`)}
              className="text-2xl hover:text-gray-400"
            >
              User's
            </button>
          </li>
          <li>
            <button
              onClick={() => link(`/app/profile/${userID}`)}
              className="text-2xl hover:text-gray-400"
            >
              My Profile
            </button>
          </li>
          <li>
            <div className="text-2xl hover:text-gray-400">
              <SignOut />
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default BurgerMenu;
