import React from "react";
import { createClient } from "@/utils/supabase/server";
import { FollowerBtnClient } from "./profllebtn";

async function UserIntrectionBtn({ userId }: any) {
  const supabase = createClient();
  const { data: userData, error }: any = await supabase.auth.getUser();
  const { data: connection } = await supabase
    .from("user_connections")
    .select("*")
    .eq("follower_id", userData?.user?.id)
    .eq("followed_id", userId)
    .single();
  console.log(connection);
  const isFollowed = (await connection?.length) !== 0 && connection !== null;
  return (
    <div className="flex flex-row gap-3">
      <FollowerBtnClient
        isFollowing={isFollowed}
        currentUserId={userData.user?.id}
        profileId={userId}
      />

      <button>Message</button>
    </div>
  );
}

export default UserIntrectionBtn;
