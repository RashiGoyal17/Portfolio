import type { PortfolioContent } from "@/lib/types";
import CollapsibleSection from "./CollapsibleSection";

export default function Experience({ content }: { content: PortfolioContent }) {
  return (
    <CollapsibleSection id="experience" eyebrow="Career" title="Experience">
      <div className="relative border-l border-border pl-8">
        {content.experience.map((exp) => (
          <div key={exp.id} className="relative mb-12 last:mb-0">
            <span className="absolute -left-[2.35rem] top-1.5 h-3 w-3 rounded-full border-2 border-accent bg-background" />
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="text-lg font-semibold">{exp.role}</h3>
              <span className="font-mono text-xs text-muted">
                {exp.start} — {exp.end}
              </span>
            </div>
            <p className="mt-1 text-sm text-accent">
              {exp.company} · {exp.location}
            </p>
            <ul className="mt-4 space-y-2">
              {exp.bullets.map((b, i) => (
                <li key={i} className="flex gap-3 text-sm leading-relaxed text-muted">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" />
                  {b}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </CollapsibleSection>
  );
}
