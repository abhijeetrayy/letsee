import { createClient } from "@/utils/supabase/server";
import React from "react";
import { FcLike } from "react-icons/fc";

export async function likedButton({ itemId, itemType, imgUrl }: any) {
  async function liked() {
    "use server";
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
        item_id: itemId,
        item_type: itemType,
        image_url: imgUrl,
      });

    console.log(error);
  }
  return (
    <form>
      <button
        formAction={liked}
        className="px-4 py-2 rounded-md bg-neutral-700 hover:bg-neutral-600"
      >
        <FcLike />
      </button>
    </form>
  );
}

export async function watchedButton({ itemId, itemType, imgUrl }: any) {
  async function liked() {
    "use server";
    const supabase = createClient();

    const { data } = await supabase.auth.getUser();
    const userId = data?.user.id;
    console.log(userId);

    const { error } = await supabase.from("favorite_items").insert({
      user_id: userId,
      item_id: itemId,
      item_type: itemType,
      image_url: imgUrl,
    });

    console.log(error);
  }
  return (
    <form>
      <button
        formAction={liked}
        className="px-4 py-2 rounded-md bg-neutral-700 hover:bg-neutral-600"
      >
        <FcLike />
      </button>
    </form>
  );
}

export async function watchlistButton({ itemId, itemType, imgUrl }: any) {
  async function liked() {
    "use server";
    const supabase = createClient();

    const { data } = await supabase.auth.getUser();
    const userId = data?.user.id;
    console.log(userId);

    const { error } = await supabase.from("favorite_items").insert({
      user_id: userId,
      item_id: itemId,
      item_type: itemType,
      image_url: imgUrl,
    });

    console.log(error);
  }
  return (
    <form>
      <button
        formAction={liked}
        className="px-4 py-2 rounded-md bg-neutral-700 hover:bg-neutral-600"
      >
        <FcLike />
      </button>
    </form>
  );
}
