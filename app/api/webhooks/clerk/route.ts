import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "svix";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error("CLERK_WEBHOOK_SECRET is not set");
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
  }

  // Get svix headers for verification
  const svixId = req.headers.get("svix-id");
  const svixTimestamp = req.headers.get("svix-timestamp");
  const svixSignature = req.headers.get("svix-signature");

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json({ error: "Missing svix headers" }, { status: 400 });
  }

  const body = await req.text();

  // Verify the webhook signature
  const wh = new Webhook(webhookSecret);
  let event: { type: string; data: Record<string, unknown> };

  try {
    event = wh.verify(body, {
      "svix-id": svixId,
      "svix-timestamp": svixTimestamp,
      "svix-signature": svixSignature,
    }) as { type: string; data: Record<string, unknown> };
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Only handle session.created events
  if (event.type !== "session.created") {
    return NextResponse.json({ received: true });
  }

  const sessionData = event.data;
  const userId = sessionData.user_id as string;

  if (!userId) {
    return NextResponse.json({ error: "No user_id in event" }, { status: 400 });
  }

  // Fetch user email from Clerk API
  let email: string | null = null;
  try {
    const clerkRes = await fetch(`https://api.clerk.com/v1/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
      },
    });
    if (clerkRes.ok) {
      const userData = await clerkRes.json();
      email =
        userData.email_addresses?.find(
          (e: { id: string; email_address: string }) => e.id === userData.primary_email_address_id
        )?.email_address ||
        userData.email_addresses?.[0]?.email_address ||
        null;
    }
  } catch (err) {
    console.error("Failed to fetch user email from Clerk:", err);
  }

  const { error } = await supabase.from("user_logins").insert({
    user_id: userId,
    email,
    ip_address: null, // Not available in webhook payload
    user_agent: null, // Not available in webhook payload
  });

  if (error) {
    console.error("Failed to log login from webhook:", error);
    return NextResponse.json({ error: "Failed to log login" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
