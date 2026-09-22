import { NextResponse } from "next/server";
import { getContent, setContent } from "@/lib/kv";
import type { PortfolioContent } from "@/lib/types";

// Protected by middleware.ts (matches /api/admin/:path*).

export async function GET() {
  const content = await getContent();
  return NextResponse.json(content);
}

function isValidContent(body: unknown): body is PortfolioContent {
  if (!body || typeof body !== "object") return false;
  const b = body as Record<string, unknown>;
  return (
    typeof b.name === "string" &&
    typeof b.summary === "string" &&
    Array.isArray(b.experience) &&
    Array.isArray(b.projects) &&
    Array.isArray(b.awards) &&
    Array.isArray(b.education) &&
    Array.isArray(b.skills) &&
    typeof b.social === "object"
  );
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  if (!isValidContent(body)) {
    return NextResponse.json({ error: "Content failed validation." }, { status: 400 });
  }

  // Basic length guards to avoid runaway payloads.
  if (body.summary.length > 5000 || body.name.length > 200) {
    return NextResponse.json({ error: "Field too long." }, { status: 400 });
  }

  await setContent(body);
  return NextResponse.json({ ok: true });
}
