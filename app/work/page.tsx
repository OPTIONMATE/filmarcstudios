import type { Metadata } from "next";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import WorkContent from "@/components/Work/WorkContent";

export const metadata: Metadata = {
  title: "Work — Filmarc Studios",
  description:
    "Selected work from Filmarc Studios: VFX supervision on Mahakali, Adhira and Jai Hanuman, plus ongoing productions.",
};

export default function WorkPage() {
  return (
    <>
      <Navbar />
      <main className="flex flex-1 flex-col">
        <WorkContent />
      </main>
      <Footer />
    </>
  );
}
