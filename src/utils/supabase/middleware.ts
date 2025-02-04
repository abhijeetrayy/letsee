import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Get the current user session
  const { data, error } = await supabase.auth.getUser();
  const user = data?.user;

  // Handle authentication errors
  if (error) {
    console.error("Authentication error:", error.message);
  }

  // Allow access to auth pages if the user is NOT logged in
  if (!user) {
    if (
      request.nextUrl.pathname.startsWith("/login") ||
      request.nextUrl.pathname.startsWith("/signup") ||
      request.nextUrl.pathname.startsWith("/forgot-password") ||
      request.nextUrl.pathname.startsWith("/update-password")
    ) {
      return supabaseResponse;
    }

    // Redirect unauthenticated users trying to access other pages to login
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Redirect authenticated users away from auth pages
  if (
    user &&
    (request.nextUrl.pathname.startsWith("/login") ||
      request.nextUrl.pathname.startsWith("/signup") ||
      request.nextUrl.pathname.startsWith("/forgot-password"))
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/app"; // Redirect to a default authenticated route
    return NextResponse.redirect(url);
  }

  // Return the response with updated session data
  return supabaseResponse;
}
