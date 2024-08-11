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
      <div className="grid grid-cols-4 gap-3 max-w-5xl w-full m-auto my-3 ">
        {Users?.map((item: any) => (
          <Link
            className="border border-transparent rounded-md hover:border-neutral-700 p-3"
            href={`/app/profile/${item.id}`}
          >
            <img className="w-64 h-64 object-cover" src="/avatar.svg" alt="" />
            <h1 className="text-md  break-words">{item.email}</h1>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default page;
