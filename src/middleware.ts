import { NextResponse, type NextRequest } from "next/server";

import { createClient } from "./utils/supabase/server";

export async function middleware(request: NextRequest) {
  console.log("🔍 Middleware triggered for:", request.nextUrl.pathname);

  const supabase = await createClient();
  const res = NextResponse.next();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const publicRoutes = [
    "/login",
    "/signup",
    "/forgot-password",
    "/update-password",
  ];

  // If user is NOT authenticated
  if (!user) {
    if (!publicRoutes.includes(request.nextUrl.pathname)) {
      console.log("🔐 Redirecting to login...");
      return NextResponse.redirect(new URL("/login", request.url));
    }
  } else {
    console.log("✅ Authenticated user:", user.email);
    if (publicRoutes.includes(request.nextUrl.pathname)) {
      console.log("🔄 Redirecting authenticated user to /app");
      return NextResponse.redirect(new URL("/app", request.url));
    }
  }

  return res;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
