import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch email from Clerk — if it fails, still log the login
    let email: string | null = null;
    try {
      const client = await clerkClient();
      const user = await client.users.getUser(userId);
      email =
        user.emailAddresses.find((e) => e.id === user.primaryEmailAddressId)
          ?.emailAddress ||
        user.emailAddresses[0]?.emailAddress ||
        null;
    } catch (clerkError) {
      console.error("Failed to fetch email from Clerk:", clerkError);
    }

    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      req.headers.get("x-real-ip") ||
      null;

    const userAgent = req.headers.get("user-agent") || null;

    const { error } = await supabase.from("user_logins").insert({
      user_id: userId,
      email,
      ip_address: ip,
      user_agent: userAgent,
    });

    if (error) {
      console.error("Failed to log login:", error);
      return NextResponse.json({ error: "Failed to log login" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Log login error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
