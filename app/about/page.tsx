import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import AboutHero from "@/components/About/AboutHero";
import AboutManifesto from "@/components/About/AboutManifesto";
import AboutDisciplines from "@/components/About/AboutDisciplines";
import AboutProcess from "@/components/About/AboutProcess";

export const metadata: Metadata = {
  title: "About Us — Filmarc Studios",
  description:
    "Learn about FilmArc Studios: our story, manifesto, post-production capabilities, and visual effects artistry.",
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="flex flex-1 flex-col">
        <AboutHero />
        <AboutManifesto />
        <AboutDisciplines />
        <AboutProcess />
      </main>
      <Footer />
    </>
  );
}
