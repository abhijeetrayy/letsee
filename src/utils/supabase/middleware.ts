import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "./server";

export async function updateSession(request: NextRequest) {
  console.log("🔄 Updating session for:", request.nextUrl.pathname);

  const supabase = await createClient();

  // Fetch session
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    console.warn("⚠️ Error fetching session:", error.message);
  }

  const user = data?.user;

  const publicRoutes = [
    "/login",
    "/signup",
    "/forgot-password",
    "/update-password",
  ];
  const isPublicRoute = publicRoutes.includes(request.nextUrl.pathname);
  const isUpdatePasswordPage = request.nextUrl.pathname === "/update-password";
  const hasToken = request.nextUrl.searchParams.has("token");

  // Allow access to the update-password page if it has a token
  if (isUpdatePasswordPage && hasToken) {
    console.log("✅ Allowing /update-password with token");
    return NextResponse.next();
  }

  // Redirect authenticated users from `/` to `/app`
  if (user && request.nextUrl.pathname === "/") {
    console.log("🔄 Redirecting authenticated user to /app");
    return NextResponse.redirect(new URL("/app", request.url));
  }

  // Redirect unauthenticated users away from protected pages

  // Redirect authenticated users away from auth pages
  if (user && isPublicRoute && !isUpdatePasswordPage) {
    console.log("🔄 Redirecting authenticated user from auth page to /app");
    return NextResponse.redirect(new URL("/app", request.url));
  }

  return NextResponse.next();
}
