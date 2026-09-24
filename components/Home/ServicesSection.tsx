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
 * - The track holds two identical halves; a ticker advances `pos` in px and
 *   wraps it modulo one half-width, so the row stays filled and the seam never
 *   shows regardless of item count. (A plain `xPercent: -50, repeat: -1` tween
 *   cannot reverse cleanly, so px + wrap is used instead.)
 * - The loop is driven by the page's vertical scroll *direction*: scrolling
 *   down travels one way (cards left), scrolling up travels the other (cards
 *   right), and the velocity eases between the two — a reversal is a change of
 *   speed, never a jump, and the track's offset is never reset. Scroll speed
 *   sets the magnitude, so a flick is faster than a nudge.
 * - The direction is *latched*: when the page stops moving, the loop keeps
 *   travelling the way it was last asked to and only the extra scroll speed
 *   decays back to the resting drift — it never flips back on its own until the
 *   visitor scrolls the other way.
 * - Hovering the row eases that drift down for readability while the scroll
 *   direction keeps working.
 * - Hovering a single card turns only that card's service name electric blue
 *   (`group-hover:text-electric`, no React state, no re-render).
 * - The section heading enters exactly like the hero's headline, only on scroll
 *   in: every character its own `inline-block` span, one behind the next, same
 *   24px rise, 0.68s duration, 0.026s stagger step and `power3.out` ease.
 * - `prefers-reduced-motion` renders everything static: no ticker, no reveals.
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
 *
 * Every character gets its own `inline-block` span for the same reason the
 * hero's headline does (components/Home/HeroSection.tsx): the entrance is
 * staggered per character. The split happens during render, so the server's
 * HTML already holds one span per character — the word is never painted in one
 * form and re-split on the client. The word itself is atomic, so a narrow
 * screen can never break a word between two of its characters.
 */
