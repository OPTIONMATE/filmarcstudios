"use client";

import { Fragment, useRef } from "react";

import CubeText from "@/components/CubeText";
import { gsap } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";

/**
 * FilmArc Studios — About ("Masters Behind the Craft").
 *
 * The studio statement: who makes the work, and how. Three beats in one reading
 * order —
 *
 *   1. Heading    the section's primary visual element, in the hero's exact
 *                 two-tier type style (first letter of every word at full size
 *                 via `heading-initial`, the rest at 75% via `heading-rest` —
 *                 the same utilities HeroSection and ServicesSection use), with
 *                 one lime word. Scaled below hero size, not copied from it.
 *   2. Paragraph  the studio's identity and approach, set as a measured column
 *                 opposite the heading.
 *   3. CTA        "KNOW MORE" — the hero's own button surface and label flip.
 *
 * COMPOSITION
 * -----------
 * Centred is the page's default rhythm (hero, services). About is the one
 * deliberate exception: from `lg` the heading holds the left seven columns and
 * the copy sits opposite in columns 8–12, both
 * starting on the same line — the eyebrow's — so the eye reads label, heading,
 * then the paragraph beneath it and the button under that. Below `lg` it is one
 * left-aligned column. Same palette, same eyebrow format and the same section
 * padding as Services — the identity comes from the asymmetry and the type, not
 * from new furniture: no cards, no borders, no illustration.
 *
 * MOTION
 * ------
 * One `gsap.timeline` on one ScrollTrigger (`top 80%`, `once: true`) — no
 * pinning, nothing hijacked, and the page keeps scrolling underneath it:
 *
 *   eyebrow    rises with the heading's first characters          (0s)
 *   heading    the hero's own character stagger, unchanged        (0.05s)
 *   24px rise, 0.68s each, one character every 0.026s, `power3.out` — exactly
 *   the numbers in components/Home/HeroSection.tsx, so the two headings arrive
 *   the same way even though one runs on load and this one on scroll.
 *   paragraph  one line behind the next, never as a block         (0.5s)
 *   18px rise, 0.7s each, 0.09s apart: a progressive reveal, not a fade.
 *   cta        after the last line has settled                    (1.55s)
 *
 * The opening frame is taken by `gsap.set` in this layout effect, before the
 * browser paints the hydrated tree — this section is always below the fold (the
 * hero owns a full viewport, then services), so no stylesheet pre-state is
 * needed and nothing can flash. Only `transform` and `opacity` are ever
 * animated: no mask, no clip path, no layout property, so no glyph can be
 * clipped and nothing reflows. `prefers-reduced-motion: reduce` returns before
 * anything is hidden — the section is simply already there. Everything lives in
 * one `gsap.context` scoped to the section, so StrictMode's double mount and a
 * real unmount both revert every timeline and every inline style.
 *
 * WHY THE PARAGRAPH'S LINES ARE AUTHORED, NOT MEASURED
 * ----------------------------------------------------
 * `gsap/SplitText` ships with the installed GSAP, but it can only split in the
 * browser: the server would paint one whole paragraph, JavaScript would then
 * replace it with measured line boxes, and those measurements are taken before
 * the webfont's own metrics have necessarily landed — the reflow, flicker and
 * clipped-line risks this section has to avoid. The paragraph below is therefore
 * split *during render*, exactly like the headings: each line is a real line in
 * the server's HTML, grouped the way it should be read at every width, unable to
 * clip and unable to re-group under a resize. Wrapping continues to be the
 * browser's business.
 *
 * WHAT TO EDIT
 * ------------
 * `HEADING_LINES` / `HEADING_LABEL` / `LIME_WORDS` for the heading, `INTRO_LINES`
 * for the copy, `CTA` for the label and destination. Nothing else needs touching.
 */

/**
 * The button. The rendered label is uppercased by the anchor's own `uppercase`
 * class (the hero's and the navbar's CTAs do the same), so the button reads
 * "KNOW MORE" on screen while a screen reader hears two normal words.
 *
 * There is no About route in this project (`app/` holds `/` and nothing else),
 * so the CTA points at the studio's one real destination — the same address the
 * hero's CTA and the navbar's "Get started" use. Change `href` here the day a
 * story page exists; nothing else in the section needs to know.
 */
const CTA = {
  label: "Know more",
  href: "mailto:hello@filmarc.studio",
} as const;

/**
 * Lines for a hero-style two-tier heading. Kept as data so line breaks stay
 * intentional; each line is a list of words rendered word-by-word.
 */
type HeadingLine = readonly string[];

/** The section heading, in the hero's type treatment. */
const HEADING_LINES: readonly HeadingLine[] = [
  ["Masters", "Behind"],
  ["the", "Craft"],
] as const;
const HEADING_LABEL = "Masters Behind the Craft";

