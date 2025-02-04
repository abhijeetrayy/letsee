import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const supabase = createClient();

  const { error } = await supabase.auth.getUser();

  // Redirect authenticated users away from auth pages
  if (
    (url.pathname === "/login" ||
      url.pathname === "/signup" ||
      url.pathname === "/forgot-password") &&
    !error
  ) {
    url.pathname = "/app";
    return NextResponse.redirect(url);
  }

  // Allow unauthenticated users to access /update-password
  if (url.pathname === "/update-password" && error) {
    // If the user is not authenticated but tries to access /update-password,
    // allow them to proceed (since this is part of the password reset flow)
    return NextResponse.next();
  }

  // Protect all /app routes for unauthenticated users
  if (url.pathname.startsWith("/app") && error) {
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