function HeroStyleWord({ word }: { word: string }) {
  return (
    <span className="inline-block">
      {[...word].map((character, characterIndex) => (
        <span
          key={`${word}-${characterIndex}`}
          /* The stagger's marker (see the effect below). */
          data-services-char
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
const HOVER_DRIFT_SCALE = 0.12;

/** Scroll-velocity gain and clamp for the scroll-driven speed (px/s). */
const SCROLL_BOOST_GAIN = 1.1;
const SCROLL_BOOST_MAX = 1400;

/** How fast a scroll-driven speed boost settles back to the resting speed. */
const SCROLL_SPEED_DECAY = 1.6;

/** How fast the loop's velocity chases the scroll-derived target. */
const VELOCITY_EASE = 4;

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
      /* Entrance — the eyebrow, carousel and CTA rise once on scroll in. (The
         headings are owned by the character stagger below instead.) */
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

      /* Headings — the hero's own character stagger, replayed on scroll in
         instead of on load. Every character of a `[data-services-stagger]`
         heading is its own inline-block span (see HeroStyleWord), so the
         entrance is one character behind the next at the hero's exact timing:
         the same 24px rise, the same 0.68s, the same 0.026s stagger step and
         the same `power3.out` ease as the headline in the hero. Only transform
         and opacity are touched — never a mask, never a layout property — so no
         glyph can be clipped, and `once: true` retires each heading's trigger as
         soon as it has played.
         Unlike the hero, the opening frame is taken by `gsap.set` in this layout
         effect rather than by a stylesheet pre-state: this heading is always
         below the fold at first paint (the hero owns one full viewport), so the
         assertion lands before the browser paints the hydrated tree and nothing
         is ever seen flashing — the same reason the block reveals below hide
         themselves here. */
      const STAGGER_FROM = { opacity: 0, y: 24 } as const;
      gsap.utils
        .toArray<HTMLElement>("[data-services-stagger]", section)
        .forEach((heading) => {
          const characters = gsap.utils.toArray<HTMLElement>(
            "[data-services-char]",
            heading,
          );
          if (characters.length === 0) return;
          gsap.set(characters, STAGGER_FROM);
          gsap.to(characters, {
            y: 0,
            opacity: 1,
            duration: 0.68,
            stagger: 0.026,
            ease: "power3.out",
            scrollTrigger: { trigger: heading, start: "top 88%", once: true },
            /* Hand both properties back to CSS once settled — no leftover
               inline transforms or stacking contexts on 30-odd spans (the same
               `clearProps` handback the hero's entrance ends with). */
            onComplete: () => gsap.set(characters, { clearProps: "transform,opacity" }),
          });
        });

      /* Marquee — one persistent ticker-driven loop.
         `pos` is the px offset wrapped into [0, halfWidth): the track holds two
         identical halves, so wrapping keeps the row filled in *both*
         directions and the seam never shows. The velocity is driven by the
         page's vertical scroll direction — down travels one way, up the other —
         and eases between the two, so a reversal never resets the offset. */
      let halfWidth = 0;
      let pos = 0;
      let velocity = PX_PER_SECOND;
      let targetVelocity = PX_PER_SECOND;
      let driftScale = 1;
      let driftScaleTarget = 1;

      /* Scroll sampling. The direction is latched (default: the leftward travel
         of a downward scroll) and only ever changes when the visitor scrolls
         the other way; the sampled speed is a boost that decays afterwards. */
      let lastScrollY = window.scrollY || 0;
      let lastScrollTime = performance.now();
      let scrollDir = 1;
      let scrollSpeed = 0;

      const render = () => {
        if (halfWidth > 0) gsap.set(track, { x: -pos });
      };

      const measure = () => {
        halfWidth = track.scrollWidth / 2;
        if (halfWidth > 0) pos = pos % halfWidth;
        render();
      };

      const onTick = (_time: number, deltaMS: number) => {
        if (halfWidth <= 0) return;
        const dt = Math.min(deltaMS / 1000, 0.05);
        /* Hover eases the drift scale itself — no tween rebuilds, no jumps. */
        driftScale += (driftScaleTarget - driftScale) * (1 - Math.exp(-dt * 5));

        /* Resting speed the loop always returns to, in the latched direction. */
        const resting = PX_PER_SECOND * driftScale;
        /* A scroll boost is extra speed on top of that; it decays, never snaps. */
        scrollSpeed *= Math.exp(-dt * SCROLL_SPEED_DECAY);
        const driven =
          Math.min(scrollSpeed * SCROLL_BOOST_GAIN, SCROLL_BOOST_MAX) *
          driftScale;
        targetVelocity = scrollDir * Math.max(resting, driven);
        /* One eased velocity: reversal is a change of sign over ~250ms. */
        velocity +=
          (targetVelocity - velocity) * (1 - Math.exp(-dt * VELOCITY_EASE));

        pos += velocity * dt;
        /* Wrap in both directions — the duplicated halves make it seamless. */
        pos %= halfWidth;
        if (pos < 0) pos += halfWidth;
        render();
      };

      measure();
      gsap.ticker.add(onTick);

      /* Scroll direction — measured from real position deltas, so it follows
         Lenis smoothing instead of fighting it. Down travels one way (cards
         left), up the other (cards right). The last direction is kept: after the
         page stops, the row keeps travelling that way until a scroll in the
         opposite direction flips it again. */
      const onScroll = () => {
        const now = performance.now();
        const y = window.scrollY || 0;
        const dt = Math.max((now - lastScrollTime) / 1000, 1 / 240);
        const delta = y - lastScrollY;
        lastScrollY = y;
        lastScrollTime = now;
        if (Math.abs(delta) < 0.5) return; /* sub-pixel noise */

        scrollDir = delta > 0 ? 1 : -1;
        scrollSpeed = Math.abs(delta) / dt;
      };
      window.addEventListener("scroll", onScroll, { passive: true });

      /* Hover slowdown — retargets the drift scale only. */
      const canHover = window.matchMedia("(hover: hover)").matches;
      const slow = () => {
        driftScaleTarget = HOVER_DRIFT_SCALE;
      };
      const restore = () => {
        driftScaleTarget = 1;
      };

      if (canHover) {
        viewport.addEventListener("mouseenter", slow);
        viewport.addEventListener("mouseleave", restore);
        viewport.addEventListener("focusin", slow);
        viewport.addEventListener("focusout", restore);
      }

      /* Keep measurements fresh once fonts resolve and on resize. */
      let resizeTimer: number | null = null;
      const onResize = () => {
        if (resizeTimer !== null) window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(measure, 200);
      };
      window.addEventListener("resize", onResize);

      let fontsCancelled = false;
      if (typeof document !== "undefined" && "fonts" in document) {
        document.fonts.ready
          .then(() => {
            if (!fontsCancelled) {
              measure();
              ScrollTrigger.refresh();
            }
          })
          .catch(() => {});
      }

      return () => {
        fontsCancelled = true;
        if (resizeTimer !== null) window.clearTimeout(resizeTimer);
        window.removeEventListener("resize", onResize);
        window.removeEventListener("scroll", onScroll);
        gsap.ticker.remove(onTick);
        if (canHover) {
          viewport.removeEventListener("mouseenter", slow);
          viewport.removeEventListener("mouseleave", restore);
          viewport.removeEventListener("focusin", slow);
          viewport.removeEventListener("focusout", restore);
        }
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
          className="group relative flex min-h-44 w-56 shrink-0 flex-col items-center justify-center border border-hairline bg-ink/60 px-5 pb-6 pt-12 text-center sm:min-h-48 sm:w-64 sm:px-6"
        >
          {/* Index + lime marker — pinned to the card's top-right corner. */}
          <span className="absolute right-4 top-4 flex items-center gap-2 sm:right-5 sm:top-5">
            <span className="font-body text-[0.65rem] font-medium uppercase tracking-[0.28em] text-smoke">
              {String((index % services.length) + 1).padStart(2, "0")}
            </span>
            <span aria-hidden className="inline-block h-1.5 w-1.5 rotate-45 bg-cta" />
          </span>
          {/* Only this card's name changes ink on hover — border, background,
              index and diamond stay exactly as they are. */}
          <span className="whitespace-normal text-center font-display text-[1.65rem] uppercase leading-[0.9] tracking-[0.01em] text-bright transition-colors duration-500 ease-out group-hover:text-electric group-focus-within:text-electric sm:text-[2rem]">
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
        {/* Eyebrow + heading — display type, deliberately below hero scale.
            The eyebrow rises as one block; the heading below it is owned by the
            character stagger instead (no block reveal on the wrapper, so the two
            animations never compose), exactly as the hero splits its own
            headline from the copy that follows it. */}
        <div className="text-center">
          <p
            data-services-reveal
            className="font-body text-[0.7rem] font-medium uppercase tracking-[0.32em] text-smoke"
          >
            <span className="text-cta">01</span>
            <span aria-hidden className="mx-3 text-hairline">
              /
            </span>
            What we do
          </p>
          <h2
            id="services-heading"
            data-services-stagger
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

