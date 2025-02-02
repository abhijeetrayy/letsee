// import React from "react";
// import { createClient } from "@/utils/supabase/server";
// import { FollowerBtnClient } from "./profllebtn";
// import Link from "next/link";

// async function UserIntrectionBtn({ userId }: any) {
//   const supabase = createClient();
//   const { data: userData, error }: any = await supabase.auth.getUser();
//   const { data: connection } = await supabase
//     .from("user_connections")
//     .select("*")
//     .eq("follower_id", userData?.user?.id)
//     .eq("followed_id", userId)
//     .single();
//   console.log(connection);
//   const isFollowed = (await connection?.length) !== 0 && connection !== null;
//   return (
//     <div className="flex flex-row gap-3">
//       {/* <FollowerBtnClient currentUserId={userData.user?.id} profileId={userId} /> */}

//       <Link
//         className="bg-blue-600 p-2 rounded-md"
//         href={`/app/messages/${userId}`}
//       >
//         Message
//       </Link>
//     </div>
//   );
// }

// export default UserIntrectionBtn;
