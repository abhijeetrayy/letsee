"use server";

import { NextResponse, type NextRequest } from "next/server";

import { createClient } from "./utils/supabase/server";

export async function middleware(request: NextRequest) {
  console.log("🔍 Middleware triggered for:", request.nextUrl.pathname);
  let response = NextResponse.next({ request });

  try {
    const supabase = await createClient();

    const url = request.nextUrl.clone();

    // Routes that unauthenticated users CAN access
    const publicRoutes = [
      "/login",
      "/signup",
      "/forgot-password",
      "/update-password",
    ];

    // PROTECTED ROUTES: Refresh session only when accessing protected areas
    if (
      !publicRoutes.includes(url.pathname) &&
      url.pathname.startsWith("/app")
    ) {
      console.log("🔄 Refreshing Supabase session...");
      await supabase.auth.refreshSession();
    }

    // Fetch user session
    const { data, error } = await supabase.auth.getUser();
    const user = data?.user;

    if (error || !user) {
      console.warn(
        "⚠️ No authenticated session found:",
        error?.message || "No user session"
      );

      // Allow unauthenticated users to access public routes
      if (publicRoutes.includes(url.pathname)) {
        console.log("🟢 Allowing access to public route:", url.pathname);
        return response;
      }

      // Redirect unauthenticated users to login
      console.log("🔐 Redirecting to /login due to missing session.");
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }

    console.log("✅ Authenticated User:", user.email);

    // Redirect authenticated users away from auth pages
    if (publicRoutes.includes(url.pathname)) {
      console.log("🔄 Redirecting authenticated user to /app");
      url.pathname = "/app";
      return NextResponse.redirect(url);
    }

    return response;
  } catch (error) {
    console.error("❌ Middleware error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// Matcher ensures middleware is applied only to relevant routes
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
