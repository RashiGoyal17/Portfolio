import type { PortfolioContent } from "@/lib/types";
import SectionHeading from "./SectionHeading";

export default function Skills({ content }: { content: PortfolioContent }) {
  return (
    <section id="skills" className="border-b border-border py-24">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading eyebrow="Toolbox" title="Skills" />
        <div className="grid gap-6 md:grid-cols-2">
          {content.skills.map((group) => (
            <div key={group.id} className="rounded-xl border border-border bg-card p-6">
              <h3 className="font-mono text-sm uppercase tracking-wide text-accent">
                {group.category}
              </h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <span
                    key={item}
                    className="rounded-md border border-border px-3 py-1.5 text-sm text-foreground"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
