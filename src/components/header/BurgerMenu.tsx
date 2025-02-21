// components/BurgerMenu.tsx
"use client";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { CiSearch } from "react-icons/ci";
import { FaBars, FaTimes } from "react-icons/fa";
import SignOut from "../buttons/signOut";

interface BurgerMenuProps {
  userID: string | undefined;
}

const BurgerMenu: React.FC<BurgerMenuProps> = ({ userID }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchText, setSearchText] = useState("");

  const router = useRouter();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  async function search(e: React.FormEvent) {
    e.preventDefault();
    router.push(`/app/search/${searchText}`);
    setIsOpen(false);
  }

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
            <h1 className="text-3xl font-bold w-fit m-auto">Let&apos;s see</h1>
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
                Let&apos;s see
              </button>
            </li>

            <li>
              <button
                onClick={() => link(`/app/profile`)}
                className="text-2xl hover:text-gray-400"
              >
                People
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

        <div className="absolute top-5 w-full ">
          <h1 className="text-3xl font-bold w-fit m-auto">Let&apos;s see</h1>
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
              Let&apos;s see
            </button>
          </li>

          <li>
            <button
              onClick={() => link(`/app/profile`)}
              className="text-2xl hover:text-gray-400"
            >
              People
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
