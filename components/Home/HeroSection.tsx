"use client";

import { Fragment, useRef } from "react";

import CubeText from "@/components/CubeText";
import ShowreelVideo from "@/components/ShowreelVideo";
import { gsap } from "@/lib/gsap";
import { releaseEntrance } from "@/lib/heroEntrance";
import { whenEntranceGateOpens } from "@/lib/introGate";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";

/**
 * FilmArc Studios — the hero.
 *
 * One full-viewport scene, layered bottom to top (see the `z-*` utilities):
 *
 *   0. `ShowreelVideo`  the reel: absolute, full-bleed, behind everything, and
 *      never animated — it is the scene, not a UI element.
 *   1. `hero-scrim`     one flat dark tint plus a top/bottom falloff (declared
 *      in app/globals.css), so the navbar and the copy keep their contrast
 *      without ever hiding the footage.
 *   2. the copy         headline, description, CTA, centred on the viewport.
 *   3. the navbar       a *sibling* of this section (components/Navbar.tsx),
 *      fixed at `z-50`, floating over the video instead of pushing it down.
 *
 * The video is never framed: no card, no container, no radius, no border. This
 * section is the frame, and it is one viewport tall (`min-h-svh`, so a very
 * short landscape screen grows instead of clipping the copy).
 *
 * ENTRANCE
 * --------
 * One GSAP timeline — the character-staggered headline, then the description,
 * then the CTA — whose opening frame exists *before* the browser has any
 * JavaScript to run. Three steps, in this order:
 *
 *   1. app/globals.css holds every element marked `data-hero-enter` at
 *      `opacity: 0`, under the same conditions that switch the timeline on. The
 *      first paint of the server's HTML is therefore the animation's own opening
 *      frame; without it that paint would show the finished design and the
 *      entrance would visibly snap it back before playing (lib/heroEntrance.ts
 *      owns the contract, and the navbar is in on it too).
 *   2. This effect asserts that same frame with `gsap.set()` — synchronously,
 *      from a *layout* effect, so it lands before the browser paints the
 *      hydrated tree — and then releases the marker. Nothing in the cascade is
 *      left to fight the timeline for these elements' opacity or transform.
 *   3. The timeline animates to the design and ends with `clearProps`, handing
 *      both properties back to CSS with nothing waiting there to hide them.
 *
 * The timeline is built on mount, but it *starts* when the opening sequence lets
 * it (lib/introGate.ts): while the intro's panels are closed they are the whole
 * view, so this entrance belongs to the moment they part rather than to the
 * seconds spent behind them. On a page with no intro the gate is open from the
 * start and the timing is exactly what it always was.
 *
 * The stylesheet's pre-state is gated on `scripting: enabled` and
 * `prefers-reduced-motion: no-preference` — the same query this effect hands to
 * `gsap.matchMedia()`. So:
 *   - reduced-motion visitors get the static hero (never a hero that never
 *     arrives, because the gate cannot disagree with the timeline),
 *   - visitors without JavaScript are never left with a hidden hero,
 *   - cleanup reverts every inline style GSAP wrote (`mm.revert()`), so a route
 *     change or a mid-session OS setting change leaves nothing behind,
 *   - StrictMode's double mount cannot leave a duplicate timeline running, and
 *     because `gsap.set()` re-asserts the opening frame on every run, the second
 *     run starts from exactly the same frame as the first.
 */

/** Two lines, two words each. Kept as data so the markup stays readable and the
 *  line breaks stay intentional at every width. */
const HEADLINE_LINES = [
  ["Imagining", "worlds."],
  ["Crafting", "cinema."],
] as const;

/** What a screen reader hears. The heading is split into single characters for
 *  the stagger, so its accessible name is declared here instead: without it the
 *  words would be announced letter by letter. */
const HEADLINE_LABEL = "Imagining worlds. Crafting cinema.";

/** One sentence under the headline. No second paragraph, no badges. */
const DESCRIPTION =
  "We bring stories to life through cinematic visuals, VFX, and 2D & 3D animation.";

/** The hero's single action, pointing at the studio's real contact route (the
 *  same one the old hero used). Swap it for a `#contact` section when that
 *  section lands. */
const CTA = {
  label: "Let's create together",
  href: "mailto:hello@filmarc.studio",
} as const;

