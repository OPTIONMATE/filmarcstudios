import Footer from "@/components/Footer";
import FilmArcIntro from "@/components/Intro/FilmArcIntro";
import HeroSection from "@/components/Home/HeroSection";
import ProjectsSection from "@/components/Home/ProjectsSection";
import Navbar from "@/components/Navbar";
import AboutLeadership from "@/components/About/AboutLeadership";
import CoreCapabilitiesSection from "@/components/Home/CoreCapabilitiesSection";

export default function Home() {
  return (
    <>
      <FilmArcIntro />
      <Navbar />
      <main className="">
        <HeroSection />
        <ProjectsSection />
        <CoreCapabilitiesSection />
        <AboutLeadership />
      </main>

      <Footer />
    </>
  );
}
