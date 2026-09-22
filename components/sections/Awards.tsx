import type { PortfolioContent } from "@/lib/types";
import SectionHeading from "./SectionHeading";

export default function Awards({ content }: { content: PortfolioContent }) {
  return (
    <section id="awards" className="border-b border-border py-24">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading eyebrow="Recognition" title="Awards & Achievements" />
        <div className="grid gap-6 md:grid-cols-2">
          {content.awards.map((a) => (
            <div key={a.id} className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-baseline justify-between gap-2">
                <h3 className="text-base font-semibold">{a.title}</h3>
                <span className="font-mono text-xs text-muted">{a.year}</span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-muted">{a.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
