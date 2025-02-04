import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const supabase = createClient();

  const { data: user, error } = await supabase.auth.getUser();

  // 🔹 Check if user is accessing /update-password
  if (url.pathname === "/update-password") {
    const accessToken = url.searchParams.get("access_token");

    // Allow access only if a valid token is present
    if (!accessToken) {
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  }

  // 🔹 Redirect authenticated users away from auth pages
  if (
    (url.pathname === "/login" ||
      url.pathname === "/signup" ||
      url.pathname === "/forgot-password") &&
    user
  ) {
    url.pathname = "/app";
    return NextResponse.redirect(url);
  }

  // 🔹 Protect /app routes for unauthenticated users
  if (url.pathname.startsWith("/app") && !user) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
