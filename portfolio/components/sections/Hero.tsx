import Link from "next/link";
import type { PortfolioContent } from "@/lib/types";

export default function Hero({ content }: { content: PortfolioContent }) {
  return (
    <section className="relative overflow-hidden border-b border-border">
      <div className="mesh-gradient absolute inset-0" />
      <div className="bg-grid absolute inset-0" />
      <div className="relative mx-auto max-w-6xl px-6 py-28 md:py-36">
        <p className="animate-fade-up mb-4 inline-block rounded-full border border-border bg-card px-3 py-1 font-mono text-xs text-accent">
          {content.location}
        </p>
        <h1 className="animate-fade-up max-w-3xl text-4xl font-bold leading-tight tracking-tight md:text-6xl">
          {content.name}
        </h1>
        <p className="animate-fade-up mt-4 max-w-2xl text-xl text-muted md:text-2xl">
          {content.title}
        </p>
        <p className="animate-fade-up mt-6 max-w-2xl text-base text-muted">
          {content.tagline}
        </p>
        <div className="animate-fade-up mt-10 flex flex-wrap gap-4">
          <a
            href="/resume.pdf"
            className="rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-background transition-transform hover:scale-[1.03]"
          >
            View Resume
          </a>
          <Link
            href="/contact"
            className="rounded-lg border border-border px-5 py-3 text-sm font-semibold hover:border-accent transition-colors"
          >
            Contact
          </Link>
          <a
            href={content.social.github}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-border px-5 py-3 text-sm font-semibold hover:border-accent transition-colors"
          >
            GitHub
          </a>
          <a
            href={content.social.linkedin}
            target="_blank"
            rel="noreferrer"
            className="rounded-lg border border-border px-5 py-3 text-sm font-semibold hover:border-accent transition-colors"
          >
            LinkedIn
          </a>
        </div>
      </div>
    </section>
  );
}
