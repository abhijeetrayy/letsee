import Link from "next/link";

import { createClient } from "@/utils/supabase/server";
import DropdownMenu from "./dropDownMenu";
import BurgerMenu from "./BurgerMenu";
import SearchBar from "./searchBar";
import { LuSend } from "react-icons/lu";
import MessageButton from "./MessageButton";

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
