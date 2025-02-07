"use client";
import React, { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";

const Visibility: React.FC = () => {
  const [visibility, setVisibility] = useState<string>("public");

  const supabase = createClient();

  const handleVisibilityChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setVisibility(event.target.value);
  };

  useEffect(() => {
    const fetchVisibility = async () => {
      const { data: user, error }: any = await supabase.auth.getUser();
      console.log(user);
      if (error) {
        console.error("Error fetching user:", error.message);
        return;
      }
      const { data, error: visibilityError } = await supabase
        .from("users")
        .select("visibility")
        .eq("id", user?.user?.id)
        .single();
      if (visibilityError) {
        console.error("Error fetching visibility:", visibilityError.message);
        return;
      }
      console.log(data);
      setVisibility(data?.visibility || "public");
    };
    fetchVisibility();
  }, [supabase]);
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("User not authenticated");
      }

      const { error } = await supabase
        .from("users")
        .update({ visibility: visibility })
        .eq("id", user.id);

      if (error) {
        throw error;
      }

      alert("Visibility settings updated successfully!");
    } catch (error) {
      console.error("Error updating visibility:", error);
      alert("Failed to update visibility settings");
    }
  };

  return (
    <div className="w-fit py-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="visibility"
            className="block text-sm font-medium text-gray-200"
          >
            Profile Visibility
          </label>
          <div className="flex flex-row  gap-2">
            <select
              id="visibility"
              value={visibility}
              onChange={handleVisibilityChange}
              className="mt-1 block w-full rounded-md bg-neutral-700 text-white border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="public">Public</option>
              <option value="followers">Friends Only</option>
              <option value="private">Only Me</option>
            </select>

            <button
              type="submit"
              className="w-full flex justify-center py-2 px-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Save Changes
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Visibility;
