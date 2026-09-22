import { getContent } from "@/lib/kv";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Experience from "@/components/sections/Experience";
import Projects from "@/components/sections/Projects";
import Skills from "@/components/sections/Skills";
import Education from "@/components/sections/Education";
import Awards from "@/components/sections/Awards";

export const revalidate = 0;

export default async function Home() {
  const content = await getContent();

  return (
    <>
      <Nav />
      <main className="flex-1">
        <Hero content={content} />
        <About content={content} />
        <Experience content={content} />
        <Projects content={content} />
        <Skills content={content} />
        <Education content={content} />
        <Awards content={content} />
      </main>
      <Footer content={content} />
    </>
  );
}
