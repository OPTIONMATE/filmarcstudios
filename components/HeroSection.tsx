"use client";

import { useRef } from "react";

import ShowreelVideo from "@/components/ShowreelVideo";
import { gsap } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";

/**
 * Filmarc Studios — the pinned hero.
 *
 * LAYOUT (single section, three layers, bottom to top):
 *
 *   0. Background layer — `ShowreelVideo`, full-bleed and unmoving.
 *   1. Typography layer — the headline. Static: no tween ever touches it.
 *   2. Canvas layer     — the black rectangle. Centred at `scale(0)` on load;
 *      at full growth it is exactly 100vw x 100vh and carries the page's final
 *      content. It is the destination layout — nothing scrolls up after it.
 *
 * THE SEQUENCE (one scrubbed timeline, `pin: true`, `scrub: 1`):
 *
 *   - 0.0 -> 1.0 : rectangle scales 0 -> 1, linearly (`ease: "none"`).
 *   - 0.8 -> 1.0 : inner content fades `opacity: 0 -> 1` and rises `y: 40->0`.
 *     Invisible for the first 80% of growth, settled as the box locks.
 *
 * ACCESSIBILITY
 * -------------
 * Under `prefers-reduced-motion: reduce` the `gsap.matchMedia()` block is
 * skipped: no pin, no tween — the canvas stays at `scale(0)` / `opacity: 0`
 * (its resting markup state) so the reel is never covered.
 */

/** Scroll distance the stage stays pinned, as a percentage of the viewport. */
const PIN_DISTANCE = "+=150%";

/** The reel's headline. Display type, so it is kept to a single wordmark. */
const HEADLINE = "Filmarc";

const KICKER = "VFX · CGI · Cinematic post-production";

