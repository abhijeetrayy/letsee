import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "./server";

export async function updateSession(request: NextRequest) {
  console.log("🔄 Updating Supabase session for:", request.nextUrl.pathname);
  let supabaseResponse = NextResponse.next({ request });

  try {
    const supabase = await createClient();

    // Refresh session
    console.log("🔄 Refreshing session...");
    await supabase.auth.refreshSession();

    // Fetch user session
    const { data, error } = await supabase.auth.getUser();
    if (error) {
      console.warn("⚠️ No session found:", error.message);
      return supabaseResponse;
    }

    const user = data?.user;
    console.log("✅ User session:", user?.email || "No user");

    // Handle authentication pages
    const authPages = [
      "/login",
      "/signup",
      "/forgot-password",
      "/update-password",
    ];
    if (!user) {
      if (authPages.includes(request.nextUrl.pathname)) {
        console.log("🔓 Allowing access to authentication pages");
        return supabaseResponse;
      }

      console.log("🔐 Unauthorized access - Redirecting to /login");
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }

    // Redirect authenticated users away from auth pages
    if (user && authPages.includes(request.nextUrl.pathname)) {
      console.log("🔄 Redirecting authenticated user to /app");
      const url = request.nextUrl.clone();
      url.pathname = "/app";
      return NextResponse.redirect(url);
    }

    return supabaseResponse;
  } catch (error) {
    console.error("❌ Error in updateSession:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
