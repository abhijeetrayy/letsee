// components/DropdownMenu.server.js
"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { FaBars } from "react-icons/fa";
import SignOut from "../buttons/signOut";
import { IoNotifications } from "react-icons/io5";

const DropdownMenu = ({ user }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    // Clean up the event listener on component unmount
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);
  return (
    <div ref={dropdownRef} className="dropdown">
      <button
        onClick={toggleDropdown}
        className="dropdown-button px-3 py-2 rounded-md bg-neutral-600 hover:bg-neutral-500"
      >
        <FaBars />
      </button>
      {isOpen && (
        <div className="dropdown-content px-3 py-1 rounded-md  bg-neutral-700 text-gray-700 w-[162px] mt-2 -translate-x-[120px]  ">
          {/* {items.map((item, index) => (
            <a href="#" key={index}>{item}</a>
          ))} */}
          <div className="flex flex-col items-center gap-2 my-4 ">
            <Link
              onClick={() => setIsOpen(!isOpen)}
              className="w-full text-left px-2 py-1 rounded-sm bg-neutral-200 hover:bg-neutral-100"
              href={`/app/profile/${user?.username}`}
            >
              My Profile
            </Link>
            <Link
              onClick={() => setIsOpen(!isOpen)}
              className="w-full text-left px-2 py-1 rounded-sm bg-neutral-200 hover:bg-neutral-100"
              href={`/app/moviebygenre/list/16-Animation`}
            >
              Movie Genre
            </Link>
            <Link
              onClick={() => setIsOpen(!isOpen)}
              className="w-full text-left px-2 py-1 rounded-sm bg-neutral-200 hover:bg-neutral-100"
              href={`/app/tvbygenre/list/35-Comedy`}
            >
              Tv Genre
            </Link>

            <div className="w-full text-left px-2 py-1 rounded-sm bg-neutral-200 hover:bg-neutral-100">
              <SignOut />
            </div>
          </div>
        </div>
      )}
      <style jsx>{`
        .dropdown {
          display: inline-block;
        }

        .dropdown-content {
          display: ${isOpen ? "block" : "none"};
          position: absolute;

          z-index: 1;
        }

        .dropdown-content a {
          padding: 12px 16px;
          text-decoration: none;
          display: block;
        }

        .dropdown-content a:hover {
        }
      `}</style>
    </div>
  );
};

export default DropdownMenu;
