import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "./server";

// Define public routes that authenticated users should not access
const PUBLIC_AUTH_ROUTES = ["/login", "/signup", "/forgot-password"];

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
    // Proceed anyway; client-side will handle auth enforcement if needed
  }

  // Redirect from "/" to "/app" for all users (auth or unauth)
  if (pathname === "/") {
    console.log("🔄 Redirecting to /app");
    return NextResponse.redirect(new URL("/app", request.url));
  }

  // Handle authenticated users
  if (user) {
    // Check profile for username
    const { data: profile, error: profileError } = await supabase
      .from("users")
      .select("username")
      .eq("id", user.id)
      .single();

    if (profileError) {
      console.warn("⚠️ Error fetching profile:", profileError.message);
      // Proceed; client-side can handle further validation
    } else if (
      !profile?.username &&
      !pathname.startsWith("/app/profile/setup")
    ) {
      console.log("🔄 Redirecting to profile setup");
      return NextResponse.redirect(new URL("/app/profile/setup", request.url));
    }

    // Redirect authenticated users away from public auth routes
    if (PUBLIC_AUTH_ROUTES.includes(pathname)) {
      console.log("🔄 Redirecting authenticated user from auth page to /app");
      return NextResponse.redirect(new URL("/app", request.url));
    }

    // Allow /update-password with token for authenticated users
    if (pathname === "/update-password" && searchParams.has("token")) {
      console.log("✅ Allowing /update-password with token");
      return NextResponse.next();
    }
  }

  // Allow all other requests (unauthenticated users can visit freely)
  return NextResponse.next();
}
