import Link from "next/link";
import { getMessages } from "@/lib/kv";
import LogoutButton from "@/components/admin/LogoutButton";

export const revalidate = 0;

export default async function AdminMessagesPage() {
  const messages = await getMessages();

  return (
    <main className="flex-1">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Messages</h1>
            <p className="mt-1 text-sm text-muted">Contact form submissions, newest first.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin" className="text-sm text-accent hover:underline">
              Dashboard
            </Link>
            <LogoutButton />
          </div>
        </div>

        {messages.length === 0 ? (
          <p className="text-sm text-muted">No messages yet.</p>
        ) : (
          <div className="space-y-4">
            {messages.map((m) => (
              <div key={m.id} className="rounded-xl border border-border bg-card p-5">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-sm font-semibold">
                    {m.name} <span className="text-muted font-normal">&lt;{m.email}&gt;</span>
                  </h3>
                  <span className="font-mono text-xs text-muted">
                    {new Date(m.createdAt).toLocaleString()}
                  </span>
                </div>
                <p className="mt-3 whitespace-pre-wrap text-sm text-muted">{m.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
