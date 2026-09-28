import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import NotFoundStage from "@/components/NotFound/NotFoundStage";

/**
 * FilmArc Studios — the 404.
 *
 * `app/not-found.tsx` is what Next renders for any URL this app does not own
 * (and for anything that calls `notFound()`), so it is composed exactly like
 * every other page here: the same navigation, one stage, the same footer.
 *
 * The stage itself lives next door in `components/NotFound/NotFoundStage.tsx`:
 * the leader countdown, the running timecode and the entrance all need GSAP, and
 * keeping them in a Client Component leaves this file — the route — a Server
 * Component. No `metadata` is exported on purpose: Next marks the response
 * `noindex` for a 404 on its own, and the root layout already sets the title.
 */
export default function NotFound() {
  return (
    <>
      <Navbar />
      <main className="flex flex-1 flex-col">
        <NotFoundStage />
      </main>
      <Footer />
    </>
  );
}
