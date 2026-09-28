import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ServicesContent from "@/components/Services/ServicesContent";

export const metadata: Metadata = {
  title: "Services — Filmarc Studios",
  description:
    "Explore FilmArc Studios services: VFX, CGI, 2D Animation, 3D Motion Design, and Screen Production.",
};

export default function ServicesPage() {
  return (
    <>
      <Navbar />
      <main className="flex flex-1 flex-col">
        <ServicesContent />
      </main>
      <Footer />
    </>
  );
}
