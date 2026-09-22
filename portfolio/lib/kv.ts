import { promises as fs } from "fs";
import path from "path";
import type { PortfolioContent, ContactMessage } from "./types";

const CONTENT_KEY = "portfolio:content";
const MESSAGES_KEY = "portfolio:messages";
const LOCAL_CONTENT_PATH = path.join(process.cwd(), "data", "content.json");

/**
 * Whether Vercel KV (Upstash Redis) is configured via env vars.
 * KV_REST_API_URL / KV_REST_API_TOKEN are set automatically when you add the
 * Vercel KV integration to your project (Vercel dashboard -> Storage tab).
 */
function isKvConfigured(): boolean {
  return Boolean(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

// Lazily import @vercel/kv only when configured, so local dev without KV
// env vars never touches the network.
async function getKvClient() {
  const { kv } = await import("@vercel/kv");
  return kv;
}

export async function getContent(): Promise<PortfolioContent> {
  if (isKvConfigured()) {
    try {
      const kv = await getKvClient();
      const stored = await kv.get<PortfolioContent>(CONTENT_KEY);
      if (stored) return stored;
    } catch (err) {
      console.error("KV read failed, falling back to local content.json:", err);
    }
  }
  const raw = await fs.readFile(LOCAL_CONTENT_PATH, "utf-8");
  return JSON.parse(raw) as PortfolioContent;
}

export async function setContent(content: PortfolioContent): Promise<void> {
  if (isKvConfigured()) {
    const kv = await getKvClient();
    await kv.set(CONTENT_KEY, content);
    return;
  }
  // Local dev fallback: persist to the local content.json file directly.
  await fs.writeFile(LOCAL_CONTENT_PATH, JSON.stringify(content, null, 2), "utf-8");
}

const LOCAL_MESSAGES_PATH = path.join(process.cwd(), "data", "messages.json");

async function readLocalMessages(): Promise<ContactMessage[]> {
  try {
    const raw = await fs.readFile(LOCAL_MESSAGES_PATH, "utf-8");
    return JSON.parse(raw) as ContactMessage[];
  } catch {
    return [];
  }
}

export async function getMessages(): Promise<ContactMessage[]> {
  if (isKvConfigured()) {
    try {
      const kv = await getKvClient();
      const items = await kv.lrange<ContactMessage>(MESSAGES_KEY, 0, -1);
      return items ?? [];
    } catch (err) {
      console.error("KV read failed for messages:", err);
      return [];
    }
  }
  const items = await readLocalMessages();
  return items.slice().reverse();
}

export async function addMessage(message: ContactMessage): Promise<void> {
  if (isKvConfigured()) {
    const kv = await getKvClient();
    await kv.lpush(MESSAGES_KEY, message);
    return;
  }
  const items = await readLocalMessages();
  items.push(message);
  await fs.writeFile(LOCAL_MESSAGES_PATH, JSON.stringify(items, null, 2), "utf-8");
}

// --- Minimal rate limiting (per-IP, in-memory fallback + KV counter) ---
const memoryHits = new Map<string, number[]>();

export async function checkRateLimit(ip: string, max = 5, windowMs = 60 * 60 * 1000): Promise<boolean> {
  const now = Date.now();
  if (isKvConfigured()) {
    try {
      const kv = await getKvClient();
      const key = `portfolio:ratelimit:${ip}`;
      const count = await kv.incr(key);
      if (count === 1) {
        await kv.expire(key, Math.ceil(windowMs / 1000));
      }
      return count <= max;
    } catch (err) {
      console.error("KV rate limit check failed, allowing request:", err);
      return true;
    }
  }
  const hits = (memoryHits.get(ip) ?? []).filter((t) => now - t < windowMs);
  hits.push(now);
  memoryHits.set(ip, hits);
  return hits.length <= max;
}
