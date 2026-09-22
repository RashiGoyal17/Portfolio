import type { PortfolioContent } from "@/lib/types";
import CollapsibleSection from "./CollapsibleSection";

export default function About({ content }: { content: PortfolioContent }) {
  return (
    <CollapsibleSection id="about" eyebrow="About" title="Summary">
      <p className="max-w-3xl text-lg leading-relaxed text-muted">{content.summary}</p>
    </CollapsibleSection>
  );
}
