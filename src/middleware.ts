import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "./utils/supabase/middleware"; // Import the optimized session handler

export async function middleware(request: NextRequest) {
  console.log("🔍 Middleware triggered for:", request.nextUrl.pathname);

  // Call session update middleware (centralized logic)
  return updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
