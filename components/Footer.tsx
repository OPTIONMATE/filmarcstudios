"use client";

import { useRef } from "react";
import type { ReactNode } from "react";

import CubeText from "@/components/CubeText";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";

/**
 * FilmArc Studios — the footer.
 *
 * The page's final scene, in three beats: the giant FILMARC, the social bar, and
 * the studio line at the very bottom.
 *
 * THE WORDMARK
 * ------------
 * One word — FILMARC, and nothing else — set in Honk, the site's own display
 * face for this one moment. It is a single layer, not a composition: the word
 * simply fades up into place, which is what makes it read as one confident piece
 * of type rather than as an effect happening to a word.
 *
 * Type: Honk — app/layout.tsx loads it. It is a single-weight face, so the
 * wordmark is set at 400 and all of its presence comes from its size; the two
 * custom axes it has (MORF, SHLN) are pinned in app/globals.css.
 *
 * THE FIT
 * -------
 * The wordmark has to span the band it sits in — nearly the whole viewport on a
 * desktop, and never wider than the screen on a phone — so its size is measured
 * rather than written down: the word is set at a reference size, the browser
 * reports the width it actually takes, and the fitted size is that ratio against
 * the band's own width. One multiply is enough because width and font size are
 * proportional once the tracking is expressed in em. The result is written to
 * `--footer-wordmark-size`, which the wordmark reads — so it is one size by
 * construction, and no resize can change it.
 *
 * Two things make that measurement trustworthy:
 *   - it runs from a layout effect, so the fitted size is in place before the
 *     browser paints the hydrated tree — and this section sits far below the
 *     fold, so there is no frame in which an unfitted one could be seen;
 *   - it runs again when Honk is actually usable (`document.fonts.ready`),
 *     because the fallback's metrics are not Honk's, and again whenever the
 *     band's width changes. The stylesheet's own fallback does the same sum in
 *     CSS, so a visitor without JavaScript still gets a full-width wordmark.
 *
 * MOTION
 * ------
 * One `gsap.timeline` on one ScrollTrigger — `start: "top bottom"`, i.e. the
 * footer's top edge reaching the bottom of the viewport, so the scene begins
 * while the wordmark is coming onto the screen rather than after it has already
 * arrived. There is no `once`: the timeline is parked back on its opening frame
 * every time the footer leaves the viewport and played again from the top every
 * time it comes back, so the entrance is something a visitor can watch as many
 * times as they arrive.
 *
 * The entrance itself is deliberately plain — one long, soft ease and nothing
 * else:
 *
 *   1. the wordmark rises a little and fades up          (0s,    1.15s)
 *   2. the social bar follows, a beat later              (0.5s,  0.9s)
 *   3. its label and icons settle, one behind the next
 *      (0.6s, 0.08s apart)
 *   4. the copyright and the legal links, last           (last in that stagger)
 *
 * Every tween is `power2.out` on `opacity` and `transform` only, always towards
 * the layout the browser already has, so nothing reflows and everything ends
 * where it belongs. One ease, one direction, no overshoot and no scale — the
 * motion is smooth by having nothing to catch on. The whole sequence ends with
 * `clearProps`: the stylesheet, not an inline style, holds the finished footer.
 *
 * A replay is the same animation, not an approximation of it. The tweens keep the
 * start values they recorded on their first render, so parking the timeline simply
 * renders that frame again — and the one case where the recorded frame could go
 * stale, a re-fit while the entrance is parked, takes the frame again *and*
 * invalidates the tweens so they record the new one. Parking itself can never be
 * seen: the two moments the trigger's window opens and closes are exactly the
 * footer's two edges crossing the viewport, so the footer is entirely outside it
 * at both, and a play from the top is always a full entrance.
 *
 * `prefers-reduced-motion: reduce` returns before a single property is hidden or
 * moved, so the footer is simply already there — one solid blue wordmark, bar and
 * legal row in place, and no styles to undo. Everything lives in one
 * `gsap.context` scoped to the footer, so StrictMode's double mount and a real
 * unmount both revert every timeline, every trigger and every inline style. The
 * timeline is built once, never on a scroll event.
 *
 * WHAT TO EDIT
 * ------------
 * `SOCIALS` and `LEGAL_LINKS` for the destinations (both carry placeholder `#`
 * hrefs today — see the note on `SOCIALS`), `COPYRIGHT` for the studio line,
 * `BEAT` and the durations for the timing, and `--footer-wordmark-ratio` plus the
 * `0.06` in app/globals.css if the wordmark's tracking or axes ever change.
 *
 * The footer carries no `id` and no enquiry block: nothing in this project links
 * to either (`Navbar`'s `#contact` is still unresolved, exactly as it was when
 * the bar shipped), and the studio's one real destination — the address the hero,
 * the navbar and About all point at — is not part of this section's design.
 */

