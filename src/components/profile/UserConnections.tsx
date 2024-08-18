import { createClient } from "@/utils/supabase/server";
import React from "react";
import { ShowFollower, ShowFollowing } from "./profllebtn";

async function UserConnections({ userId }: any) {
  const supabase = createClient();
  const { data: userData, error } = await supabase.auth.getUser();
  const { count: followedby } = await supabase
    .from("user_connections")
    .select("*", { count: "exact", head: true })
    .eq("follower_id", userId);
  const { count: following } = await supabase
    .from("user_connections")
    .select("*", { count: "exact", head: true })
    .eq("followed_id", userId);
  console.log(followedby, following);

  return (
    <div className="flex flex-row justify-around h-20 w-full gap-0   ">
      <ShowFollowing userId={userId} followingCount={following} />
      <ShowFollower userId={userId} followerCount={followedby} />
    </div>
  );
}

export default UserConnections;
