import HeroSection from "@/components/HeroSection";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex flex-1 flex-col">
        {/* Single pinned section: the expanding rectangle IS the final view. */}
        <HeroSection />
      </main>
    </>
  );
}