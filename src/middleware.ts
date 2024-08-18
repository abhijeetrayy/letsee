import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";
import { createClient } from "@/utils/supabase/server";

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const supabase = createClient();

  // Skip middleware for static assets and favicon
  const isStaticAsset =
    url.pathname.startsWith("/_next") || url.pathname.endsWith(".ico");
  if (isStaticAsset) {
    return NextResponse.next();
  }

  // Prevent infinite redirects by checking for a custom cookie flag
  const hasRedirected = request.cookies.get("hasRedirected");
  if (hasRedirected && hasRedirected.value === "true") {
    return NextResponse.next();
  }

  const { data: UserData, error: userError } = await supabase.auth.getUser();

  // If there's no user, allow the request to proceed
  if (!UserData?.user) {
    return NextResponse.next(); // Or redirect to login page
  }

  const { data: user, error } = await supabase
    .from("users")
    .select("username")
    .eq("id", UserData.user.id)
    .single();

  // Redirect to profile setup if the username is not set
  if (user && !user.username) {
    url.pathname = "/app/profile/setup";
    const response = NextResponse.redirect(url);
    response.cookies.set("hasRedirected", "true", { path: "/" }); // Set the redirect flag
    return response;
  }

  // Redirect to /app if accessing the root path
  if (url.pathname === "/") {
    url.pathname = "/app";
    const response = NextResponse.redirect(url);
    response.cookies.set("hasRedirected", "true", { path: "/" }); // Set the redirect flag
    return response;
  }

  // Redirect to /app if the user is logged in and trying to access login or error pages
  if ((url.pathname === "/login" || url.pathname === "/error") && !error) {
    url.pathname = "/app";
    const response = NextResponse.redirect(url);
    response.cookies.set("hasRedirected", "true", { path: "/" }); // Set the redirect flag
    return response;
  }

  // Perform session update and return the response
  const sessionResponse = await updateSession(request);
  sessionResponse.cookies.delete("hasRedirected"); // Just pass the cookie name here
  return sessionResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
