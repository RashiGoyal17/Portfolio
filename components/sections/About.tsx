import type { PortfolioContent } from "@/lib/types";
import SectionHeading from "./SectionHeading";

export default function About({ content }: { content: PortfolioContent }) {
  return (
    <section id="about" className="border-b border-border py-24">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading eyebrow="About" title="Summary" />
        <p className="max-w-3xl text-lg leading-relaxed text-muted">{content.summary}</p>
      </div>
    </section>
  );
}
