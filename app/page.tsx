import FilmArcIntro from "@/components/Intro/FilmArcIntro";
import HeroSection from "@/components/Home/HeroSection";
import ServicesSection from "@/components/Home/ServicesSection";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <>
      {/* The opening sequence: a fixed overlay above the page, and - through
          lib/introGate.ts - the reason the hero's and the navbar's entrances
          hold back. It must stay *first* in this tree: the components below
          subscribe to its gate as they mount, and React runs effects in tree
          order, so the intro has to have closed the gate before they ask. */}
      <FilmArcIntro />
      <Navbar />
      <main className="flex flex-1 flex-col">
        {/* The hero is the whole scene: the fixed navbar floats over it, and the
          page continues into the services timeline. */}
        <HeroSection />
        <ServicesSection />
      </main>
    </>
  );
}