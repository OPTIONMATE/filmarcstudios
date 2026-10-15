import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import AboutHero from "@/components/About/AboutHero";
import AboutApproach from "@/components/About/AboutApproach";
import AboutAiPositioning from "@/components/About/AboutAiPositioning";

import AboutLeadership from "@/components/About/AboutLeadership";

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
        <AboutApproach />
        <AboutAiPositioning />
        <AboutLeadership />
      </main>
      <Footer />
    </>
  );
}
