import Link from "next/link";

import { createClient } from "@/utils/supabase/server";
import { IoNotifications } from "react-icons/io5";
import BurgerMenu from "./BurgerMenu";
import DropdownMenu from "./dropDownMenu";
import MessageButton from "./MessageButton";
import RealtimeNotification from "./RealtimeNotification";
import SearchBar from "./searchBar";
import { FaUser } from "react-icons/fa6";
async function Navbar() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    return (
      <div className="max-w-[1520px] w-full m-auto flex flex-row justify-between text-white  p-3 h-full ">
        <div>
          <Link href="/app">Let&apos;s see</Link>
        </div>

        <div className="flex flex-row gap-3 items-center">
          {/* <MessageButton userId={userData?.id} /> */}
          {/* <Link
          className="flex items-center justify-center px-4 py-2 rounded-md bg-neutral-600 hover:bg-neutral-500 relative"
          href={"/app/notification"}
        >
          <IoNotifications />
          <RealtimeNotification userId={data.user?.id} />
        </Link> */}

          <Link
            className="flex items-center justify-center px-4 py-2 rounded-md bg-neutral-600 hover:bg-neutral-500 relative"
            href="/app/profile"
          >
            <FaUser />
          </Link>

          <div className="hidden md:flex flex-row gap-3 items-center">
            <SearchBar />
            <Link
              className="flex items-center text-gray-100 justify-center px-3 py-1 rounded-md bg-blue-600 hover:bg-blue-500 relative"
              href="/login"
            >
              Log in
            </Link>
            {/* <DropdownMenu user={userData} /> */}
          </div>
          <BurgerMenu userID={undefined} />
        </div>
      </div>
    );
  }

  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("*")
    .eq("id", data.user?.id)
    .single();

  if (!userData || userError) {
    console.error("Error fetching user data:", userError);
    // Handle error appropriately
  }

  return (
    <div className="max-w-[1520px] w-full m-auto flex flex-row justify-between text-white  p-3 h-full ">
      <div>
        <Link href="/app">Let&apos;s see</Link>
      </div>

      <div className="flex flex-row gap-3 items-center">
        <MessageButton userId={userData?.id} />
        <Link
          className="flex items-center justify-center px-4 py-2 rounded-md bg-neutral-600 hover:bg-neutral-500 relative"
          href={"/app/notification"}
        >
          <IoNotifications />
          <RealtimeNotification userId={data.user?.id} />
        </Link>

        <Link
          className="flex items-center justify-center px-4 py-2 rounded-md bg-neutral-600 hover:bg-neutral-500 relative"
          href="/app/profile"
        >
          <FaUser />
        </Link>

        <div className="hidden md:flex flex-row gap-3 items-center">
          <SearchBar />
          <DropdownMenu user={userData} />
        </div>
        <BurgerMenu userID={userData?.username} />
      </div>
    </div>
  );
}

export default Navbar;
