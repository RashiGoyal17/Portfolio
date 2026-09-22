import { NextResponse } from "next/server";
import { getMessages } from "@/lib/kv";

// Protected by middleware.ts (matches /api/admin/:path*).
export async function GET() {
  const messages = await getMessages();
  return NextResponse.json(messages);
}
