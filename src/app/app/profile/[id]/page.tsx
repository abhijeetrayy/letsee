import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

import ThreePrefrenceBtn from "@/components/buttons/threePrefrencebtn";
import ProfileWatched from "@/components/profile/profileWatched";
import UserConnections from "@/components/profile/UserConnections";
import UserIntrectionBtn from "@/components/profile/UserIntrectionBtn";
import { redirect } from "next/navigation";
import { FaEdit } from "react-icons/fa";
import ProfileFavorites from "@/components/profile/ProfileFavorites";
import ProfileWatchlater from "@/components/profile/ProfileWatchlater";

const getUserData = async (id: any) => {
  const supabase = createClient();

  const { count: watchedCount, error: countError } = await supabase
    .from("watched_items")
    .select("*", { count: "exact", head: true })
    .eq("user_id", id);

  const { data: watchlist } = await supabase
    .from("user_watchlist")
    .select()
    .eq("user_id", id)
    .order("id", { ascending: false });
  const { count: watchlistCount } = await supabase
    .from("user_watchlist")
    .select("*", { count: "exact", head: true })
    .eq("user_id", id);
  const { count: favoriteCount } = await supabase
    .from("favorite_items")
    .select("*", { count: "exact", head: true })
    .eq("user_id", id);
  const { data: favorates } = await supabase
    .from("favorite_items")
    .select()
    .eq("user_id", id)
    .order("id", { ascending: false });
  return { watchlistCount, watchedCount, favoriteCount, favorates, watchlist };
};

const page = async ({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}) => {
  let { id }: any = params;

  let DefaultId;
  let UserData;
  const supabase = createClient();
  const { data: YouUser, error: UserError }: any =
    await supabase.auth.getUser();

  if (id == undefined) {
    redirect(`/404`);
  }

  const { data, error: profileError }: any = await supabase
    .from("users")
    .select("*")
    .eq("username", id)
    .single();

  if (profileError) {
    redirect("/app/profile/setup");
  }
  DefaultId = await data.id;
  UserData = data;

  const {
    watchedCount,
    favoriteCount,
    favorates,
    watchlist,
    watchlistCount,
  }: any = await getUserData(DefaultId);

  return (
    <div className=" flex flex-col items-center w-full">
      <div className=" flex flex-col max-w-6xl w-full min-h-screen gap-5">
        {(id == undefined || UserData.id == YouUser.user.id) && (
          <p className="text-sm w-fit my-2 font-sans  py-1 px-1 bg-neutral-700 rounded-md">
            My Profile
          </p>
        )}
        <div className=" w-full flex flex-col lg:flex-row  p-6  ">
          <div className="flex-1 flex flex-col">
            <img
              width={300}
              height={300}
              className="h-72 w-72  object-cover mb-4"
              src={"/avatar.svg"}
              alt="Profile"
            />
            <div className="flex flex-row gap-3 my-2 items-center">
              <Link
                className="w-fit text-xl hover:text-green-600"
                href={`/app/profile/${UserData?.username}`}
              >
                @{UserData?.username}
              </Link>
              {UserData.id == YouUser.user.id && (
                <Link
                  className="w-fit  px-1 text-lg border rounded-md hover:text-neutral-100"
                  href={"/app/profile/setup"}
                >
                  <FaEdit />
                </Link>
              )}
            </div>

            <div className="">
              <p className="text-sm ">{UserData.email}</p>
            </div>
            {UserData.about && (
              <div className="">
                <p className="text-sm ">About: {UserData.about}</p>
              </div>
            )}
            {/* <div className="mt-6">
              <h3 className="text-lg font-semibold  mb-2">Details</h3>
              <ul className="">
                <li>
                  <strong>Username:</strong> {user.username}
                </li>
                <li>
                  <strong>Location:</strong> {user.location}
                </li>
                <li>
                  <strong>Member Since:</strong> {user.memberSince}
                </li>
              </ul>
            </div> */}
          </div>
          <div className="flex-[2] mt-6 flex flex-col gap-4">
            {/* <div>
              <h3 className="text-lg font-semibold  mb-2">About</h3>
              <p className="">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam
                interdum ultricies purus, et volutpat orci pharetra vel. Nullam
                scelerisque, orci eget interdum dapibus, risus orci pulvinar
                sapien, eu bibendum leo turpis non risus.
              </p>
            </div> */}
            <div>
              <div className="mb-1">
                {UserData.id !== YouUser.user.id && (
                  <UserIntrectionBtn userId={UserData.id} />
                )}
              </div>
              <div className="z-50">
                <UserConnections userId={UserData.id} />
              </div>
            </div>
            <div className="w-full flex flex-col md:flex-row min-h-64 h-full">
              <div className="group flex-1 cursor-default flex justify-center items-center flex-col rounded-l-md border border-gray-500 ">
                <span className="text-2xl group-hover:text-4xl group-hover:text-orange-500 duration-300 ">
                  {watchedCount}
                </span>
                <span className="text-sm">Movie/TV Show Watched</span>
              </div>
              <div className="group flex-1 cursor-default flex justify-center items-center flex-col  border border-gray-500 ">
                <span className="text-2xl group-hover:text-4xl group-hover:text-indigo-500 duration-300 ">
                  {favoriteCount}
                </span>
                <span className="text-sm">Favorites</span>
              </div>
              <div className="group flex-1 cursor-default flex justify-center items-center flex-col rounded-r-md border border-gray-500 ">
                <span className="text-2xl group-hover:text-4xl group-hover:text-green-500 duration-300 ">
                  {watchlistCount}
                </span>
                <span className="text-sm">WatchList</span>
              </div>
            </div>
          </div>
        </div>
        {favoriteCount > 0 && (
          <ProfileFavorites
            favorites={favorates}
            favoriteCount={favoriteCount}
          />
        )}
        {watchlistCount > 0 && (
          <ProfileWatchlater
            watchlist={watchlist}
            watchlistCount={watchedCount}
          />
        )}
        {watchedCount > 0 && (
          <div className="z-40">
            <div className="my-3">
              <div>
                Watched {""} "{watchedCount}"
              </div>
            </div>
            <ProfileWatched userId={DefaultId} />
          </div>
        )}
      </div>
    </div>
  );
};

export default page;
