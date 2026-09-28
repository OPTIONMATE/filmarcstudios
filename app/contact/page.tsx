import type { Metadata } from "next";

import ContactEnquiry from "@/components/Contact/ContactEnquiry";
import ContactHero from "@/components/Contact/ContactHero";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

/**
 * FilmArc Studios — the contact page.
 *
 * Just a heading and the enquiry form, with the usual navigation and footer.
 */
export const metadata: Metadata = {
  title: "Contact — Filmarc Studios",
  description:
    "Start a project with FilmArc Studios. Send a brief for VFX, CGI, 2D animation, 3D motion design or screen production.",
};

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="flex flex-1 flex-col">
        <ContactHero />
        <ContactEnquiry />
      </main>
      <Footer />
    </>
  );
}
