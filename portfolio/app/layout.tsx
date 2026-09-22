import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://rashigoyal.dev"),
  title: "Rashi Goyal — Associate AI Engineer",
  description:
    "Portfolio of Rashi Goyal, Associate AI Engineer and IIT Kharagpur graduate specializing in AI/ML systems, agentic AI, and production-grade cloud architectures.",
  keywords: [
    "Rashi Goyal",
    "AI Engineer",
    "Machine Learning",
    "IIT Kharagpur",
    "Portfolio",
    "AWS Bedrock",
    "GenAI",
  ],
  openGraph: {
    title: "Rashi Goyal — Associate AI Engineer",
    description:
      "Associate AI Engineer with a Master's from IIT Kharagpur, building end-to-end AI systems and production-grade software architectures.",
    type: "website",
    images: ["/og-image.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rashi Goyal — Associate AI Engineer",
    description:
      "Associate AI Engineer with a Master's from IIT Kharagpur, building end-to-end AI systems and production-grade software architectures.",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
