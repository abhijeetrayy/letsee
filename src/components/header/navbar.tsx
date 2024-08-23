import Link from "next/link";
import SignOut from "../buttons/signOut";
import { redirect } from "next/navigation";
import { CiSearch } from "react-icons/ci";
import DropdownMenu from "./dropDownMenu";
import { createClient } from "@/utils/supabase/server";
import { RxHamburgerMenu } from "react-icons/rx";
import BurgerMenu from "./BurgerMenu";
import SearchBar from "./searchBar";
import { SearchProvider } from "@/app/contextAPI/searchContext";
import { count } from "console";
import RealtimeUnreadCount from "./RealtimeUnreadCount";
import { LuSend } from "react-icons/lu";

async function navbar() {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("*")
    .eq("id", data.user?.id)
    .single();
  const { count: messages, error: messagesError } = await supabase
    .from("messages")
    .select("*", { count: "exact", head: true })
    .eq("recipient_id", data.user?.id)
    .eq("is_read", false);

  if (messagesError) {
    throw new Error(messagesError.message);
  }

  // Create a map of unread messages count by sender

  return (
    <div className="w-full flex flex-row items-center justify-between text-white max-w-7xl p-3 h-full z-50">
      <div className="">
        <Link href={"/app"}>Let's see</Link>
      </div>

      <div className="flex flex-row gap-3 items-center">
        <div className="px-4 py-1  rounded-md bg-neutral-600 hover:bg-neutral-500">
          <Link
            className="flex flex-row gap-1 items-center justify-center my-1"
            href={`/app/messages`}
          >
            <LuSend />
            {/* <RealtimeUnreadCount
              userId={userData.id}
              className="text-green-500"
            /> */}
          </Link>
        </div>
        <div className="hidden md:flex flex-row gap-3  items-center">
          <div className="px-4 py-1  rounded-md bg-neutral-600 hover:bg-neutral-500">
            <Link href={`/app/profile`}>User's</Link>
          </div>
          <div>
            <SearchBar />
          </div>

          <div className=" group relative inline-block text-left">
            <DropdownMenu user={userData} />
          </div>
        </div>
        <div>
          <BurgerMenu userID={userData.username} userId={userData.id} />
        </div>
      </div>
    </div>
  );
}

export default navbar;
