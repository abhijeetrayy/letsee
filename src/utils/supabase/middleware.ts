import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "./server";

// Define public routes that don't require authentication
const PUBLIC_ROUTES = [
  "/login",
  "/signup",
  "/forgot-password",
  "/update-password",
];

export async function updateSession(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  console.log("🔄 Updating session for:", pathname);

  const supabase = await createClient();

  // Fetch the authenticated user
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError) {
    console.warn("⚠️ Error fetching session:", authError.message);
    // If there's an error, allow the request to proceed (fallback to client-side checks)
    return NextResponse.next();
  }

  // Handle profile validation for authenticated users
  if (user) {
    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("username")
      .eq("id", user.id)
      .single();

    if (profileError) {
      console.warn("⚠️ Error fetching profile:", profileError.message);
      // If there's an error, allow the request to proceed (fallback to client-side checks)
      return NextResponse.next();
    }

    // Redirect to profile setup if username is missing
    if (!profile?.username && !pathname.startsWith("/app/profile/setup")) {
      console.log("🔄 Redirecting to profile setup");
      return NextResponse.redirect(new URL("/app/profile/setup", request.url));
    }
  }

  // Allow access to the update-password page if it has a token
  const isUpdatePasswordPage = pathname === "/update-password";
  const hasToken = searchParams.has("token");
  if (isUpdatePasswordPage && hasToken) {
    console.log("✅ Allowing /update-password with token");
    return NextResponse.next();
  }

  // Redirect authenticated users from `/` to `/app`
  if (user && pathname === "/") {
    console.log("🔄 Redirecting authenticated user to /app");
    return NextResponse.redirect(new URL("/app", request.url));
  }

  // Redirect unauthenticated users away from protected pages
  const isPublicRoute = PUBLIC_ROUTES.includes(pathname);

  // Redirect authenticated users away from auth pages
  if (user && isPublicRoute && !isUpdatePasswordPage) {
    console.log("🔄 Redirecting authenticated user from auth page to /app");
    return NextResponse.redirect(new URL("/app", request.url));
  }

  // Allow the request to proceed
  return NextResponse.next();
}
