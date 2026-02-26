import { NextRequest, NextResponse } from "next/server";
import { Webhook } from "svix";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { email1Html } from "@/lib/email-templates";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const resend = new Resend(process.env.RESEND_API_KEY);

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

  // Handle user.created — enroll in email drip sequence
  if (event.type === "user.created") {
    const userData = event.data;
    const userId = userData.id as string;
    const firstName = (userData.first_name as string | null) || null;
    const emailAddresses = userData.email_addresses as Array<{ id: string; email_address: string }>;
    const primaryEmailId = userData.primary_email_address_id as string;
    const email =
      emailAddresses?.find((e) => e.id === primaryEmailId)?.email_address ||
      emailAddresses?.[0]?.email_address ||
      null;

    if (email) {
      // Insert into email_sequences (ignore if already exists)
      const { error: dbError } = await supabase.from("email_sequences").upsert(
        { user_id: userId, email, first_name: firstName, emails_sent: 0, is_pro: false },
        { onConflict: "user_id" }
      );

      if (dbError) {
        console.error("Failed to insert email_sequences record:", dbError);
      } else {
        // Send Email 1 immediately
        const { error: sendError } = await resend.emails.send({
          from: "Justin at SoloFI <justin@solofi.io>",
          to: email,
          subject: "You're in — here's where to start",
          html: email1Html(firstName),
        });

        if (sendError) {
          console.error("Failed to send welcome email:", sendError);
        } else {
          await supabase
            .from("email_sequences")
            .update({ emails_sent: 1 })
            .eq("user_id", userId);
        }
      }
    }

    return NextResponse.json({ success: true });
  }

  // Handle session.created — log user login
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
    ip_address: null,
    user_agent: null,
  });

  if (error) {
    console.error("Failed to log login from webhook:", error);
    return NextResponse.json({ error: "Failed to log login" }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
