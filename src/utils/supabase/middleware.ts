import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "./server";

export async function updateSession(request: NextRequest) {
  console.log("🔄 Updating Supabase session for:", request.nextUrl.pathname);

  const supabase = await createClient();
  const response = NextResponse.next();

  try {
    const { data: userData, error: userError } = await supabase.auth.getUser();
    const user = userData?.user;

    if (userError || !user) {
      console.log(
        "⚠️ No active session:",
        userError?.message || "User not logged in"
      );
    }

    const publicRoutes = [
      "/login",
      "/signup",
      "/forgot-password",
      "/update-password",
    ];
    const isPublicRoute = publicRoutes.includes(request.nextUrl.pathname);

    const isUpdatePasswordPage =
      request.nextUrl.pathname === "/update-password";
    const hasToken = request.nextUrl.searchParams.has("token");

    // Allow /update-password with token for unauthenticated users
    if (isUpdatePasswordPage && hasToken) {
      console.log("✅ Allowing access to /update-password with token");
      return response; // Early return to prevent redirects
    }

    // Redirect authenticated users from root to /app
    if (user && request.nextUrl.pathname === "/") {
      console.log("🔄 Redirecting authenticated user to /app");
      return NextResponse.redirect(new URL("/app", request.url));
    }

    // Redirect unauthenticated users from non-public routes to /login

    // Redirect authenticated users from public routes (except /update-password with token) to /app
    if (user && isPublicRoute && !isUpdatePasswordPage) {
      console.log("🔄 Redirecting authenticated user from auth page to /app");
      return NextResponse.redirect(new URL("/app", request.url));
    }

    return response;
  } catch (error) {
    console.error("❌ Middleware error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