export default function HeroSection() {
  /** The stage: the element that gets pinned and that ScrollTrigger measures. */
  const stageRef = useRef<HTMLElement | null>(null);
  /** The black rectangle canvas that grows to cover the stage. */
  const wipeRef = useRef<HTMLDivElement | null>(null);
  /** Inner content nested in the rectangle. Fades in past 80% growth. */
  const contentRef = useRef<HTMLDivElement | null>(null);


  /* Layout effect, not effect: the timeline (and therefore the reserved pin
     spacing) is built before the browser paints, so the hero can never be
     painted in its unpinned state and then jump. `useIsomorphicLayoutEffect`
     swaps in `useEffect` during server rendering, where neither one runs. */
  useIsomorphicLayoutEffect(() => {
    const stage = stageRef.current;
    const wipe = wipeRef.current;
    const content = contentRef.current;
    if (!stage || !wipe || !content) return;

    /* matchMedia keeps the reduced-motion variant declarative, and reverting it
       removes the ScrollTrigger, the pin-spacer and every inline style GSAP
       wrote — so a route change, or an OS setting change mid-session, leaves no
       orphaned ScrollTrigger behind (the memory leak this pattern exists to
       prevent). */
    const mm = gsap.matchMedia();

    mm.add("(prefers-reduced-motion: no-preference)", () => {
      /* Resting states, set from JS so a mid-session revert back to this
         branch restarts from the same frame. The matching arbitrary classes in
         the markup cover the pre-hydration paint. */
      gsap.set(wipe, { scale: 0 });
      gsap.set(content, { opacity: 0, y: 40 });

      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: stage,
          start: "top top",
          end: PIN_DISTANCE,
          pin: true,
          /* Explicit: ScrollTrigger disables pin-spacing by default when the
             trigger's parent is display:flex (our <main> is). Without this the
             spacer reserves zero scroll and the pin releases immediately. */
          pinSpacing: true,
          scrub: 1,
          /* Pin the moment the scroll direction changes, so a fast flick past
             the start does not tear the stage off the top of the screen. */
          anticipatePin: 1,
          /* Re-measure the pin range whenever ScrollTrigger refreshes (resize,
             mobile URL bar, late-loading fonts). */
          invalidateOnRefresh: true,
        },
      });

      /* The box: small -> full viewport, linearly, across the whole range. It is
         already sized to the stage in the markup, so scale 1 = 100vw x 100vh.
         Duration 1 at position 0 — it owns the entire timeline. */
      timeline.fromTo(wipe, { scale: 0 }, { scale: 1, duration: 1 }, 0);

      /* Inner content: invisible for the first 80% of growth, then fades in
         and rises slightly, completing exactly as the box locks full-frame. */
      timeline.fromTo(
        content,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.2, ease: "power2.out" },
        0.8,
      );

      /* Explicit teardown on top of the matchMedia revert: killing the
         ScrollTrigger first un-pins the stage and restores its own styles. */
      return () => {
        timeline.scrollTrigger?.kill();
        timeline.kill();
      };
    });

    return () => mm.revert();
  }, []);


  return (
    <section
      id="showreel"
      ref={stageRef}
      aria-labelledby="hero-heading"
      /* `z-0` is load-bearing: it makes the stage a stacking context, so the
         full-frame rectangle (z-30) covers the hero layers beneath it while
         the fixed navbar (z-50) stays legible above. */
      className="relative z-0 h-screen w-full overflow-hidden bg-void"
    >
      {/* 1 — Background layer. Full-bleed from the first frame and never
             animated: while the stage is pinned this layer cannot move. */}
      <div className="absolute inset-0">
        <ShowreelVideo />
      </div>

            {/* 2 — Typography layer. Deliberately untouched by the timeline. */}
      <div className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center">
        <h1
          id="hero-heading"
          className="font-display text-[clamp(4rem,18vw,16rem)] uppercase leading-[0.82] tracking-[0.02em] text-chalk"
        >
          {HEADLINE}
        </h1>
        <p className="mt-2 font-body text-[0.6rem] uppercase tracking-[0.45em] text-ash sm:mt-4 sm:text-xs">
          {KICKER}
        </p>
      </div>

      {/* 3 — Canvas layer. The rectangle is centred on the stage and sized to
             it, so it grows from a point in the middle outwards and lands as
             the final full-bleed view. Nothing renders below this section. */}
      <div className="absolute inset-0 z-30 flex items-center justify-center">
        <div
          ref={wipeRef}
          /* `[transform:scale(0)]`, not `scale-0`: Tailwind's `scale-*`
             utilities write the standalone `scale` property, which multiplies
             with the `transform` property GSAP animates — so the block would
             stay 0% no matter what the timeline did. The class is the
             pre-hydration resting state: invisible until (and unless) the
             timeline says otherwise. */
          className="flex h-full w-full origin-center items-center justify-center overflow-hidden bg-void will-change-transform [transform:scale(0)]"
        >
          {/* Final destination content: hidden until the box reaches 80% of
              full-screen growth, then fades in on the box itself. The
              arbitrary `translateY` + `opacity-0` mirror the `gsap.set`
              resting state for the pre-hydration paint; GSAP's inline styles
              take over from there. */}
          <div
            ref={contentRef}
            className="flex w-full max-w-3xl flex-col items-center px-6 text-center opacity-0 will-change-transform [transform:translateY(40px)]"
          >
            <p className="font-body text-[0.65rem] uppercase tracking-[0.45em] text-smoke sm:text-xs">
              Filmarc Studios — Showreel 2026
            </p>
            <h2 className="mt-4 font-display text-[clamp(2.75rem,9vw,7.5rem)] uppercase leading-[0.88] tracking-[0.01em] text-chalk">
              Every frame is a world
            </h2>
            <p className="mt-6 max-w-[52ch] font-body text-base leading-relaxed text-ash sm:text-lg">
              Compositing, CG environments and finishing for features, episodic
              and commercial work — graded, delivered and archived by the same
              team that shot the plates.
            </p>
            <a
              href="mailto:hello@filmarc.studio"
              className="mt-10 inline-flex items-center gap-3 rounded-full border border-hairline px-8 py-3 font-body text-xs uppercase tracking-[0.3em] text-chalk transition-colors hover:border-chalk/60 hover:text-white"
            >
              Start a project
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}


