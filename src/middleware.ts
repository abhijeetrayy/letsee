import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request,
  });

  // Initialize Supabase client
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
            response.cookies.set(name, value, options)
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

  const url = request.nextUrl.clone();

  // Redirect authenticated users away from auth pages
  if (
    user &&
    (url.pathname === "/" ||
      url.pathname === "/login" ||
      url.pathname === "/signup" ||
      url.pathname === "/forgot-password")
  ) {
    url.pathname = "/app";
    return NextResponse.redirect(url);
  }

  // Allow unauthenticated users to access /update-password
  if (url.pathname === "/update-password" && !user) {
    return NextResponse.next();
  }

  // Protect all /app routes for unauthenticated users
  if (url.pathname.startsWith("/app") && !user) {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
