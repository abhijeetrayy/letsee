import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "./server";

export async function updateSession(request: NextRequest) {
  console.log("🔄 Updating Supabase session for:", request.nextUrl.pathname);

  const supabase = await createClient();
  const response = NextResponse.next();

  try {
    // Refresh session
    // const { data, error } = await supabase.auth.refreshSession();

    // if (error) {
    //   console.warn("⚠️ Error refreshing session:", error.message);
    //   return response;
    // }

    // Fetch user session
    const { data: userData, error: userError } = await supabase.auth.getUser();

    const user = userData?.user;
    if (userError || !user) {
      console.log(
        "⚠️ No active session:",
        userError?.message || "User not logged in"
      );
    }

    // if (userError || !user) {
    //   console.warn(
    //     "⚠️ No active session:",
    //     userError?.message || "User not logged in"
    //   );
    // } else {
    //   console.log("✅ Authenticated:", user.email);
    // }

    const publicRoutes = [
      "/login",
      "/signup",
      "/forgot-password",
      "/update-password",
    ];
    const isPublicRoute = publicRoutes.includes(request.nextUrl.pathname);

    // Redirect authenticated users from `/` to `/app`
    if (request.nextUrl.pathname === "/") {
      console.log("🔄 Redirecting authenticated user to /app");
      return NextResponse.redirect(new URL("/app", request.url));
    }

    // Redirect unauthenticated users away from protected pages
    // if (!user && !isPublicRoute) {
    //   console.log("🔐 Redirecting unauthenticated user to /login");
    //   return NextResponse.redirect(new URL("/login", request.url));
    // }

    // Redirect authenticated users away from auth pages
    if (user && isPublicRoute) {
      console.log(
        "🔄 Redirecting authenticated user away from auth pages to /app"
      );
      return NextResponse.redirect(new URL("/app", request.url));
    }

    return response;
  } catch (error) {
    console.error("❌ Middleware error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