/** The one word the lime accent lands on — the section's subject. */
const LIME_WORDS: readonly string[] = ["Craft"];

/** The eyebrow, continuing the numbered rail Services opened with "01". */
const EYEBROW = { index: "02", label: "The studio" } as const;

/**
 * The studio's paragraph, authored as the lines it should be revealed in — one
 * short sentence per line, in the order a visitor should meet them: who the team
 * is, how the work starts, how it is judged, what it is for. The sentences are
 * deliberately short so that each one stays a single line at this measure: the
 * reveal is by line, and a "line" that wraps into three would reveal as a block.
 * Concise on purpose — the heading carries the section, this supports it.
 */
const INTRO_LINES: readonly string[] = [
  "FILMARC is a studio of artists and technicians.",
  "Animators, compositors, designers and filmmakers.",
  "We start with the story, then build the image.",
  "VFX, CGI, animation and production, one team.",
  "Every frame is a decision, every detail deliberate.",
  "What arrives as an idea leaves as cinema.",
] as const;

/**
 * One word in the hero's two-tier style: the first letter at the heading's own
 * size (`heading-initial`), the rest at 75% (`heading-rest`), on one baseline —
 * the exact utilities HeroSection uses.
 *
 * Every character gets its own `inline-block` span because the entrance is
 * staggered per character. The split happens during render, so the server's HTML
 * already holds one span per character and the word is never painted in one form
 * and re-split on the client. The word wrapper is atomic, so a narrow screen can
 * never break a word between two of its characters.
 */
function HeroStyleWord({ word }: { word: string }) {
  return (
    <span className="inline-block">
      {[...word].map((character, characterIndex) => (
        <span
          key={`${word}-${characterIndex}`}
          /* The character stagger's marker (see the effect below). */
          data-about-char
          className={`inline-block ${
            characterIndex === 0 ? "heading-initial" : "heading-rest"
          }`}
        >
          {character}
        </span>
      ))}
    </span>
  );
}

/**
 * The opening frame of each beat. Same values as the hero's own entrance
 * (components/Home/HeroSection.tsx): the heading rises 24px, the supporting copy
 * less, so the type carries the movement and the furniture stays quiet.
 */
const ENTRANCE_FROM = {
  eyebrow: { opacity: 0, y: 12 },
  characters: { opacity: 0, y: 24 },
  lines: { opacity: 0, y: 18 },
  cta: { opacity: 0, y: 14 },
} as const;

/**
 * The beats, in seconds. Punctuation, not delay: the heading is allowed to
 * establish itself (its last character starts at ~0.57s) before the paragraph
 * picks up at 0.5s, overlapping the tail so the two read as one introduction
 * rather than two effects, and the CTA lands only after the last line settles.
 */
const BEAT = { heading: 0.05, lines: 0.5, cta: 1.55 } as const;

