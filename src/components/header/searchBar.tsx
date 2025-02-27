"use client";
import { useSearch } from "@/app/contextAPI/searchContext";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { FaCircleNotch } from "react-icons/fa6";

function SearchBar() {
  const [input, setInput] = useState("");
  const router = useRouter();
  const { isSearchLoading, setIsSearchLoading } = useSearch();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (input.trim().length >= 2) {
      // Only search if input is at least 2 characters
      search(input);
    }
  }

  function search(text: string) {
    setIsSearchLoading(true);
    const encodedText = encodeURIComponent(text);
    router.push(`/app/search/${encodedText}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="relative flex flex-row items-center "
    >
      <input
        className="w-full py-2 px-4 bg-neutral-800 text-neutral-200 rounded-full focus:outline-none focus:ring-2 focus:ring-neutral-500 placeholder-neutral-400 text-sm sm:text-base"
        name="searchtext"
        type="text"
        value={input}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setInput(e.target.value)
        }
        placeholder="Search"
      />
      <button
        type="submit"
        className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-neutral-700 text-neutral-100 p-1.5 rounded-full hover:bg-neutral-600"
        disabled={isSearchLoading || input.trim().length === 0}
      >
        {isSearchLoading ? (
          <div className="w-fit m-auto animate-spin">
            <FaCircleNotch />
          </div>
        ) : (
          <FaSearch size={16} />
        )}
      </button>
    </form>
  );
}

export default SearchBar;
