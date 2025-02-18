// "use client";
// import { createClient } from "@/utils/supabase/client";
// import { Session } from "@supabase/supabase-js";
// import { useEffect, useState } from "react";

// export default function AuthProvider({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const [session, setSession] = useState<Session | null>(null);
//   const supabase = createClient();

//   useEffect(() => {
//     supabase.auth.getSession().then(({ data: { session } }) => {
//       setSession(session);
//     });

//     const { data: authListener } = supabase.auth.onAuthStateChange(
//       (_event, session) => {
//         setSession(session);
//       }
//     );

//     return () => {
//       authListener?.subscription.unsubscribe();
//     };
//   }, []);

//   return <>{children}</>;
// }
