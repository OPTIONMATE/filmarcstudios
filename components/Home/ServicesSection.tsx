"use client";

import { Fragment, useRef } from "react";

import CubeText from "@/components/CubeText";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";
import { services } from "@/components/Home/services";

/**
 * FilmArc Studios — Services.
 *
 * One cohesive composition in three beats:
 *
 *   1. Heading  condensed display statement, smaller than the hero, but in
 *      the hero's exact two-tier type style (first letter of every word at
 *      full size via `heading-initial`, the rest at 75% via `heading-rest`
 *      — the same utilities HeroSection uses).
 *   2. Carousel a full-bleed infinite marquee of compact cards built from
 *      the service names in `services.ts` (the sole source of truth — names
 *      only, repeated in the track purely to fill the loop). One GSAP tween
 *      owns the motion; hover only retargets its `timeScale`, never rebuilds.
 *   3. CTA      a typography-led closer in the same two-tier hero style.
 *
 * Motion details:
 * - The track holds two identical halves; the tween runs `xPercent: 0 → -50`
 *   with `repeat: -1`, so the seam never shows regardless of item count.
 * - Duration is derived from the measured half-width (`px / pxPerSecond`) so
 *   the on-screen velocity stays cinematic at any width or item count.
 * - Hover / keyboard focus eases `timeScale` 1 → 0.12 (and back), never a
 *   hard pause. Touch devices simply keep the default speed.
 * - `prefers-reduced-motion` renders everything static: no tween, no reveals.
 * - Everything lives in one `gsap.context` scoped to the section, so
 *   StrictMode remounts and unmounts clean up fully.
 */

const CTA = {
  label: "Pitch your story",
  href: "mailto:hello@filmarc.studio",
} as const;

/**
 * Lines for a hero-style two-tier heading. Kept as data so line breaks stay
 * intentional; each line is a list of words rendered word-by-word.
 */
type HeadingLine = readonly string[];

/** Section statement — hero type style, deliberately below hero scale. */
const HEADING_LINES: readonly HeadingLine[] = [
  ["Crafted", "frames,"],
  ["Built", "worlds"],
] as const;
const HEADING_LABEL = "Crafted frames, Built worlds";

/** CTA closer — same two-tier style. */
const CTA_LINES: readonly HeadingLine[] = [
  ["Something", "else"],
  ["In", "mind?"],
] as const;
const CTA_LABEL = "Something else in mind?";

/**
 * One word in the hero's two-tier style: the first letter at the heading's
 * own size (`heading-initial`), the rest at 75% (`heading-rest`), on one
 * baseline — the exact utilities HeroSection uses.
 */
function HeroStyleWord({ word }: { word: string }) {
  const [first, ...rest] = [...word];
  return (
    <span className="inline-block">
      <span className="heading-initial inline-block">{first}</span>
      {rest.length > 0 ? (
        <span className="heading-rest inline-block">{rest.join("")}</span>
      ) : null}
    </span>
  );
}

/**
 * A heading rendered the way HeroSection renders its headline: an accessible
 * label for screen readers plus aria-hidden lines of atomic hero-style words
 * (a narrow screen can wrap lines, but never split a word).
 */
function HeroStyleHeading({
  lines,
  label,
  limeWords = [],
}: {
  lines: readonly HeadingLine[];
  label: string;
  limeWords?: readonly string[];
}) {
  return (
    <>
      <span className="sr-only">{label}</span>
      <span aria-hidden>
        {lines.map((words, lineIndex) => (
          <span key={lineIndex} className="block">
            {words.map((word, wordIndex) => (
              <Fragment key={`${word}-${wordIndex}`}>
                {wordIndex > 0 ? " " : null}
                <span
                  className={limeWords.includes(word) ? "text-cta" : undefined}
                >
                  <HeroStyleWord word={word} />
                </span>
              </Fragment>
            ))}
          </span>
        ))}
      </span>
    </>
  );
}

/** Copies per half — enough that one half always overflows the viewport. */
const COPIES_PER_HALF = 3;

/** Target on-screen velocity of the marquee. */
const PX_PER_SECOND = 140;

/** Hover resting speed, as a fraction of the default. */
const HOVER_TIMESCALE = 0.12;

