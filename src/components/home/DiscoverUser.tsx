"use client";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";

interface User {
  username: string;
}
function DiscoverUsers() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [users, setUser] = useState<User[]>([]);

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient();

      const { data: Users, error: Error } = await supabase
        .from("users")
        .select("username")
        .order("updated_at", { ascending: false })
        .limit(10);

      if (!Error) {
        setUser(Users);
      }
    };
    getUser();
  }, [users]);

  const handleScroll = () => {
    const element = scrollRef.current;
    if (element) {
      const { scrollLeft, scrollWidth, clientWidth } = element;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(
        scrollWidth > clientWidth && scrollLeft < scrollWidth - clientWidth
      );
    }
  };

  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const element = scrollRef.current;
    if (element) {
      element.addEventListener("scroll", handleScroll);
      handleScroll(); // Initialize button states

      return () => element.removeEventListener("scroll", handleScroll);
    }
  }, []);
  return (
    <div className="max-w-6xl w-full m-auto mb-5">
      <div className="mt-7">
        <Link
          href={"/app/profile"}
          className="text-lg font-semibold mb-2 underline"
        >
          Discover User&apos;s
        </Link>
        <div className="relative">
          <div
            ref={scrollRef}
            className="flex flex-row items-center gap-3 m-3 overflow-x-scroll no-scrollbar"
          >
            {users
              .filter((item) => item.username !== null)
              .map((item: any) => (
                <Link
                  key={item.username}
                  className="group p-3"
                  href={`/app/profile/${item.username}`}
                >
                  <img
                    className=" min-w-44 md:min-w-64 h-fit object-cover"
                    src="/avatar.svg"
                    alt=""
                  />
                  <h1 className="text-md  break-words group-hover:text-green-500">
                    @{item.username}
                  </h1>
                </Link>
              ))}

            <div className="">
              <Link
                href={`/app/profile`}
                className="flex justify-center items-center w-24 md:w-44 h-32 md:h-56 border-2 border-neutral-500 hover:border-indigo-600 hover:bg-neutral-800 rounded-md"
              >
                more..
              </Link>
              <p className="opacity-0 ml-2">&quot;&quot;</p>
            </div>
          </div>
          {canScrollLeft && (
            <button
              onClick={scrollLeft}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-neutral-600 py-5 px-2 rounded-sm"
            >
              {"<"}
            </button>
          )}
          {canScrollRight && (
            <button
              onClick={scrollRight}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-neutral-600 py-5 px-2 rounded-sm"
            >
              {">"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default DiscoverUsers;
