"use client";

import { useState, type ReactNode } from "react";

export default function CollapsibleSection({
  id,
  eyebrow,
  title,
  defaultOpen = true,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <section id={id} className="border-b border-border py-24">
      <div className="mx-auto max-w-6xl px-6">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="mb-10 flex w-full items-center justify-between gap-4 text-left"
        >
          <div>
            <p className="font-mono text-xs uppercase tracking-widest text-accent">{eyebrow}</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">{title}</h2>
          </div>
          <span
            className={`btn btn-outline flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-base transition-transform duration-300 ${
              open ? "rotate-180" : ""
            }`}
            aria-hidden
          >
            ↓
          </span>
        </button>
        <div
          className={`grid transition-all duration-300 ease-out ${
            open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">{children}</div>
        </div>
      </div>
    </section>
  );
}
