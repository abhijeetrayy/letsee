// components/BurgerMenu.tsx
"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { CiSearch } from "react-icons/ci";
import { FaBars, FaTimes, FaUser } from "react-icons/fa";
import SignOut from "../buttons/signOut";
import Link from "next/link";
import { IoNotifications } from "react-icons/io5";

interface BurgerMenuProps {
  userID: string | undefined;
}

const BurgerMenu: React.FC<BurgerMenuProps> = ({ userID }) => {
  const [isOpen, setIsOpen] = useState(false);

  const router = useRouter();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  function link(link: string) {
    router.push(link);
    setIsOpen(false);
  }
  if (userID == undefined) {
    return (
      <div className="relative">
        <button
          className="dropdown-button px-3 py-2 rounded-md bg-neutral-600 hover:bg-neutral-500 md:hidden"
          onClick={toggleMenu}
        >
          {isOpen ? <FaTimes /> : <FaBars />}
        </button>

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

          <div className="absolute top-5 w-full ">
            <h1 className="text-3xl font-bold w-fit ">Let&apos;s see</h1>
          </div>

          <ul className="flex flex-col items-center justify-center h-full space-y-8 text-white">
            <li>
              <button
                onClick={() => link("/app")}
                className="text-2xl hover:text-gray-400"
              >
                Home
              </button>
            </li>

            <li>
              <button
                onClick={() => link(`/app/tvbygenre/list/35-Comedy`)}
                className="text-2xl hover:text-gray-400"
              >
                Tv Genre
              </button>
            </li>
            <li>
              <button
                onClick={() => link(`/app/moviebygenre/list/16-Animation`)}
                className="text-2xl hover:text-gray-400"
              >
                Movie Genre
              </button>
            </li>
            <li>
              <button
                onClick={() => link(`/app/profile`)}
                className="text-2xl hover:text-gray-400"
              >
                users
              </button>
            </li>
            <li>
              <button
                onClick={() => link(`/app/reel`)}
                className="text-2xl hover:text-gray-400"
              >
                Reels
              </button>
            </li>

            <li>
              <div className="text-2xl hover:text-gray-400">
                <button
                  onClick={() => link(`/login`)}
                  className="text-2xl text-gray-100 hover:bg-blue-500 px-3 py-1 rounded-md bg-blue-600 "
                >
                  Log in
                </button>
              </div>
            </li>
          </ul>
        </div>
      </div>
    );
  }
  return (
    <div className="relative">
      <button
        className="dropdown-button px-3 py-2 rounded-md bg-neutral-600 hover:bg-neutral-500 md:hidden"
        onClick={toggleMenu}
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

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

        <div className="absolute p-5 w-full ">
          <h1 className="text-3xl font-bold w-fit">Let&apos;s see</h1>
        </div>

        <ul className="flex flex-col items-center justify-center h-full space-y-8 text-white">
          <div className="w-full flex  flex-col items-center mr-5 gap-3">
            <button
              onClick={() => link("/app")}
              className=" flex flex-row gap-2 items-center justify-center px-4 py-2 rounded-md bg-neutral-600 hover:bg-neutral-500 relative"
            >
              Home
            </button>

            <button
              onClick={() => link(`/app/profile`)}
              className=" flex flex-row gap-2 items-center justify-center px-4 py-2 rounded-md bg-neutral-600 hover:bg-neutral-500 relative"
            >
              <FaUser /> <span>User</span>
            </button>

            <button
              className=" flex flex-row gap-2 items-center justify-center px-4 py-2 rounded-md bg-neutral-600 hover:bg-neutral-500 relative"
              onClick={() => link(`/app/notification`)}
            >
              <IoNotifications /> <span>Notifi</span>
            </button>

            <button
              onClick={() => link(`/app/profile/${userID}`)}
              className=" flex flex-row gap-2 items-center justify-center px-4 py-2 rounded-md bg-neutral-600 hover:bg-neutral-500 relative"
            >
              My Profile
            </button>

            <div className="text-xl hover:text-gray-400">
              <SignOut />
            </div>
          </div>
        </ul>
      </div>
    </div>
  );
};

export default BurgerMenu;