/** The one word the giant layer renders. Nothing else goes in it. */
const WORDMARK = "FILMARC";

/** What a screen reader hears in place of the word. */
const WORDMARK_LABEL = "Filmarc Studios";

/* --------------------------------------------------------------------------
   THE ICON SET
   The social row's four marks, drawn rather than imported: one 24×24 grid, one
   stroke weight, `currentColor` for the ink — so the button's own colour states
   are the only thing deciding what they look like — and therefore no image
   request, no icon package and no dependency. They are the studio's own
   mono-line versions of four platform marks: legible at 18px and consistent with
   each other, which is what makes the row read as one row.
   -------------------------------------------------------------------------- */

/** The frame every glyph is drawn in. */
function Glyph({ children }: { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-[1.15rem] w-[1.15rem]"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

/** Instagram: the camera — a rounded square, a lens, a dot. */
function InstagramGlyph() {
  return (
    <Glyph>
      <rect x="3.2" y="3.2" width="17.6" height="17.6" rx="5" />
      <circle cx="12" cy="12" r="4.1" />
      <circle cx="17.15" cy="6.85" r="0.9" fill="currentColor" stroke="none" />
    </Glyph>
  );
}

/** YouTube: the screen — a rounded rectangle and a play head. */
function YouTubeGlyph() {
  return (
    <Glyph>
      <rect x="2.4" y="5.4" width="19.2" height="13.2" rx="4" />
      <path d="M10.3 9.4 15.4 12l-5.1 2.6z" fill="currentColor" stroke="none" />
    </Glyph>
  );
}

/** LinkedIn: the "in", on its own tile. */
function LinkedInGlyph() {
  return (
    <Glyph>
      <rect x="3.2" y="3.2" width="17.6" height="17.6" rx="4.4" />
      <path d="M7.6 10.2V17" />
      <circle cx="7.6" cy="7.2" r="0.95" fill="currentColor" stroke="none" />
      <path d="M11.7 17v-6.8" />
      <path d="M11.7 13.4c0-1.9 1.15-3.05 2.75-3.05s2.75 1.15 2.75 3.05V17" />
    </Glyph>
  );
}

/** X: two strokes crossing on the grid's diagonals. */
function XGlyph() {
  return (
    <Glyph>
      <path d="M4.7 4.4 19.3 19.6" />
      <path d="M19.3 4.4 4.7 19.6" />
    </Glyph>
  );
}

/** One channel in the social bar. */
interface Social {
  /** The platform, doubled as the button's accessible name. */
  readonly name: string;
  /** The profile. See the note on the list below. */
  readonly href: string;
  /** The mark, from the icon set above. */
  readonly glyph: ReactNode;
}

/**
 * The social bar's channels.
 *
 * TODO(profiles): every `href` here is a placeholder, and each one is the only
 * line that has to change the day the studio's real profiles exist — nothing
 * else in this file knows a platform's address. They are `#` rather than a
 * plausible-looking domain on purpose: a guessed `instagram.com/…` is a link into
 * somebody else's account, and this project has never named one.
 */
const SOCIALS: readonly Social[] = [
  { name: "Filmarc Studios on Instagram", href: "#", glyph: <InstagramGlyph /> },
  { name: "Filmarc Studios on YouTube", href: "#", glyph: <YouTubeGlyph /> },
  { name: "Filmarc Studios on LinkedIn", href: "#", glyph: <LinkedInGlyph /> },
  { name: "Filmarc Studios on X", href: "#", glyph: <XGlyph /> },
] as const;

/**
 * The studio line, at the foot of the page.
 *
 * The year is written out rather than computed: it is one edit a year, and a
 * client-side clock would disagree with the server's HTML across every new year.
 */
const COPYRIGHT = "© 2026 FILMARC STUDIOS. All rights reserved.";

/**
 * The legal row.
 *
 * TODO(routes): `#`, for the same reason as `SOCIALS` — this project has no
 * `/privacy` or `/terms` route yet (`app/` holds `/` and nothing else), and a
 * link to a page that does not exist is worse than one that is not made yet.
 * Each `href` changes on its own, and the row's entrance follows the entries.
 */
const LEGAL_LINKS = [
  { label: "Privacy policy", href: "#" },
  { label: "Terms & conditions", href: "#" },
] as const;

/** The size the wordmark is measured at. Any size would do — see the fit. */
const REFERENCE_SIZE = 100;

/**
 * Where the footer's content starts, before the entrance brings it home: slightly
 * below where it already is, and fully transparent. Never in from somewhere
 * else, and never scaled — only a short rise and a fade, so there is nothing for
 * the eye to catch on.
 */
const OPENING = {
  wordmark: { autoAlpha: 0, y: 40 },
  bar: { autoAlpha: 0, y: 22 },
  item: { autoAlpha: 0, y: 14 },
} as const;

/**
 * One ease for the whole entrance. `power2.out` starts moving immediately and
 * eases out the whole way, so a tween is never stalled at its start (the "stuck"
 * feeling) and never rushes at its end.
 */
const EASE = "power2.out";

/** How long the wordmark takes to arrive. Long, because it is the scene. */
const WORDMARK_DURATION = 1.15;

/** The social bar, then its contents, then the legal row. */
const BAR_DURATION = 0.9;
const ITEM_DURATION = 0.8;
const ITEM_STAGGER = 0.08;

/**
 * The beats, in seconds. The bar is held back so the wordmark is fully settled
 * before anything else moves — one thing at a time is what reads as smooth.
 */
const BEAT = { bar: 0.5, items: 0.6 } as const;

export default function Footer() {
  const footerRef = useRef<HTMLElement | null>(null);
  /** The band the wordmark is fitted to — the element the fit measures. */
  const bandRef = useRef<HTMLDivElement | null>(null);
  /** The word itself — the one element the entrance moves and the one the fit measures. */
  const wordmarkRef = useRef<HTMLSpanElement | null>(null);

  useIsomorphicLayoutEffect(() => {
    const footer = footerRef.current;
    const band = bandRef.current;
    const wordmark = wordmarkRef.current;
    if (!footer || !band || !wordmark) return;

    /* The bar and the items are read from the DOM rather than held as refs: the
       stagger's order is the markup's order — the label, the icons, then the
       studio line and the legal links — and a ref per item could only ever
       disagree with it. */
    const bar = footer.querySelector<HTMLElement>("[data-footer-bar]");
    const items = gsap.utils.toArray<HTMLElement>("[data-footer-item]", footer);
    if (!bar || items.length === 0) return;

    /* ====================================================================
       1 — THE FIT            (every visitor, moving or not)
       ==================================================================== */

    /* The size the wordmark is fitted to the band at. Two reads and one write:
       the word is set at the reference size, the browser reports the width it
       actually takes, and the fitted size is the ratio between that and the width
       the band has. The trailing letter-spacing is subtracted because it is part
       of the box but not part of the word — with the tracking negative, leaving
       it in would land the word that much short of the band's edge. */
    const fit = () => {
      const available = band.clientWidth;
      if (available <= 0) return;

      band.style.setProperty("--footer-wordmark-size", `${REFERENCE_SIZE}px`);
      const natural = wordmark.getBoundingClientRect().width;
      const tracking = Number.parseFloat(getComputedStyle(wordmark).letterSpacing);
      const perUnit =
        natural / REFERENCE_SIZE -
        (Number.isFinite(tracking) ? tracking / REFERENCE_SIZE : 0);
      if (!(perUnit > 0)) return;

      band.style.setProperty(
        "--footer-wordmark-size",
        `${available / perUnit}px`,
      );
    };

    fit();

    let cancelled = false;
    /** True while the entrance is off its opening frame — the tweens own the
        layers then, and a re-fit must not take the frame out from under them. */
    let started = false;
    /** The opening frame, once the timeline below has defined one. */
    let resetOpeningFrame: (() => void) | null = null;

    /* A re-fit is the same fit, and then two things: the opening frame, if the
       entrance has not started yet (its displacements are the fitted size's, and
       the pre-state must never be caught half-way through one), and a trigger
       re-measure, because the band's own height is what the ScrollTrigger below
       is placed against. */
    const refit = () => {
      fit();
      if (!started) resetOpeningFrame?.();
      ScrollTrigger.refresh();
    };

    /* The band's width only changes when the viewport does — a rotation, a window
       drag, a scrollbar arriving — and the guard keeps the mobile URL bar's
       collapse, which changes only the height, from re-measuring on every flick. */
    let width = band.clientWidth;
    const observer = new ResizeObserver(() => {
      const next = band.clientWidth;
      if (Math.abs(next - width) < 1) return;
      width = next;
      refit();
    });
    observer.observe(band);

    /* Honk's metrics are not the fallback's, so the fit above is provisional
       until the face is usable; this is the authoritative one. It lands long
       before the footer can be scrolled to, and the wordmark is invisible until
       the entrance reveals it, so the correction is never seen. */
    document.fonts?.ready.then(() => {
      if (!cancelled) refit();
    });

    /* ====================================================================
       2 — THE ENTRANCE       (motion only)
       ==================================================================== */

    /* Reduced motion: nothing has been hidden and nothing is going to move, so
       the footer is already in its finished state — the wordmark, the bar and
       the legal row in place. The fit above still ran: that is layout, not
       motion. */
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return () => {
        cancelled = true;
        observer.disconnect();
      };
    }

    const ctx = gsap.context(() => {
      /* The opening frame, taken in this layout effect — synchronously, and
         before the browser paints the hydrated tree — and taken from the
         stylesheet's own resting state, which is why all of it can simply be
         handed back to the stylesheet at the end. */
      const openingFrame = () => {
        gsap.set(wordmark, OPENING.wordmark);
        gsap.set(bar, OPENING.bar);
        gsap.set(items, OPENING.item);
      };
      openingFrame();
      /* `refit`'s half of the same thing: taking the frame again also re-arms the
         timeline below, so the values it plays from are the ones just taken and
         not the previous size's. */
      resetOpeningFrame = () => {
        openingFrame();
        timeline.invalidate();
      };

      /* One timeline, and one trigger for it — a trigger built by hand, because
         the entrance has to be able to run again: the timeline waits
         (`paused: true`) and the trigger decides when the playhead moves.

         `start: "top bottom"` is the footer's top edge touching the bottom of the
         viewport: the scene begins the instant the wordmark is coming onto the
         screen — not while it is still far below, and not once it has already
         arrived. `end: "bottom top"` is the other edge of that window, and
         between the two the footer is, by definition, overlapping the viewport.

         So entering that window — downwards the first time, upwards on the way
         back — always plays the entrance from the top, and leaving it parks the
         timeline on its opening frame again, ready for the next arrival. Both
         leaving moments have the footer entirely outside the viewport (its bottom
         crossing the viewport's top, or its top crossing the viewport's bottom),
         so the park can never be seen. Nothing here pins, scrubs, or takes the
         scroll over. */
      const timeline = gsap.timeline({
        defaults: { ease: EASE },
        paused: true,
      });

      /** Plays the whole entrance, from its opening frame. */
      const play = () => {
        started = true;
        timeline.restart();
      };

      /** Waits on the opening frame — what the footer is left in between visits. */
      const park = () => {
        started = false;
        timeline.pause(0);
      };

      /* The callbacks are the only thing that moves the playhead — the trigger's
         own `toggleActions` are all `"none"`, so it never plays, pauses or resets
         the timeline itself. It stays attached to the timeline so ScrollTrigger
         re-arms it and re-measures the sequence whenever the page refreshes, but
         every state change below is ours: in, play from the top; out, back to
         frame 0. */
      ScrollTrigger.create({
        animation: timeline,
        trigger: footer,
        start: "top bottom",
        end: "bottom top",
        toggleActions: "none none none",
        onEnter: play,
        onEnterBack: play,
        onLeave: park,
        onLeaveBack: park,
      });

      /* 1 — the wordmark. One long, soft rise and fade, and nothing else: no
         second copy, no scale, no overshoot. A single tween on two properties
         has no frame where one part of the word has arrived and another has
         not, which is exactly what made the layered version read as stuck. */
      timeline.to(wordmark, {
        autoAlpha: 1,
        y: 0,
        duration: WORDMARK_DURATION,
      });

      /* 2 — the social bar, drawn in behind the wordmark's own arrival: up from
         below, settling onto the layout it already has. */
      timeline.to(
        bar,
        { autoAlpha: 1, y: 0, duration: BAR_DURATION },
        BEAT.bar,
      );

      /* 3/4 — and its contents, one behind the next: the label and the icons
         first, the studio line and the legal links last, because the stagger
         follows the markup. */
      timeline.to(
        items,
        {
          autoAlpha: 1,
          y: 0,
          duration: ITEM_DURATION,
          stagger: ITEM_STAGGER,
        },
        BEAT.items,
      );

      /* 5 — and out: every property handed back to the stylesheet, which holds
         the finished footer. Nothing is left inline, so nothing can drift, and
         a hover transform on an icon or a link starts from a clean slate. */
      timeline.set([wordmark, bar, ...items], {
        clearProps: "transform,opacity,visibility",
      });
    }, footer);

    /* Reverting the context kills the timeline, the ScrollTrigger, the ticker
       subscription and every inline style — on a real unmount and on StrictMode's
       double mount alike. */
    return () => {
      cancelled = true;
      observer.disconnect();
      ctx.revert();
    };
  }, []);

  /* `overflow-x-clip` on the footer is the wordmark's safety net: it is fitted to
     the band exactly, and a fraction of a pixel of rounding must never become a
     horizontal scrollbar. */
  return (
    <footer
      ref={footerRef}
      className="site-footer relative overflow-x-clip bg-void pt-10 pb-8 sm:pt-14 sm:pb-10"
    >
      <div className="footer-gutter">
        {/* THE WORDMARK — one word, one layer, one box. The `sr-only` span is the
            name; the word itself is `aria-hidden` because it is that name drawn
            out, and announcing it twice is just noise. */}
        <div ref={bandRef} className="footer-wordmark">
          <span className="sr-only">{WORDMARK_LABEL}</span>
          <span aria-hidden ref={wordmarkRef} className="footer-wordmark__text select-none">
            {WORDMARK}
          </span>
        </div>

        {/* THE SOCIAL BAR — the one raised surface in the footer: charcoal on the
            void, a hairline instead of a shadow, and the studio's channels at the
            far end of it. Each button is a link first and a glyph second: the
            label is what it is announced as, and the mark is `aria-hidden`. */}
        <div
          data-footer-bar
          className="mt-10 flex flex-col gap-4 rounded-2xl border border-hairline bg-ink p-4 sm:mt-12 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:py-3 sm:pr-3 sm:pl-6"
        >
          <p
            data-footer-item
            className="font-body text-[0.7rem] font-medium tracking-[0.32em] text-smoke uppercase"
          >
            Follow us
          </p>

          <ul className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            {SOCIALS.map((social) => (
              <li key={social.name} data-footer-item>
                <a
                  href={social.href}
                  aria-label={social.name}
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-void text-bright transition-colors duration-300 hover:bg-electric hover:text-void focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cta"
                >
                  {social.glyph}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* THE STUDIO LINE — copyright left, legal right, one row from `sm` and
            two stacked lines below it. No rule between them: the bar above is
            separation enough. */}
        <div className="mt-8 flex flex-col gap-4 sm:mt-10 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
          <p
            data-footer-item
            className="font-body text-[0.7rem] font-medium tracking-[0.16em] text-smoke uppercase"
          >
            {COPYRIGHT}
          </p>

          <ul className="flex flex-wrap items-center gap-x-7 gap-y-2">
            {LEGAL_LINKS.map((link) => (
              <li key={link.label} data-footer-item>
                <a
                  href={link.href}
                  className="font-body text-[0.7rem] font-medium tracking-[0.16em] text-ash uppercase transition-colors duration-300 hover:text-bright focus-visible:text-bright"
                >
                  <CubeText label={link.label} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
