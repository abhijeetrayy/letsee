import { createClient } from "@/utils/supabase/server";
import Link from "next/link";

import CardMovieButton from "@/components/buttons/cardButtons";
import ProfileWatched from "@/components/profile/profileWatched";
import { redirect } from "next/navigation";
import { CiSaveDown1 } from "react-icons/ci";
import { FcLike } from "react-icons/fc";
import { IoEyeOutline } from "react-icons/io5";
import ThreePrefrenceBtn from "@/components/buttons/threePrefrencebtn";

const getUserData = async (id: any) => {
  console.log(id, "hola");
  const supabase = createClient();

  const { count: watchedCount, error: countError } = await supabase
    .from("watched_items")
    .select("*", { count: "exact", head: true })
    .eq("user_id", id);

  const { data: watchlist } = await supabase
    .from("user_watchlist")
    .select()
    .eq("user_id", id);
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
    .eq("user_id", id);
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

  console.log(id, "dd");

  let DefaultId;
  let UserData;
  const supabase = createClient();
  const { data: YouUser, error }: any = await supabase.auth.getUser();
  console.log(YouUser);

  if (id == undefined) {
    redirect(`/app/profile?id=${YouUser.user.id}`);
  }

  if (id !== undefined && id !== YouUser.user.id) {
    const { data: OtherUser, error }: any = await supabase
      .from("users")
      .select()
      .eq(" id", id);
    console.log(OtherUser, "oo");
    DefaultId = await OtherUser[0]?.id;
    UserData = OtherUser[0];
  } else {
    DefaultId = await YouUser?.user?.id;
    UserData = YouUser;
  }

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
        {(id == undefined || id == YouUser.user.id) && (
          <p className="text-sm w-fit my-2 font-sans  py-1 px-1 bg-neutral-700 rounded-md">
            My Profile
          </p>
        )}
        <div className=" w-full flex flex-row  p-6  ">
          <div className="flex-1 flex flex-col">
            <img
              width={300}
              height={300}
              className="h-72 w-72  object-cover mb-4"
              src={"/avatar.svg"}
              alt="Profile"
            />
            <h2 className="text-2xl font-semibold ">HELLO --</h2>
            <div className="">
              {id == undefined || id == YouUser.user.id ? (
                <p className="text-sm ">{YouUser.user.email}</p>
              ) : (
                <p className="text-sm ">{UserData.email}</p>
              )}
            </div>
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
                  {watchlistCount}
                </Link>
                <span className="text-sm">WatchList</span>
              </div>
            </div>
          </div>
        </div>
        {favoriteCount > 0 && (
          <div>
            <div className="my-3">
              <div>Favorites "{favoriteCount}"</div>
            </div>
            <div className="w-full grid grid-cols-6 gap-3">
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
                      href={`/app/${item.item_type}/${item.item_id}`}
                    >
                      <img
                        className="relative object-cover h-full w-full  "
                        src={`https://image.tmdb.org/t/p/w185/${item.image_url}`}
                        loading="lazy"
                        alt={item.item_name}
                      />
                    </Link>
                    <div className=" w-full bg-neutral-900 z-10">
                      <ThreePrefrenceBtn
                        cardId={item.item_id}
                        cardType={item.item_type}
                        cardName={item.item_name}
                        cardAdult={item.item_adult}
                        cardImg={item.image_url}
                      />
                      <div
                        title={item.name || item.title}
                        className="w-full flex flex-col gap-2  px-4  bg-indigo-700  text-gray-200 "
                      >
                        <Link
                          href={`/app/${item.item_type}/${item.item_id}`}
                          className="mb-1"
                        >
                          <span className="">
                            {item?.item_name &&
                              (item.item_name.length > 16
                                ? item.item_name?.slice(0, 14) + ".."
                                : item.item_name)}
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
          </div>
        )}
        {watchlistCount > 0 && (
          <div>
            <div className="my-3">
              <div>WatchLater "{watchlistCount}"</div>
            </div>
            <div className="w-full grid grid-cols-6 gap-3">
              {watchlist?.map((item: any) => (
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
                      href={`/app/${item.item_type}/${item.item_id}`}
                    >
                      <img
                        className="relative object-cover h-full w-full  "
                        src={`https://image.tmdb.org/t/p/w185/${item.item_img}`}
                        loading="lazy"
                        alt={item.item_name}
                      />
                    </Link>
                    <div className=" w-full bg-neutral-900 z-10">
                      <ThreePrefrenceBtn
                        cardId={item.item_id}
                        cardType={item.item_type}
                        cardName={item.item_name}
                        cardAdult={item.item_adult}
                        cardImg={item.image_url}
                      />

                      <div
                        title={item.name || item.title}
                        className="w-full flex flex-col gap-2  px-4  bg-indigo-700  text-gray-200 "
                      >
                        <Link
                          href={`/app/${item.item_type}/${item.item_id}`}
                          className="mb-1"
                        >
                          <span className="">
                            {item?.item_name &&
                              (item.item_name.length > 16
                                ? item.item_name?.slice(0, 14) + ".."
                                : item.item_name)}
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
          </div>
        )}
        {watchedCount > 0 && (
          <div>
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
