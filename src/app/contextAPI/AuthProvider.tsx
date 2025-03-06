"use client";

import { supabase } from "@/utils/supabase/client";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();
        if (user && !userError) {
          const { data: profile, error } = await supabase
            .from("users")
            .select("username")
            .eq("id", user.id)
            .single();

          if (
            !profile?.username &&
            !pathname.startsWith("/app/profile/setup")
          ) {
            router.push("/app/profile/setup");
          }
        } else console.log("no-user");
      } catch (error) {
        console.error("Error fetching session or profile:", error);
      }
    };

    fetchSession();
  }, [router, pathname]);

  // if (loading) {
  //   return (
  //     <div className="bg-neutral-700 text-white w-full h-screen flex justify-center items-center flex-col gap-3">
  //       <AiOutlineLoading3Quarters className="absolute size-12 text-white animate-spin" />
  //     </div>
  //   );
  // }

  return <>{children}</>;
}
