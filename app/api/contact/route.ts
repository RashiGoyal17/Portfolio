import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { addMessage, checkRateLimit } from "@/lib/kv";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return req.headers.get("x-real-ip") ?? "unknown";
}

export async function POST(req: Request) {
  const ip = getClientIp(req);
  const allowed = await checkRateLimit(ip, 5, 60 * 60 * 1000);
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  let body: { name?: string; email?: string; message?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const name = (body.name ?? "").trim();
  const email = (body.email ?? "").trim();
  const message = (body.message ?? "").trim();

  if (!name || !email || !message) {
    return NextResponse.json({ error: "All fields are required." }, { status: 400 });
  }
  if (name.length > 200 || email.length > 200 || message.length > 5000) {
    return NextResponse.json({ error: "Field too long." }, { status: 400 });
  }
  if (!EMAIL_REGEX.test(email)) {
    return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
  }

  const contactMessage = {
    id: randomUUID(),
    name,
    email,
    message,
    createdAt: new Date().toISOString(),
  };

  await addMessage(contactMessage);

  // Send an email notification via Resend. Failure here must not fail the
  // request — the message is already saved to KV and the user still sees success.
  const resendApiKey = process.env.RESEND_API_KEY;
  if (resendApiKey) {
    try {
      const { Resend } = await import("resend");
      const resend = new Resend(resendApiKey);
      const toEmail = process.env.CONTACT_TO_EMAIL || "rashiwork17@gmail.com";
      // CONTACT_FROM_EMAIL must be a Resend-verified domain address, or use
      // the Resend sandbox sender "onboarding@resend.dev" for testing.
      const fromEmail = process.env.CONTACT_FROM_EMAIL || "onboarding@resend.dev";
      await resend.emails.send({
        from: fromEmail,
        to: toEmail,
        replyTo: email,
        subject: `New portfolio contact message from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
      });
    } catch (err) {
      console.error("Resend email notification failed:", err);
    }
  } else {
    console.warn("RESEND_API_KEY not set; skipping email notification.");
  }

  return NextResponse.json({ ok: true });
}
