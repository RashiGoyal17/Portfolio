import type { PortfolioContent } from "@/lib/types";

export default function Footer({ content }: { content: PortfolioContent }) {
  return (
    <footer className="mt-auto border-t border-border py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-6 text-center text-sm text-muted md:flex-row md:justify-between md:text-left">
        <p>
          © {new Date().getFullYear()} {content.name}. Built with Next.js.
        </p>
        <div className="flex gap-4">
          <a href={`mailto:${content.social.email}`} className="hover:text-foreground">
            {content.social.email}
          </a>
          <a href={content.social.linkedin} className="hover:text-foreground">
            LinkedIn
          </a>
          <a href={content.social.github} className="hover:text-foreground">
            GitHub
          </a>
          {content.social.leetcode && (
            <a href={content.social.leetcode} className="hover:text-foreground">
              LeetCode
            </a>
          )}
          {content.social.atcoder && (
            <a href={content.social.atcoder} className="hover:text-foreground">
              AtCoder
            </a>
          )}
        </div>
      </div>
    </footer>
  );
}
