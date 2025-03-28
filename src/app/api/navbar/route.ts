import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

// Define the User type
interface User {
  id: string;
  username?: string;
  [key: string]: any;
}

export async function GET(request: Request) {
  const supabase = await createClient();
  try {
    // Get the authenticated user from Supabase
    const {
      data: { user: authUser },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !authUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch additional user data from the "users" table
    const { data: userData, error: dbError } = await supabase
      .from("users")
      .select("*")
      .eq("id", authUser.id)
      .single();

    if (dbError || !userData) {
      return NextResponse.json(
        { error: "User data not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ user: userData }, { status: 200 });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
