import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

const getUserData = async () => {
  const supabase = createClient();

  const { data: Users, error: Error } = await supabase
    .from("users")
    .select("*");

  return { Users };
};

const page = async () => {
  const { Users } = await getUserData();
  console.log(Users);
  return (
    <div className=" max-w-6xl w-full m-auto ">
      <h1 className="text-xl font-bold my-3">User's</h1>
      <p className="text-sm">Find Your Cinema Soul</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4  gap-3 max-w-5xl w-full m-auto my-3 ">
        {Users?.filter((item: any) => item.username !== null).map(
          (item: any) => (
            <Link className="group p-3" href={`/app/profile/${item.username}`}>
              <img className=" object-cover" src="/avatar.svg" alt="" />
              <h1 className="text-md  break-words group-hover:text-green-500">
                @{item.username}
              </h1>
            </Link>
          )
        )}
      </div>
    </div>
  );
};

export default page;