/**
 * The entrance's opening frame: exactly what app/globals.css holds these
 * elements at before JavaScript exists (see lib/heroEntrance.ts), asserted again
 * synchronously in the layout effect so the handoff is exact and the second run
 * of a StrictMode remount starts from the same frame as the first.
 */
const ENTRANCE_FROM = {
  characters: { opacity: 0, y: 24 },
  copy: { opacity: 0, y: 14 },
} as const;

export default function HeroSection() {
  /** The scene. */
  const sectionRef = useRef<HTMLElement | null>(null);
  const headlineRef = useRef<HTMLHeadingElement | null>(null);
  const descriptionRef = useRef<HTMLParagraphElement | null>(null);
  const ctaRef = useRef<HTMLAnchorElement | null>(null);

  useIsomorphicLayoutEffect(() => {
    const headline = headlineRef.current;
    const description = descriptionRef.current;
    const cta = ctaRef.current;
    if (!headline || !description || !cta) return;

    const mm = gsap.matchMedia();
    let disposed = false;

    /* WAITING FOR THE INTRO - the entrance below is unchanged; what is new is
       *when* it is allowed to start. While the opening sequence owns the screen
       (components/Intro/FilmArcIntro.tsx) its panels are the whole view, so
       playing this entrance behind them would spend it where nobody can see it
       and leave the visitor with two introductions instead of one. The intro
       opens the gate the moment its panels begin to part, and this runs then -
       on a page with no intro the gate is already open and it runs now. */
    const startEntrance = () =>
      mm.add("(prefers-reduced-motion: no-preference)", () => {
      /* Document order — which is reading order: line 1 left to right, then
         line 2. A word's oversize initial and its smaller letters ride the same
         tween, so no word is ever split across two animations. */
      const characters = gsap.utils.toArray<HTMLElement>(
        "[data-hero-char]",
        headline,
      );

      /* Every element this timeline animates — the list the marker is released
         from, so the stylesheet's pre-state and GSAP's ownership swap over in
         the same synchronous step, before the browser paints. */
      const targets = [...characters, description, cta];

      /* 1 — take the opening frame, before that paint: the same opacity the
         stylesheet was already holding, plus the rise it deliberately leaves to
         GSAP (globals.css). Nothing flashes: the element the transform lands on
         is still invisible in this frame. */
      gsap.set(characters, ENTRANCE_FROM.characters);
      gsap.set([description, cta], ENTRANCE_FROM.copy);

      /* 2 — hand the stylesheet back its silence: from here the cascade has no
         opacity of its own to offer these elements, so nothing can fight the
         timeline, and nothing can hide them again once it has settled. */
      releaseEntrance(targets);

      const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });

      /* The heading, one character behind the next: 31 characters at 0.026s puts
         the last one on screen at ~1.5s. Transform and opacity only — never a
         mask, never a layout property — so no glyph can be clipped. */
      timeline.to(
        characters,
        { y: 0, opacity: 1, duration: 0.68, stagger: 0.026 },
        0.1,
      );
      /* Then the description, then the CTA, ~0.17s apart: one introduction in
         three beats rather than four separate effects. The navbar
         (components/Navbar.tsx) opens 0.02s ahead of the heading with the same
         easing, which is what makes the bar read as part of the same entrance. */
      timeline.to(description, { y: 0, opacity: 1, duration: 0.7 }, 0.55);
      timeline.to(cta, { y: 0, opacity: 1, duration: 0.65 }, 0.72);
      /* Hand everything back to CSS once the entrance has settled: no leftover
         inline transforms, no stray stacking contexts, and the CTA's own hover
         styling is free to use transforms later. Both properties go back
         together — the marker above is what guarantees CSS has nothing to say
         about them. */
      timeline.set(targets, { clearProps: "transform,opacity" });

      return () => {
        timeline.kill();
      };
    });

    /* Reverting the matchMedia context is what removes the timeline and every
       inline style — including on the reduced-motion branch, where nothing ran. */
    /* The gate, subscribed to in the same layout effect that owns the entrance:
       nothing here polls, and nothing here waits on a timer. */
    const stopWaiting = whenEntranceGateOpens(() => {
      if (!disposed) startEntrance();
    });

    return () => {
      disposed = true;
      stopWaiting();
      mm.revert();
    };
  }, []);

  return (
    <section
      id="showreel"
      ref={sectionRef}
      aria-labelledby="hero-heading"
      /* `isolate` keeps the hero's own layering (scrim under copy) self-contained,
         so the fixed navbar — a sibling at `z-50` on the page — always paints on
         top of the footage. */
      className="relative isolate flex min-h-svh w-full flex-col justify-center overflow-hidden bg-void"
    >
      {/* 1 — the reel: absolute, full-bleed, behind every other layer. */}
      <ShowreelVideo />

      {/* 2 — the scrim: light, not UI, so it must never swallow a click. */}
      <div
        aria-hidden
        className="hero-scrim pointer-events-none absolute inset-0 z-10"
      />

      {/* 3 — the copy. The top padding clears the fixed bar (plus air), so the
             headline can never sit under the navbar, and the CTA carries its own
             spacing so it can never collide with the description. */}
      <div className="relative z-20 mx-auto flex w-full max-w-[90rem] flex-col items-center px-5 pt-20 pb-14 text-center sm:px-6 sm:pt-24 sm:pb-16 lg:pt-28 lg:pb-20">
        {/* Condensed display type (Bebas Neue, via `font-display`), sized with
            `clamp()`: 10.5vw is what makes it dominant on a laptop and still fit
            a 320px phone, where the 2.25rem floor takes over below ~343px.
            `leading-[0.85]` is the tight, stacked look of the comp.

            The type ladder: every word keeps its first letter at the headline's
            own size — `heading-initial` — and takes the rest down to
            `heading-rest` (0.75em, both declared in app/globals.css) on the same
            baseline, so the word still reads as one word with one entry point.
            The word wrapper is `inline-block` and therefore atomic: a narrow
            screen can never break a word between two of its characters. Each
            character gets its own span for the stagger, which is why the
            heading's accessible name lives in `aria-label` — a screen reader
            hears the sentence, not 31 letters.

            That split happens *during render*, so the server's HTML already
            holds one span per character: the heading is never painted in one
            form and then replaced by a client-side splitter once JavaScript
            arrives. The characters are atomic and `data-hero-enter`-marked from
            the very first frame. */}
        <h1
          id="hero-heading"
          ref={headlineRef}
          aria-label={HEADLINE_LABEL}
          className="text-[clamp(2.25rem,10.5vw,10.5rem)] font-display uppercase leading-[0.85] tracking-[0.01em] text-bright"
        >
          {HEADLINE_LINES.map((words) => (
            <span key={words.join(" ")} aria-hidden className="block">
              {words.map((word, wordIndex) => (
                <Fragment key={word}>
                  {/* A real space, in the display font, between the word groups:
                      the line stays centred on its ink, not on a hard-coded gap,
                      and it is the only whitespace in the heading. */}
                  {wordIndex > 0 ? " " : null}
                  <span className="inline-block">
                    {[...word].map((character, characterIndex) => (
                      <span
                        key={`${word}-${characterIndex}`}
                        data-hero-char
                        /* The entrance's marker: the stylesheet holds this
                           character at opacity 0 until the timeline takes it
                           over (lib/heroEntrance.ts). */
                        data-hero-enter
                        className={`inline-block ${
                          characterIndex === 0
                            ? "heading-initial"
                            : "heading-rest"
                        }`}
                      >
                        {character}
                      </span>
                    ))}
                  </span>
                </Fragment>
              ))}
            </span>
          ))}
        </h1>

        <p
          ref={descriptionRef}
          data-hero-enter
          className="mt-5 max-w-[40ch] text-balance font-body text-[clamp(0.9rem,1.4vw,1.15rem)] leading-relaxed text-bright/80 sm:mt-7"
        >
          {DESCRIPTION}
        </p>

        {/* The one bright surface in the hero. The background stays put while
            only the label flips inside its clip; the flip owns the
            label's inner spans, the entrance owns the anchor, so the two
            timelines never touch the same element. */}
        <a
          ref={ctaRef}
          data-hero-enter
          href={CTA.href}
          className="mt-8 inline-flex items-center justify-center rounded-full bg-cta px-7 py-3.5 font-body text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-cta-ink transition-[filter] duration-300 hover:brightness-[1.07] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cta sm:mt-10 sm:px-9 sm:py-4 sm:text-xs"
        >
          <CubeText label={CTA.label} />
        </a>
      </div>
    </section>
  );
}
