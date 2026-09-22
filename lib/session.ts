// Uses the Web Crypto API (globalThis.crypto.subtle) instead of Node's
// `crypto` module so this file works in both the Node runtime (API routes)
// and the Edge runtime (middleware.ts).

const COOKIE_NAME = "portfolio_admin_session";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

function getSecret(): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) {
    throw new Error("SESSION_SECRET env var is not set. Add it to .env.local");
  }
  return secret;
}

function toHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function sign(value: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(value));
  return toHex(signature);
}

function toBase64Url(str: string): string {
  const b64 =
    typeof Buffer !== "undefined"
      ? Buffer.from(str, "utf-8").toString("base64")
      : btoa(str);
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(str: string): string {
  const b64 = str.replace(/-/g, "+").replace(/_/g, "/");
  const padded = b64 + "=".repeat((4 - (b64.length % 4)) % 4);
  return typeof Buffer !== "undefined"
    ? Buffer.from(padded, "base64").toString("utf-8")
    : atob(padded);
}

/** Builds a signed cookie value "payload.signature" (HMAC-SHA256, no plaintext password stored). */
export async function createSessionToken(): Promise<string> {
  const payload = `admin:${Date.now()}`;
  const signature = await sign(payload);
  return `${toBase64Url(payload)}.${signature}`;
}

/** Verifies a session token's signature. */
export async function verifySessionToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;
  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature) return false;
  let payload: string;
  try {
    payload = fromBase64Url(encodedPayload);
  } catch {
    return false;
  }
  const expected = await sign(payload);
  if (expected.length !== signature.length || expected !== signature) return false;

  // Optional: expire after MAX_AGE_SECONDS
  const match = payload.match(/^admin:(\d+)$/);
  if (!match) return false;
  const issuedAt = Number(match[1]);
  if (Date.now() - issuedAt > MAX_AGE_SECONDS * 1000) return false;
  return true;
}

export const SESSION_COOKIE_NAME = COOKIE_NAME;
export const SESSION_MAX_AGE = MAX_AGE_SECONDS;
