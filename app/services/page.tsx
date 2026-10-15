import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ServicesContent from "@/components/Services/ServicesContent";

export const metadata: Metadata = {
  title: "Services — Filmarc Studios",
  description:
    "Explore Filmarc Studios services: VFX/CGI, AI-assisted VFX, AI filmmaking, on-set supervision, previsualization, rotoscopy and technical QC.",
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
