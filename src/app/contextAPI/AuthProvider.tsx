// "use client";

// import { supabase } from "@/utils/supabase/client";
// import { Session, User } from "@supabase/supabase-js";
// import { useRouter, usePathname } from "next/navigation";
// import { useEffect, useState } from "react";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  //   const [session, setSession] = useState<Session | null>(null);
  //   const [user, setUser] = useState<User | null>(null);
  //   const [loading, setLoading] = useState(false);
  //   const [initialFetchComplete, setInitialFetchComplete] = useState(false);
  //   const router = useRouter();
  //   const pathname = usePathname(); // Get the current route

  //   useEffect(() => {
  //     console.log("🔄 useEffect running");

  //     const fetchSession = async () => {
  //       console.log("🔍 Fetching session...");
  //       try {
  //         const {
  //           data: { session },
  //           error: sessionError,
  //         } = await supabase.auth.getSession();

  //         setSession(session);

  //         if (session) {
  //           console.log("🔍 Fetching user...");
  //           const {
  //             data: { user },
  //             error: userError,
  //           } = await supabase.auth.getUser();

  //           if (userError) {
  //             console.error("❌ Error fetching user:", userError.message);
  //             setUser(null);
  //             return;
  //           }

  //           setUser(user);
  //           await validateUserProfile(user, pathname); // Pass the current route
  //         }
  //       } catch (error) {
  //         console.error("❌ Error fetching session or user:", error);
  //       } finally {
  //         console.log("✅ Loading set to false");
  //         setLoading(false);
  //         setInitialFetchComplete(true); // Mark initial fetch as complete
  //       }
  //     };

  //     fetchSession();

  //     const { data: authListener } = supabase.auth.onAuthStateChange(
  //       async (_event, session) => {
  //         if (!initialFetchComplete) {
  //           console.log(
  //             "⏳ Skipping onAuthStateChange until initial fetch completes"
  //           );
  //           return;
  //         }

  //         setSession(session);

  //         if (session) {
  //           console.log("🔍 Fetching user on auth state change...");
  //           const {
  //             data: { user },
  //             error: userError,
  //           } = await supabase.auth.getUser();
  //           console.log(
  //             "👤 User data on auth state change:",
  //             user,
  //             "Error:",
  //             userError
  //           );

  //           if (userError) {
  //             console.error("❌ Error fetching user:", userError.message);
  //             setUser(null);
  //             return;
  //           }

  //           setUser(user);
  //           await validateUserProfile(user, pathname); // Pass the current route
  //         } else {
  //           console.log("🚫 No session, setting user to null");
  //           setUser(null);
  //         }
  //       }
  //     );

  //     return () => {
  //       console.log("🧹 Cleaning up auth listener");
  //       authListener?.subscription.unsubscribe();
  //     };
  //   }, [initialFetchComplete, pathname]); // Add pathname as a dependency

  //   // Validate user profile and redirect if necessary
  //   const validateUserProfile = async (
  //     user: User | null,
  //     currentPath: string
  //   ) => {
  //     console.log(user?.id);
  //     if (!user) {
  //       // Redirect to login if user is not authenticated
  //       router.push("/login");
  //       return;
  //     }

  //     // Define routes that can be accessed without a username
  //     const allowedRoutesWithoutUsername = ["/app/profile/setup"];
  //     const isAllowedRoute = allowedRoutesWithoutUsername.includes(currentPath);

  //     // Fetch additional user data (e.g., username) from your database
  //     const { data: profile, error } = await supabase
  //       .from("users")
  //       .select("username")
  //       .eq("id", user.id)
  //       .single();

  //     console.log(profile);

  //     if (error || !profile?.username) {
  //       if (!isAllowedRoute) {
  //         router.push("/app/profile/setup");
  //       }
  //     }
  //   };

  // Show loading state while session is being fetched
  //   if (loading) {
  //     return (
  //       <div className=" bg-neutral-700 text-white w-full h-screen flex justify-center items-center flex-col gap-3 ">
  //         Loading...
  //       </div>
  //     );
  //   }

  // Render children only if the user is authenticated and has a valid profile
  return <>{children}</>;
}
