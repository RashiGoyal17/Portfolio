import type { Metadata } from "next";
import { getContent } from "@/lib/kv";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact — Rashi Goyal",
  description: "Get in touch with Rashi Goyal.",
};

export default async function ContactPage() {
  const content = await getContent();

  return (
    <>
      <Nav />
      <main className="flex-1">
        <section className="mx-auto max-w-2xl px-6 py-24">
          <p className="font-mono text-xs uppercase tracking-widest text-accent">Get in touch</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight md:text-4xl">Contact</h1>
          <p className="mt-4 text-muted">
            Have a role, project, or question in mind? Send a message and I&apos;ll get back to
            you.
          </p>
          <div className="mt-10">
            <ContactForm />
          </div>
        </section>
      </main>
      <Footer content={content} />
    </>
  );
}
