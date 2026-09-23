"use client";

import { useEffect, useRef, useState } from "react";

import CubeText from "@/components/CubeText";
import { gsap } from "@/lib/gsap";
import { releaseEntrance } from "@/lib/heroEntrance";
import { whenEntranceGateOpens } from "@/lib/introGate";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";

/**
 * FilmArc Studios — the navigation.
 *
 * It floats over the hero reel. The bar itself has no background at all: only
 * the centre group sits in a compact translucent pill, and the three groups are
 * visually independent — wordmark left, links centre, action right.
 *
 *   left    the wordmark, the only unconditional link back to the top
 *   centre  WORK · SERVICES · ABOUT · INSIGHTS · CONTACT, inside one pill
 *   right   GET STARTED, the page's other yellow surface
 *
 * The centre group is absolutely positioned and translated to the middle of the
 * bar rather than flexed between the other two: `justify-between` would drag it
 * off the viewport centre as soon as the wordmark and the action differ in
 * width.
 *
 * The bar fades up once on load, as the opening beat of the hero's introduction;
 * the entrance effect below has the details.
 *
 * RESPONSIVENESS
 * --------------
 * From `xl` (80rem, where the three groups genuinely fit side by side) the pill
 * and the action are shown inline. Below that they are replaced by one menu
 * button and a full-height panel, so the links can never overflow into the
 * wordmark or the CTA. The panel is `fixed`, `data-lenis-prevent` (Lenis leaves
 * gestures inside it alone, so the page does not scroll behind it) and
 * `overflow-y-auto` for a short screen; Escape closes it and returns focus to
 * the button that opened it, and crossing the breakpoint closes it too.
 *
 * LINKS
 * -----
 * In-page anchors. Lenis (`anchors: true`, components/SmoothScroll.tsx) scrolls
 * them with the page's own easing, and logs "Target not found" for any target
 * that does not exist yet — the sections after the hero are still to be built,
 * so those five links are structural placeholders, not broken navigation.
 *
 * This is the only client component on the page: open/close is its only state.
 */

const NAV_LINKS = [
  { href: "#work", label: "Work" },
  { href: "#services", label: "Services" },
  { href: "#about", label: "About" },
  { href: "#insights", label: "Insights" },
  { href: "#contact", label: "Contact" },
] as const;

/** The studio's real contact route today; the hero's CTA uses it as well. */
const START_HREF = "mailto:hello@filmarc.studio";

