import type { PortfolioContent } from "@/lib/types";
import SectionHeading from "./SectionHeading";

export default function Projects({ content }: { content: PortfolioContent }) {
  return (
    <section id="projects" className="border-b border-border py-24">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading eyebrow="Selected Work" title="Projects" />
        <div className="grid gap-6 md:grid-cols-2">
          {content.projects.map((p) => (
            <div
              key={p.id}
              className="group rounded-xl border border-border bg-card p-6 transition-colors hover:border-accent"
            >
              <h3 className="text-lg font-semibold">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{p.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {p.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-border px-2.5 py-1 font-mono text-xs text-accent"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <div className="mt-5 flex gap-4 text-sm">
                <a
                  href={p.liveUrl || "#"}
                  className="text-muted transition-colors group-hover:text-foreground"
                >
                  Live →
                </a>
                <a
                  href={p.githubUrl || "#"}
                  className="text-muted transition-colors group-hover:text-foreground"
                >
                  GitHub →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
