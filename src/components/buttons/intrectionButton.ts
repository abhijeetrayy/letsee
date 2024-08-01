import { createClient } from "@/utils/supabase/server";
import React from "react";
import { FcLike } from "react-icons/fc";

export async function watched(
  itemId: any,
  name: any,
  mediaType: any,
  imgUrl: any,
  adult: any
) {
  
   
    const supabase = createClient();

    const { data, error } = await supabase.auth.getUser();
    if (error) {
      console.log("user isn't loged in ");
      return;
    }

    const userId = data?.user.id;
  
    const { error: insertError } = await supabase
      .from("watched_items")
      .insert({
        user_id: userId,
        item_name: name,
        item_id: itemId,
        item_type: mediaType,
        image_url: imgUrl,
        item_adult: adult,
      });
      if(insertError){
        console.log(insertError);
        return "insertError"
      }
      return "Added"
  
  // return (
  //   <form>
  //     <button
  //       formAction={liked}
  //       className="px-4 py-2 rounded-md bg-neutral-700 hover:bg-neutral-600"
  //     >
  //       <FcLike />
  //     </button>
  //   </form>
  // );
}

export async function favorite(
  itemId: any,
  name: any,
  mediaType: any,
  imgUrl: any,
  adult: any
) {
  
   
    const supabase = createClient();

    const { data, error } = await supabase.auth.getUser();
    if (error) {
      console.log("user isn't loged in ");
      return;
    }

    const userId = data?.user.id;
    console.log(userId);

    const { error: insertError } = await supabase
      .from("favorite_items")
      .insert({
        user_id: userId,
        item_name: name,
        item_id: itemId,
        item_type: mediaType,
        image_url: imgUrl,
        item_adult: adult,
      });

    console.log(insertError);
  }



  export async function watchLater(
    itemId: any,
    name: any,
    mediaType: any,
    imgUrl: any,
    adult: any
  ) {
    
     
      const supabase = createClient();
  
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.log("user isn't loged in ");
        return;
      }
  
      const userId = data?.user.id;
      console.log(userId);
  
      const { error: insertError } = await supabase
        .from("user_watchlist")
        .insert({
          user_id: userId,
          item_name: name,
          item_id: itemId,
          item_type: mediaType,
          item_img: imgUrl,
          item_adult: adult,
        });
  
      console.log(insertError);
    }
//   return (
//     <form>
//       <button
//         formAction={liked}
//         className="px-4 py-2 rounded-md bg-neutral-700 hover:bg-neutral-600"
//       >
//         <FcLike />
//       </button>
//     </form>
//   );
// }

// export async function watchlistButton({ itemId, itemType, imgUrl }: any) {
//   async function liked() {
//     "use server";
//     const supabase = createClient();

//     const { data } = await supabase.auth.getUser();
//     const userId = data?.user.id;
//     console.log(userId);

//     const { error } = await supabase.from("favorite_items").insert({
//       user_id: userId,
//       item_id: itemId,
//       item_type: itemType,
//       image_url: imgUrl,
//     });

//     console.log(error);
//   }
//   return (
//     <form>
//       <button
//         formAction={liked}
//         className="px-4 py-2 rounded-md bg-neutral-700 hover:bg-neutral-600"
//       >
//         <FcLike />
//       </button>
//     </form>
//   );
// }
