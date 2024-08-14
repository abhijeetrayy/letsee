"use client";
import { useSearch } from "@/app/contextAPI/searchContext";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { CiSearch } from "react-icons/ci";

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
    <form onSubmit={handleSubmit} className="flex flex-row items-center gap-2">
      <input
        className="pl-3 ring-2 ring-gray-200 outline-0 rounded-sm focus:bg-neutral-200 bg-gray-200 text-gray-900"
        name="searchtext"
        type="text"
        value={input}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setInput(e.target.value)
        }
        placeholder="Search"
      />
      <button
        className="px-4 py-2 rounded-md bg-neutral-600 hover:bg-neutral-500"
        type="submit"
        disabled={isSearchLoading || input.trim().length === 0}
      >
        {isSearchLoading ? (
          <div className="w-fit m-auto animate-spin">
            <AiOutlineLoading3Quarters />
          </div>
        ) : (
          <CiSearch />
        )}
      </button>
    </form>
  );
}

export default SearchBar;
