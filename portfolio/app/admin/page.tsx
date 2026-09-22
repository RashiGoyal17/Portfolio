import { getContent } from "@/lib/kv";
import AdminEditor from "@/components/admin/AdminEditor";
import LogoutButton from "@/components/admin/LogoutButton";
import Link from "next/link";

export const revalidate = 0;

export default async function AdminPage() {
  const content = await getContent();

  return (
    <main className="flex-1">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="mt-1 text-sm text-muted">Edit your portfolio content below.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/admin/messages" className="text-sm text-accent hover:underline">
              Messages
            </Link>
            <LogoutButton />
          </div>
        </div>
        <AdminEditor initialContent={content} />
      </div>
    </main>
  );
}