/** Seconds between paragraph lines — a reveal, not a flicker. */
const LINE_STAGGER = 0.09;

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const eyebrowRef = useRef<HTMLParagraphElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);
  const ctaRef = useRef<HTMLAnchorElement | null>(null);

  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current;
    const eyebrow = eyebrowRef.current;
    const heading = headingRef.current;
    const cta = ctaRef.current;
    if (!section || !eyebrow || !heading || !cta) return;
    /* Reduced motion: nothing is hidden, nothing moves — the section is simply
       already there, in full, in its final state. */
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    /* The two repeated sets. Characters live inside the heading (one span per
       letter, split at render — see HeroStyleWord), lines inside the <p>; both
       are read from the DOM rather than duplicated as refs. */
    const characters = gsap.utils.toArray<HTMLElement>(
      "[data-about-char]",
      heading,
    );
    const lines = gsap.utils.toArray<HTMLElement>("[data-about-line]", section);

    const ctx = gsap.context(() => {
      /* 1 — the opening frame, taken in this layout effect so it lands before
         the browser paints the hydrated tree. This section is always below the
         fold at first paint, so nothing is ever seen in its finished state and
         then snapped back. */
      gsap.set(eyebrow, ENTRANCE_FROM.eyebrow);
      gsap.set(characters, ENTRANCE_FROM.characters);
      gsap.set(lines, ENTRANCE_FROM.lines);
      gsap.set(cta, ENTRANCE_FROM.cta);

      /* 2 — one timeline, one trigger, three beats. The ScrollTrigger sits on
         the section (not on each element) because the sequence is the point:
         the heading establishes itself, the paragraph answers it line by line,
         the CTA lands last. `once: true` retires the trigger as soon as it has
         played, so scrolling back up never replays it and nothing is left
         subscribed. Nothing here pins, scrubs or hijacks the scroll. */
      const timeline = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: { trigger: section, start: "top 80%", once: true },
      });

      /* The eyebrow rides in with the heading's first characters. */
      timeline.to(eyebrow, { y: 0, opacity: 1, duration: 0.7 }, 0);

      /* The heading: the hero's entrance, character for character and
         millisecond for millisecond (components/Home/HeroSection.tsx). */
      timeline.to(
        characters,
        { y: 0, opacity: 1, duration: 0.68, stagger: 0.026 },
        BEAT.heading,
      );

      /* Then the paragraph, one line behind the next — deliberately a stagger of
         whole lines, never characters: a paragraph has to stay readable while it
         arrives. */
      timeline.to(
        lines,
        { y: 0, opacity: 1, duration: 0.7, stagger: LINE_STAGGER },
        BEAT.lines,
      );

      /* Then the CTA, once the copy has settled. */
      timeline.to(cta, { y: 0, opacity: 1, duration: 0.65 }, BEAT.cta);

      /* 3 — hand both properties back to CSS when the sequence is done: no
         leftover inline transforms, no stray stacking contexts, and the CTA's
         own hover styling is free to use transforms later. */
      timeline.set([eyebrow, ...characters, ...lines, cta], {
        clearProps: "transform,opacity",
      });
    }, section);

    /* Reverting the context kills the timeline, the ScrollTrigger, the ticker
       subscription and every inline style — on a real unmount and on StrictMode's
       double mount alike. */
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      aria-labelledby="about-heading"
      className="relative overflow-clip bg-void py-24 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-10">
        {/* Editorial on desktop, one column below `lg`: the heading holds the
            left seven columns, the copy sits opposite in 8–12, and both start on
            the same line — the eyebrow's — so the reading order is label,
            heading, paragraph, button. */}
        <div className="grid gap-10 sm:gap-12 lg:grid-cols-12 lg:items-start lg:gap-16">
          {/* Beat 1 — eyebrow and heading. */}
          <div className="lg:col-span-7">
            <p
              ref={eyebrowRef}
              className="font-body text-[0.7rem] font-medium uppercase tracking-[0.32em] text-smoke"
            >
              <span className="text-cta">{EYEBROW.index}</span>
              <span aria-hidden className="mx-3 text-hairline">
                /
              </span>
              {EYEBROW.label}
            </p>

            {/* The hero's two-tier treatment, sized for a section rather than a
                full viewport: every word keeps its first letter at the heading's
                own size (`heading-initial`) and drops the rest to 75%
                (`heading-rest`), so the oversized initials carry the section.
                One lime word — its subject. The `sr-only` span is the accessible
                name, because the visible words are split into single characters
                for the stagger; the split is done at render, so the server's HTML
                already holds it. */}
            <h2
              id="about-heading"
              ref={headingRef}
              className="mt-5 font-display text-[clamp(2.5rem,7vw,6.5rem)] uppercase leading-[0.85] tracking-[0.01em] text-bright"
            >
              <span className="sr-only">{HEADING_LABEL}</span>
              <span aria-hidden>
                {HEADING_LINES.map((words, lineIndex) => (
                  <span key={lineIndex} className="block">
                    {words.map((word, wordIndex) => (
                      <Fragment key={`${word}-${wordIndex}`}>
                        {/* A real space in the display font between the words:
                            the line stays readable, and it is the only
                            whitespace in the heading. */}
                        {wordIndex > 0 ? " " : null}
                        <span
                          className={
                            LIME_WORDS.includes(word) ? "text-cta" : undefined
                          }
                        >
                          <HeroStyleWord word={word} />
                        </span>
                      </Fragment>
                    ))}
                  </span>
                ))}
              </span>
            </h2>
          </div>

          {/* Beats 2 and 3 — the copy, then the button. */}
          <div className="lg:col-span-5 lg:col-start-8">
            {/* One <p>, six authored lines, each a block span: continuous text
                to a screen reader, a progressive reveal on screen (see the
                effect above). `max-w-[50ch]` keeps the measure comfortable at
                every width; nothing is masked, so nothing can clip. */}
            <p className="max-w-[50ch] text-pretty font-body text-[clamp(0.95rem,1.5vw,1.15rem)] leading-relaxed text-ash">
              {INTRO_LINES.map((line) => (
                <span key={line} data-about-line className="block">
                  {line}
                </span>
              ))}
            </p>

            {/* The hero's button, unchanged: the page's bright surface, label
                flipping inside its clip on hover and focus (CubeText owns the
                flip, the entrance above owns the anchor). */}
            <a
              ref={ctaRef}
              href={CTA.href}
              className="mt-8 inline-flex items-center justify-center rounded-full bg-cta px-7 py-3.5 font-body text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-cta-ink transition-[filter] duration-300 hover:brightness-[1.07] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cta sm:mt-10 sm:px-9 sm:py-4 sm:text-xs"
            >
              <CubeText label={CTA.label} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
