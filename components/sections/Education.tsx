import type { PortfolioContent } from "@/lib/types";
import SectionHeading from "./SectionHeading";

export default function Education({ content }: { content: PortfolioContent }) {
  return (
    <section id="education" className="border-b border-border py-24">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading eyebrow="Academics" title="Education" />
        <div className="space-y-6">
          {content.education.map((edu) => (
            <div key={edu.id} className="rounded-xl border border-border bg-card p-6">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="text-lg font-semibold">{edu.institution}</h3>
                <span className="font-mono text-xs text-muted">{edu.years}</span>
              </div>
              <p className="mt-1 text-sm text-accent">{edu.degree}</p>
              <p className="mt-2 text-sm text-muted">CGPA: {edu.gpa}</p>
              {edu.highlights && edu.highlights.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {edu.highlights.map((h) => (
                    <span
                      key={h}
                      className="rounded-full border border-border bg-background px-3 py-1 font-mono text-xs text-muted"
                    >
                      {h}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
