import Link from "next/link";

import { createClient } from "@/utils/supabase/server";
import DropdownMenu from "./dropDownMenu";
import BurgerMenu from "./BurgerMenu";
import SearchBar from "./searchBar";
import { LuSend } from "react-icons/lu";
import { IoNotifications } from "react-icons/io5";
import MessageButton from "./MessageButton";
import RealtimeNotification from "./RealtimeNotification";

async function Navbar() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("*")
    .eq("id", data.user?.id)
    .single();

  if (error || userError) {
    console.error("Error fetching user data:", error || userError);
    // Handle error appropriately
  }

  return (
    <div className=" flex flex-row justify-between text-white  p-3 h-full ">
      <div>
        <Link href="/app">Let's see</Link>
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
        <div className="hidden md:flex flex-row gap-3 items-center">
          <div className="px-4 py-1 rounded-md bg-neutral-600 hover:bg-neutral-500">
            <Link href="/app/profile">User's</Link>
          </div>
          <SearchBar />
          <DropdownMenu user={userData} />
        </div>
        <BurgerMenu userID={userData?.username} userId={userData?.id} />
      </div>
    </div>
  );
}

export default Navbar;
