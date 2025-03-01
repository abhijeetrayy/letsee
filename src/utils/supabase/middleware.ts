import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "./server";

export async function updateSession(request: NextRequest) {
  console.log("🔄 Updating Supabase session for:", request.nextUrl.pathname);

  const supabase = await createClient();
  const response = NextResponse.next();

  try {
    // Fetch user session
    const { data: userData, error: userError } = await supabase.auth.getUser();
    const user = userData?.user;

    if (userError || !user) {
      console.log(
        "⚠️ No active session:",
        userError?.message || "User not logged in"
      );
    }

    // Define public routes (including /update-password since it’s token-based)
    const publicRoutes = [
      "/login",
      "/signup",
      "/forgot-password",
      "/update-password", // Add this to public routes
    ];
    const isPublicRoute = publicRoutes.includes(request.nextUrl.pathname);

    // Check if the request is for the update-password page and has a token
    const isUpdatePasswordPage =
      request.nextUrl.pathname === "/update-password";
    const hasToken = request.nextUrl.searchParams.has("token");

    // Allow access to /update-password with a token, regardless of authentication
    if (isUpdatePasswordPage && hasToken) {
      console.log("✅ Allowing access to /update-password with token");
      return response; // Exit early to prevent further redirects
    }

    // Redirect authenticated users from `/` to `/app`
    if (user && request.nextUrl.pathname === "/") {
      console.log("🔄 Redirecting authenticated user to /app");
      return NextResponse.redirect(new URL("/app", request.url));
    }

    // Redirect unauthenticated users away from protected pages
    if (!user && !isPublicRoute) {
      console.log("🔐 Redirecting unauthenticated user to /login");
      return NextResponse.redirect(new URL("/login", request.url));
    }

    // Redirect authenticated users away from auth pages (except /update-password with token)
    if (user && isPublicRoute && !(isUpdatePasswordPage && hasToken)) {
      console.log(
        "🔄 Redirecting authenticated user away from auth pages to /app"
      );
      return NextResponse.redirect(new URL("/app", request.url));
    }

    return response;
  } catch (error) {
    console.error("❌ Middleware error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// Optionally, configure the matcher to apply middleware to specific routes
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
