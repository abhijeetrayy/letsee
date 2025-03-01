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

    const publicRoutes = [
      "/login",
      "/signup",
      "/forgot-password",
      "/update-password",
    ];
    const isPublicRoute = publicRoutes.includes(request.nextUrl.pathname);

    // Check if the request is for the update-password page and has a token
    const isUpdatePasswordPage =
      request.nextUrl.pathname === "/update-password";
    const hasToken = request.nextUrl.searchParams.has("token");

    // Allow access to the update-password page if it has a token
    if (isUpdatePasswordPage && hasToken) {
      return response;
    } else {
      // Redirect authenticated users from `/` to `/app`
      if (request.nextUrl.pathname === "/") {
        console.log("🔄 Redirecting authenticated user to /app");
        return NextResponse.redirect(new URL("/app", request.url));
      }

      // Redirect unauthenticated users away from protected pages
      if (!user && !isPublicRoute) {
        console.log("🔐 Redirecting unauthenticated user to /login");
        return NextResponse.redirect(new URL("/login", request.url));
      }

      // Redirect authenticated users away from auth pages
      if (user && isPublicRoute) {
        console.log(
          "🔄 Redirecting authenticated user away from auth pages to /app"
        );
        return NextResponse.redirect(new URL("/app", request.url));
      }
    }

    return response;
  } catch (error) {
    console.error("❌ Middleware error:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
