"use client";

import Lenis from "lenis";
import { useEffect, useRef, type ReactNode } from "react";

import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * Filmarc Studios — the smooth-scroll layer.
 *
 * One Lenis instance wraps the whole document, so the pinned hero reads the
 * same interpolated scroll offset as everything else on the page. `layout.tsx` mounts it once, outside the
 * page, so navigating between routes never re-creates it.
 *
 * Lenis is deliberately *not* given its own animation loop: `gsap.ticker` calls
 * `raf()` and every Lenis frame calls `ScrollTrigger.update()`. That is the only
 * way to stop the two engines fighting over the scroll position — and it keeps
 * any scroll-linked animation in step with the smoothed offset (GSAP ticks in
 * seconds, Lenis expects milliseconds).
 *
 * Visitors who have asked for reduced motion get the browser's own scrolling:
 * nothing is smoothed, and no entrance or scroll-linked animation runs (see the
 * `gsap.matchMedia()` block in components/Home/HeroSection.tsx).
 */
export default function SmoothScroll({ children }: { children: ReactNode }) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      /* Driven by the GSAP ticker below instead of its own rAF loop. */
      autoRaf: false,
      /* Seconds of easing: the page keeps coasting after the wheel stops. */
      duration: 1.1,
      /* In-page #anchors (the navbar) scroll with the same easing. */
      anchors: true,
    });
    lenisRef.current = lenis;

    /* ScrollTrigger still owns the scroll position — it just has to be told
       when Lenis has moved the page so its own ticker stays in sync. */
    lenis.on("scroll", ScrollTrigger.update);

    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    /* Without this, GSAP "catches up" after a stall and the scroll jumps. */
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      gsap.ticker.lagSmoothing(500, 33); /* GSAP's own defaults */
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return <>{children}</>;
}

