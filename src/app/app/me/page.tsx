import { createClient } from "@/utils/supabase/server";
import Link from "next/link";
import React from "react";

import ChineCard from "@/components/cards/chineCard";
import ProfilePic from "../../../../public/avatar.svg";
import Image from "next/image";
import CardMovieButton from "@/components/buttons/cardButtons";
import { IoEyeOutline } from "react-icons/io5";
import { FcLike } from "react-icons/fc";
import { CiSaveDown1 } from "react-icons/ci";
import ProfileWatched from "@/components/profile/profileWatched";

const getUserData = async () => {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) {
    console.log("user isn't loged in ");
    return;
  }

  const userId = data?.user.id;

  const { count: watchedCount, error: countError } = await supabase
    .from("watched_items")
    .select("*", { count: "exact", head: true });

  const watchlater = await supabase
    .from("user_watchlist")
    .select()
    .eq("user_id", userId);
  const { count: favoriteCount } = await supabase
    .from("favorite_items")
    .select("*", { count: "exact", head: true })
    .eq("user_id", userId);
  const { data: favorates } = await supabase
    .from("favorite_items")
    .select()
    .eq("user_id", userId);

  return { watchlater, data, watchedCount, favoriteCount, favorates };
};

const ProfilePage = async ({ user }: any) => {
  const {
    data,

    watchlater,
    watchedCount,
    favoriteCount,
    favorates,
  }: any = await getUserData();
  console.log(data);
  return (
    <div className=" flex flex-col items-center ">
      <div className=" flex flex-col max-w-6xl gap-5">
        <div className=" w-full flex flex-row  p-6 mt-6">
          <div className="flex-1 flex flex-col">
            <img
              width={300}
              height={300}
              className="h-72 w-72  object-cover mb-4"
              src={"/avatar.svg"}
              alt="Profile"
            />
            <h2 className="text-2xl font-semibold ">HELLO --</h2>
            <p className="">{data?.user?.email}</p>
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
            <div className="w-full flex flex-row max-h-64 h-full">
              <div className="group flex-1 flex justify-center items-center flex-col rounded-l-md border border-gray-500 hover:flex-[2] duration-300">
                <Link
                  href={""}
                  className="text-2xl group-hover:text-4xl group-hover:text-orange-500 duration-300 group-hover:underline"
                >
                  {watchedCount}
                </Link>
                <span className="text-sm">Movie/TV Show Watched</span>
              </div>
              <div className="group flex-1 flex justify-center items-center flex-col  border border-gray-500 hover:flex-[2] duration-300">
                <Link
                  href={""}
                  className="text-2xl group-hover:text-4xl group-hover:text-indigo-500 duration-300 group-hover:underline"
                >
                  {favoriteCount}
                </Link>
                <span className="text-sm">Favorites</span>
              </div>
              <div className="group flex-1 flex justify-center items-center flex-col rounded-r-md border border-gray-500 hover:flex-[2] duration-300">
                <Link
                  href={""}
                  className="text-2xl group-hover:text-4xl group-hover:text-green-500 duration-300 group-hover:underline"
                >
                  {watchlater.data?.length}
                </Link>
                <span className="text-sm">WatchList</span>
              </div>
            </div>
          </div>
        </div>
        <div>
          <div>Favorites</div>
        </div>
        <div className="grid grid-cols-6 gap-3">
          {favorates?.map((item: any) => (
            <div className="" key={item.id}>
              <div className=" relative group flex flex-col rounded-md bg-black mr-2.5 w-full  text-gray-300 overflow-hidden duration-300  hover:scale-105 ">
                <div className="absolute top-0 left-0 z-10 opacity-0 group-hover:opacity-100">
                  {item.item_adult ? (
                    <p className="p-1 bg-red-600 text-white rounded-br-md text-sm">
                      Adult
                    </p>
                  ) : (
                    <p className="p-1 bg-black text-white rounded-br-md text-sm">
                      {item.item_type}
                    </p>
                  )}
                </div>
                {/* <div className="absolute top-0 right-0 z-10">
                  {(item.release_date || item.first_air_date) && (
                    <p className="p-1 bg-indigo-600 text-white rounded-tr-sm rounded-bl-md text-sm">
                      {new Date(item.release_date).getFullYear() ||
                        new Date(item.first_air_date).getFullYear()}
                    </p>
                  )}
                </div> */}
                <Link
                  className="h-[270px]"
                  href={`/app/${item.item_type}/${item.item_id}}`}
                >
                  <img
                    className="relative object-cover h-full w-full  "
                    src={`https://image.tmdb.org/t/p/w185/${item.image_url}`}
                    loading="lazy"
                    alt={item.item_name}
                  />
                </Link>
                <div className=" w-full bg-neutral-900 z-10">
                  <div className="w-full h-14 grid grid-cols-3 ">
                    <CardMovieButton
                      itemId={item.item_id}
                      mediaType={item.item_type}
                      name={item.item_name}
                      funcType={"watched"}
                      adult={item.item_adult}
                      imgUrl={item.image_url}
                      icon={<IoEyeOutline />}
                    />
                    <CardMovieButton
                      itemId={item.item_id}
                      mediaType={item.item_type}
                      name={item.item_name}
                      funcType={"favorite"}
                      adult={item.item_adult}
                      imgUrl={item.image_url}
                      icon={<FcLike />}
                    />
                    <CardMovieButton
                      itemId={item.item_id}
                      mediaType={item.item_type}
                      name={item.item_name}
                      funcType={"watchlater"}
                      adult={item.item_adult}
                      imgUrl={item.image_url}
                      icon={<CiSaveDown1 />}
                    />
                  </div>
                  <div
                    title={item.name || item.title}
                    className="w-full flex flex-col gap-2  px-4  bg-indigo-700  text-gray-200 "
                  >
                    <Link
                      href={`/app/${item.item_type}/${item.item_id}}`}
                      className="mb-1"
                    >
                      <span className="">
                        {item?.item_name && item.item_name.length > 15
                          ? item.item_name?.slice(0, 15) + ".."
                          : item.item_name}
                      </span>
                    </Link>
                    {/* <p className="text-xs mb-2 ">
                {data.release_date || data.first_air_date}
              </p>
              <div className=" mb-4 text-xs">
                <GenreName genreids={data.genre_ids} />
              </div> */}
                    {/* <div className="mt-1 ">
                <Staring id={data.id} type={data.media_type} />
              </div> */}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div>
          <div>Watched</div>
        </div>
        {data && <ProfileWatched userId={data.user.id} />}
      </div>
    </div>
  );
};

// Example user data
const user = {
  name: "John Doe",
  email: "john.doe@example.com",
  profilePicture: "https://via.placeholder.com/280",
  username: "johndoe",
  location: "New York, USA",
  memberSince: "January 2020",
};

const App = () => {
  return <ProfilePage user={user} />;
};

export default App;
