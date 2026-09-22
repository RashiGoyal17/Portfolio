"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }
  return (
    <button
      onClick={logout}
      className="rounded-lg border border-border px-3 py-1.5 text-sm text-muted hover:text-foreground hover:border-accent"
    >
      Log out
    </button>
  );
}