/** Tailwind's `xl` breakpoint, as a media query. */
const DESKTOP_QUERY = "(min-width: 80rem)";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);
  /** The bar itself — never the <header> wrapper. See the entrance effect. */
  const barRef = useRef<HTMLElement | null>(null);

  /* ENTRANCE — the bar's half of the hero's introduction: a 10px rise and a
     fade on the same easing the copy uses, opening 0.02s ahead of the heading
     (components/Home/HeroSection.tsx). Two components, two effects, one
     coordinated beat: the bar owns its own motion instead of the hero reaching
     across the tree by selector.

     The two of them also share the intro's gate (lib/introGate.ts): the bar and
     the hero both start when the opening sequence's panels begin to part, so the
     homepage arrives in one beat rather than two.

     It animates the <nav> row, never the <header>: the open menu panel is a
     `fixed` child of the header, and a transform on a fixed ancestor becomes
     that element's containing block — which would collapse the panel to the
     height of the bar.

     The bar carries `data-hero-enter`, so the stylesheet — not a JavaScript
     effect — is what holds it at opacity 0 in the server's very first paint; the
     opening frame is in the HTML, so no frame can be painted in the finished
     state and then snapped back. This effect then asserts the same frame with
     `gsap.set()` (synchronously, from a layout effect, before the browser paints
     the hydrated tree), releases the marker so the cascade has nothing left to
     fight the tween for, and plays it. Everything is skipped under
     "prefers-reduced-motion": the pre-state is gated on that same query
     (lib/heroEntrance.ts), so the bar is simply already in place. */
  useIsomorphicLayoutEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    const mm = gsap.matchMedia();
    let disposed = false;

    /* WAITING FOR THE INTRO - the tween below is unchanged; only *when* it is
       allowed to start is new. The intro's panels are the whole view until they
       part (components/Intro/FilmArcIntro.tsx), and the bar belongs to the beat
       that starts there, not to one spent behind the curtain. The gate is open
       from the start on a page with no intro. */
    const startEntrance = () =>
      mm.add("(prefers-reduced-motion: no-preference)", () => {
      /* The opening frame, taken before the next paint — the stylesheet already
         holds it, so this step is invisible; and the marker goes with it. */
      gsap.set(bar, { y: 10, opacity: 0 });
      releaseEntrance([bar]);

      const tween = gsap.to(bar, {
        y: 0,
        opacity: 1,
        duration: 0.7,
        ease: "power3.out",
        delay: 0.08,
        /* Back to CSS once it has settled: no leftover inline transform, no
           stray stacking context, and nothing in the cascade left to hide the
           bar again. */
        clearProps: "transform,opacity",
      });

      return () => {
        tween.kill();
      };
    });

    const stopWaiting = whenEntranceGateOpens(() => {
      if (!disposed) startEntrance();
    });

    return () => {
      disposed = true;
      stopWaiting();
      mm.revert();
    };
  }, []);

  const closeMenu = () => setMenuOpen(false);

  /* Escape closes the panel and hands focus back to the button that opened it. */
  useEffect(() => {
    if (!menuOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setMenuOpen(false);
      menuButtonRef.current?.focus();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  /* Crossing the breakpoint must not leave a stale open panel sitting behind the
     now-visible inline navigation. */
  useEffect(() => {
    const desktop = window.matchMedia(DESKTOP_QUERY);

    const onChange = (event: MediaQueryListEvent) => {
      if (event.matches) setMenuOpen(false);
    };

    desktop.addEventListener("change", onChange);
    return () => desktop.removeEventListener("change", onChange);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <nav
        ref={barRef}
        /* The entrance's marker — see lib/heroEntrance.ts and the effect above. */
        data-hero-enter
        aria-label="Primary"
        /* A bar, not a panel: `relative` + `z-10` so the wordmark, the action and
           the close button stay above the open menu panel below them. */
        className="relative z-10 mx-auto flex h-16 w-full max-w-[112rem] items-center justify-between gap-4 px-4 sm:px-6 lg:h-[4.75rem] lg:px-10"
      >
        {/* Left — the wordmark. The arc is the brand mark: one stroke in the CTA
            yellow, drawn inline so no logo asset is required. */}
        <a
          href="#showreel"
          className="flex shrink-0 items-center gap-2 text-bright focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cta"
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 32 32"
            fill="none"
            className="h-5 w-5 shrink-0 text-cta sm:h-6 sm:w-6"
          >
            <path
              d="M4 28A24 24 0 0 1 28 4"
              stroke="currentColor"
              strokeWidth="5"
              strokeLinecap="round"
            />
          </svg>
          <span className="font-display text-[1.3rem] uppercase leading-none tracking-[0.13em] sm:text-[1.45rem]">
            FilmArc Studios
          </span>
        </a>

        {/* Centre — the one tinted group: a single compact pill with the links
            flush inside it. No per-link backgrounds, no full-width panel. */}
        <ul className="absolute top-1/2 left-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center rounded-full bg-overlay-soft p-1.5 backdrop-blur-md xl:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="block rounded-full px-4 py-2 font-body text-[0.7rem] font-medium uppercase tracking-[0.16em] text-bright/75 transition-colors hover:text-bright focus-visible:text-bright"
              >
                <CubeText label={link.label} />
              </a>
            </li>
          ))}
        </ul>

        {/* Right — the action. There is deliberately no "sign in": the project
            has no auth route yet, and a button that goes nowhere is worse than
            one button fewer. Add it here the moment that route exists. */}
        <div className="hidden items-center xl:flex">
          <a
            href={START_HREF}
            className="rounded-full bg-cta px-5 py-3 font-body text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-cta-ink transition-[filter] duration-300 hover:brightness-[1.07] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cta"
          >
            <CubeText label="Get started" />
          </a>
        </div>

        {/* Below `xl` this takes over from the two inline groups above. */}
        <button
          ref={menuButtonRef}
          type="button"
          aria-expanded={menuOpen}
          aria-controls="primary-menu"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          onClick={() => setMenuOpen((open) => !open)}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-overlay-soft text-bright backdrop-blur-md transition-colors hover:bg-overlay-mid focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cta xl:hidden"
        >
          {/* Two bars that become the close cross. */}
          <span aria-hidden className="relative block h-3 w-4">
            <span
              className={`absolute top-0.5 left-0 h-0.5 w-full rounded-full bg-current transition duration-300 ${
                menuOpen ? "translate-y-[3px] rotate-45" : ""
              }`}
            />
            <span
              className={`absolute bottom-0.5 left-0 h-0.5 w-full rounded-full bg-current transition duration-300 ${
                menuOpen ? "-translate-y-[3px] -rotate-45" : ""
              }`}
            />
          </span>
        </button>
      </nav>

      {menuOpen ? (
        <div
          id="primary-menu"
          data-lenis-prevent
          className="fixed inset-0 overflow-y-auto overscroll-contain bg-void/95 px-6 pt-24 pb-12 backdrop-blur-xl xl:hidden"
        >
          <ul className="flex flex-col">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  onClick={closeMenu}
                  className="block border-b border-hairline py-4 font-display text-[2rem] uppercase tracking-[0.06em] text-bright"
                >
                  <CubeText label={link.label} />
                </a>
              </li>
            ))}
          </ul>

          <a
            href={START_HREF}
            onClick={closeMenu}
            className="mt-8 inline-flex items-center justify-center rounded-full bg-cta px-7 py-4 font-body text-xs font-semibold uppercase tracking-[0.16em] text-cta-ink"
          >
            <CubeText label="Get started" />
          </a>
        </div>
      ) : null}
    </header>
  );
}
