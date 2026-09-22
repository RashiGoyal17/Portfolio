"use client";

import { useState, type FormEvent } from "react";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    if (!name || !email || !message) {
      setError("Please fill in all fields.");
      return;
    }
    if (!EMAIL_REGEX.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Something went wrong.");
      }
      setStatus("sent");
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-xl border border-accent bg-card p-6 text-sm">
        Thanks for reaching out! Your message has been sent.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="name" className="mb-1.5 block text-sm text-muted">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          maxLength={200}
          className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm outline-none focus:border-accent"
        />
      </div>
      <div>
        <label htmlFor="email" className="mb-1.5 block text-sm text-muted">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          maxLength={200}
          className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm outline-none focus:border-accent"
        />
      </div>
      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm text-muted">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          maxLength={5000}
          rows={6}
          className="w-full rounded-lg border border-border bg-card px-4 py-2.5 text-sm outline-none focus:border-accent"
        />
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <button
        type="submit"
        disabled={status === "sending"}
        className="btn btn-solid rounded-lg px-5 py-2.5 text-sm font-semibold disabled:opacity-60"
      >
        {status === "sending" ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}