export default function ServicesSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);

  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current;
    const track = trackRef.current;
    const viewport = viewportRef.current;
    if (!section || !track || !viewport) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      /* Entrance — heading, carousel and CTA rise once on scroll in. */
      const reveals = gsap.utils.toArray<HTMLElement>(
        "[data-services-reveal]",
        section,
      );
      gsap.set(reveals, { opacity: 0, y: 28 });
      reveals.forEach((el) => {
        gsap.to(el, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%", once: true },
        });
      });

      /* Marquee — one infinite tween, rebuilt only on resize / font load. */
      let marquee: gsap.core.Tween | null = null;
      let hoverTarget = 1;

      const buildMarquee = () => {
        marquee?.kill();
        gsap.set(track, { xPercent: 0 });
        const halfWidth = track.scrollWidth / 2;
        if (halfWidth <= 0) return;
        marquee = gsap.to(track, {
          xPercent: -50,
          ease: "none",
          duration: Math.max(12, halfWidth / PX_PER_SECOND),
          repeat: -1,
        });
        marquee.timeScale(hoverTarget);
      };

      buildMarquee();

      /* Hover slowdown — retarget the existing tween's velocity only. */
      const canHover = window.matchMedia("(hover: hover)").matches;
      const easeTo = (value: number, duration: number) => {
        hoverTarget = value;
        if (marquee) {
          gsap.to(marquee, {
            timeScale: value,
            duration,
            ease: "power2.out",
            overwrite: true,
          });
        }
      };
      const slow = () => easeTo(HOVER_TIMESCALE, 0.6);
      const restore = () => easeTo(1, 0.9);

      if (canHover) {
        viewport.addEventListener("mouseenter", slow);
        viewport.addEventListener("mouseleave", restore);
        viewport.addEventListener("focusin", slow);
        viewport.addEventListener("focusout", restore);
      }

      /* Keep velocity consistent once fonts resolve and on resize. */
      let resizeTimer: number | null = null;
      const onResize = () => {
        if (resizeTimer !== null) window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(buildMarquee, 200);
      };
      window.addEventListener("resize", onResize);

      let fontsCancelled = false;
      if (typeof document !== "undefined" && "fonts" in document) {
        document.fonts.ready
          .then(() => {
            if (!fontsCancelled) {
              buildMarquee();
              ScrollTrigger.refresh();
            }
          })
          .catch(() => {});
      }

      return () => {
        fontsCancelled = true;
        if (resizeTimer !== null) window.clearTimeout(resizeTimer);
        window.removeEventListener("resize", onResize);
        if (canHover) {
          viewport.removeEventListener("mouseenter", slow);
          viewport.removeEventListener("mouseleave", restore);
          viewport.removeEventListener("focusin", slow);
          viewport.removeEventListener("focusout", restore);
        }
        marquee?.kill();
        marquee = null;
      };
    }, section);

    return () => ctx.revert();
  }, []);

  /* One half of the loop: every service name, repeated to fill the viewport. */
  const half = Array.from({ length: COPIES_PER_HALF }, () => services).flat();

  const renderHalf = (hidden: boolean) => (
    <div
      aria-hidden={hidden || undefined}
      className="flex shrink-0 items-stretch gap-4 pr-4 sm:gap-5 sm:pr-5"
    >
      {half.map((service, index) => (
        <span
          key={`${service.id}-${index}`}
          className="relative flex min-h-44 w-56 shrink-0 flex-col items-center justify-center border border-hairline bg-ink/60 px-5 pb-6 pt-12 text-center sm:min-h-48 sm:w-64 sm:px-6"
        >
          {/* Index + lime marker — pinned to the card's top-right corner. */}
          <span className="absolute right-4 top-4 flex items-center gap-2 sm:right-5 sm:top-5">
            <span className="font-body text-[0.65rem] font-medium uppercase tracking-[0.28em] text-smoke">
              {String((index % services.length) + 1).padStart(2, "0")}
            </span>
            <span aria-hidden className="inline-block h-1.5 w-1.5 rotate-45 bg-cta" />
          </span>
          <span className="whitespace-normal text-center font-display text-[1.65rem] uppercase leading-[0.9] tracking-[0.01em] text-bright sm:text-[2rem]">
            {service.name}
          </span>
        </span>
      ))}
    </div>
  );

  return (
    <section
      ref={sectionRef}
      id="services"
      aria-labelledby="services-heading"
      className="relative overflow-clip bg-void py-24 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-10">
        {/* Eyebrow + heading — display type, deliberately below hero scale. */}
        <div data-services-reveal className="text-center">
          <p className="font-body text-[0.7rem] font-medium uppercase tracking-[0.32em] text-smoke">
            <span className="text-cta">01</span>
            <span aria-hidden className="mx-3 text-hairline">
              /
            </span>
            What we do
          </p>
          <h2
            id="services-heading"
            className="mt-5 font-display text-[clamp(2.75rem,6vw,5.5rem)] uppercase leading-[0.85] tracking-[0.01em] text-bright"
          >
            <HeroStyleHeading
              lines={HEADING_LINES}
              label={HEADING_LABEL}
              limeWords={["worlds"]}
            />
          </h2>
        </div>
      </div>

      {/* Carousel — full-bleed, the visual anchor of the section. */}
      <div
        ref={viewportRef}
        data-services-reveal
        className="mt-14 overflow-hidden sm:mt-16"
        style={{
          maskImage:
            "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
        }}
      >
        <div
          ref={trackRef}
          className="flex w-max items-stretch py-2"
        >
          {renderHalf(false)}
          {/* Identical second half — hidden so it never doubles the readout. */}
          {renderHalf(true)}
        </div>
      </div>

      {/* CTA — typography-led closer, distinct from the carousel. */}
      <div className="mx-auto max-w-5xl px-6 text-center sm:px-10">
        <div
          data-services-reveal
          className="mx-auto mt-20 h-px max-w-2xl bg-hairline sm:mt-24"
          aria-hidden
        />
        <div data-services-reveal className="mt-12 sm:mt-14">
          <h3 className="text-balance font-display text-[clamp(2.25rem,6vw,5rem)] uppercase leading-[0.85] tracking-[0.01em] text-bright">
            <HeroStyleHeading
              lines={CTA_LINES}
              label={CTA_LABEL}
              limeWords={["mind?"]}
            />
          </h3>
          <p className="mx-auto mt-5 max-w-[46ch] text-balance font-body text-[clamp(0.9rem,1.4vw,1.05rem)] leading-relaxed text-ash">
            From invisible VFX to full imagined worlds — bring us the spark and
            we will put it on screen.
          </p>
          <a
            href={CTA.href}
            className="mt-8 inline-flex items-center justify-center rounded-full bg-cta px-8 py-4 font-body text-xs font-semibold uppercase tracking-[0.16em] text-cta-ink transition-[filter] duration-300 hover:brightness-[1.07] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cta sm:mt-10 sm:px-9"
          >
            <CubeText label={CTA.label} />
          </a>
        </div>
      </div>
    </section>
  );
}

