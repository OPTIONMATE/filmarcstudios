"use client";

import { Fragment, useRef } from "react";

import ShowreelVideo from "@/components/ShowreelVideo";
import { gsap } from "@/lib/gsap";
import { releaseEntrance } from "@/lib/heroEntrance";
import { whenEntranceGateOpens } from "@/lib/introGate";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";

/** The eyebrow above the headline — Inter, a fraction of display scale. */
const EYEBROW_WORDS = ["THE", "FUTURE", "OF"] as const;

/** The headline itself: one display word per line, set in Anton. */
const HEADLINE_LINES = ["Hybrid", "Filmmaking"] as const;

/** What a screen reader hears. The heading is split into single characters for
 *  the stagger, so its accessible name is declared here instead. */
const HEADLINE_LABEL = "The future of hybrid filmmaking";

const ENTRANCE_FROM = {
  characters: { opacity: 0, y: 24 },
} as const;

export default function HeroSection() {
  /** The scene. */
  const sectionRef = useRef<HTMLElement | null>(null);
  const headlineRef = useRef<HTMLHeadingElement | null>(null);

  useIsomorphicLayoutEffect(() => {
    const headline = headlineRef.current;
    if (!headline) return;

    const mm = gsap.matchMedia();
    let disposed = false;

    const startEntrance = () =>
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const characters = gsap.utils.toArray<HTMLElement>(
          "[data-hero-char]",
          headline,
        );

        const targets = characters;

        gsap.set(characters, ENTRANCE_FROM.characters);

        releaseEntrance(targets);

        const timeline = gsap.timeline({ defaults: { ease: "power3.out" } });

        timeline.to(
          characters,
          { y: 0, opacity: 1, duration: 0.68, stagger: 0.026 },
          0.1,
        );

        timeline.set(targets, { clearProps: "transform,opacity" });

        return () => {
          timeline.kill();
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

  return (
    <section
      id="showreel"
      ref={sectionRef}
      aria-labelledby="hero-heading"
      /* `isolate` keeps the hero's own layering (scrim under copy) self-contained,
         so the fixed navbar — a sibling at `z-50` on the page — always paints on
         top of the footage. */
      className="relative isolate flex min-h-svh w-full flex-col justify-end overflow-hidden bg-void"
    >
      {/* 1 — the reel: absolute, full-bleed, behind every other layer. */}
      <ShowreelVideo />

      {/* 2 — the scrim: light, not UI, so it must never swallow a click. */}
      <div
        aria-hidden
        className="hero-scrim pointer-events-none absolute inset-0 z-10"
      />

      {/* 3 — the copy: the heading alone, flush to the right edge of the
             frame. The container mirrors the navbar's measure (max-w-[112rem],
             the same responsive padding), and `justify-end` on the section
             pins the block to the bottom. */}
      <div className="relative z-20 mx-auto w-full max-w-[112rem] px-4 pt-24 pb-10 text-right sm:px-6 sm:pb-12 lg:px-10 lg:pb-14">
        <h1
          id="hero-heading"
          ref={headlineRef}
          aria-label={HEADLINE_LABEL}
          className="text-right"
        >
          {/* The eyebrow — Manrope bold, right-aligned, carrying the same
              per-character spans the entrance animates. A real space between
              the word groups is the only whitespace inside it. */}
          <span
            aria-hidden
            className="block font-hero-eyebrow text-[clamp(0.85rem,1.5vw,1.25rem)] font-bold leading-none tracking-tight text-hero-eyebrow"
          >
            {EYEBROW_WORDS.map((word, wordIndex) => (
              <Fragment key={word}>
                {wordIndex > 0 ? " " : null}
                <span className="inline-block">
                  {[...word].map((character, characterIndex) => (
                    <span
                      key={`${word}-${characterIndex}`}
                      data-hero-char
                      data-hero-enter
                      className="inline-block"
                    >
                      {character}
                    </span>
                  ))}
                </span>
              </Fragment>
            ))}
          </span>

          {/* The two display lines — Bowlby One SC at its single weight (400;
              nothing is synthesised). It is a wide face, unlike the condensed
              Anton it replaces, so the clamp ladder runs smaller to keep
              FILMMAKING inside the frame at every width. Space above the first
              line only, so the gap is between the eyebrow and the headline,
              never inside it. */}
          {HEADLINE_LINES.map((word, lineIndex) => (
            <span
              key={word}
              aria-hidden
              className={`block font-hero-display text-[clamp(2.5rem,11vw,9.5rem)] uppercase leading-[0.9] tracking-[0.01em] text-cta ${
                lineIndex === 0 ? "mt-3 sm:mt-4" : ""
              }`}
            >
              {[...word].map((character, characterIndex) => (
                <span
                  key={`${word}-${characterIndex}`}
                  data-hero-char
                  data-hero-enter
                  className="inline-block"
                >
                  {character}
                </span>
              ))}
            </span>
          ))}
        </h1>
      </div>
    </section>
  );
}
