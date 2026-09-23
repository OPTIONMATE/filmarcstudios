"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { gsap } from "@/lib/gsap";
import { ENTRANCE_MARKER, releaseEntrance } from "@/lib/heroEntrance";
import { holdEntranceGate, openEntranceGate } from "@/lib/introGate";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";

/**
 * FilmArc Studios - the opening sequence.
 *
 * A star falls down the centre of a black screen, drawing a thin yellow line
 * behind it. The line becomes the seam the page opens along: two panels, one
 * each side of it, part to the edges and the homepage is simply there - its own
 * reel already playing, its own copy arriving behind the widening gap.
 *
 *   star  ->  trail  ->  seam  ->  the world of FilmArc
 *
 * THE SEQUENCE (one timeline, ~3.6s)
 *
 *   0.00  PHASE 1  the wordmark: the studio's own lockup (the arc mark plus
 *                  "FilmArc Studios" in Bebas Neue, the same pair the navbar
 *                  carries) fades up on black, centred, and is given a beat to
 *                  be read before it clears the axis for the star.
 *   1.25  PHASE 2  the star: a small yellow sparkle enters the top of the frame
 *                  and travels the centre axis to the bottom edge, leaving a 2px
 *                  trail. Trail and star share one duration and one ease, so the
 *                  tip of the line stays on the star the whole way down.
 *   2.25  PHASE 3  the arrival: the star blooms once at the end of the line it
 *                  has just drawn, then dissolves into it. The line is now a
 *                  seam spanning the viewport.
 *   2.55  PHASE 4  the opening: the two panels part symmetrically along the seam
 *                  (`power3.inOut`, 1.05s) while the seam fades out into the gap
 *                  they open, and the intro is out of the document at 3.60s.
 *
 * THE HOMEPAGE IS NEVER MOVED. This is a fixed, full-viewport layer above the
 * page, and every keyframe is a transform or an opacity: `xPercent` on the
 * panels, `scaleY` on the trail, `y`/`scale` on the star. Nothing here can shift
 * the hero's layout, its document flow, or its own entrance - which is what
 * makes the reveal a *reveal* rather than a re-entry.
 *
 * NOTHING IS PAINTED THAT SHOULD NOT BE (three layers of pre-state, in the order
 * the browser meets them):
 *
 *   1. app/globals.css holds this overlay out of the box entirely, and takes it
 *      back out again the moment the document stops saying the intro is playing:
 *      `#filmarc-intro { display: none }`, shown only while
 *      `html[data-intro="play"]` matches under `scripting: enabled` and
 *      `prefers-reduced-motion: no-preference`. So a visitor without JavaScript,
 *      or one who has asked for reduced motion, is never behind a black screen;
 *   2. the bootstrap script below runs while the parser is still reading the
 *      body - before the first paint - and writes that switch for *this*
 *      document: always "play", so the first paint is the sequence's own
 *      opening frame;
 *   3. the overlay's animated elements - wordmark, skip button, trail, star -
 *      carry `data-hero-enter`, the same marker the hero's copy carries: the
 *      stylesheet holds them at opacity 0, so the very first frame of the
 *      sequence is "black screen, nothing on it", and this effect asserts the
 *      same opening frame with `gsap.set()` from a layout effect - before the
 *      browser paints the hydrated tree - then releases the marker
 *      (lib/heroEntrance.ts).
 *
 * The timeline starts `paused` and is played only once `document.fonts.ready`
 * has settled: the wordmark is the display face, and a fallback font swapping
 * mid-fade would repaint the brand mark in the middle of its own reveal. The
 * wait is a real readiness signal, not a delay - and it happens on a screen that
 * is already the sequence's first frame.
 *
 * COORDINATION (lib/introGate.ts). The intro holds the homepage's entrance
 * closed from the moment it mounts and opens it as the panels begin to part, so
 * the hero's headline, description, CTA and the navbar's bar arrive *with* the
 * reveal instead of having played behind it. One introduction, not two.
 *
 * THE WAYS OUT. The sequence ends by removing itself from the document
 * (`return null`), and every path leads there: it completes, the visitor presses
 * "Skip intro" (a discreet, keyboard-reachable option) or Escape ends it early,
 * a reduced-motion visitor skips it before it starts. Underneath all of them
 * sits the bootstrap script's safety net: if the app never claims this overlay,
 * the script gives up on it, takes the overlay out and releases the page's own
 * pre-state, so a bundle that never arrives cannot leave anyone staring at a
 * black screen.
 *
 * PERFORMANCE AND A11Y. Two panels, one line, one star: four animated elements,
 * no particles, no gradients, no filters. The panels and the seam are
 * `aria-hidden`; the only thing a visitor can reach inside the overlay is the
 * skip button, and the page behind it stays in the accessibility tree.
 */

/* --------------------------------------------------------------------------
   THE DOCUMENT-LEVEL SWITCH (layers 1 and 2 above)
   -------------------------------------------------------------------------- */

/** The overlay's id: the stylesheet's handle on it, and the script's. */
const INTRO_ID = "filmarc-intro";

/** The attribute on <html> that says whether this document plays the intro. */
const INTRO_ATTRIBUTE = "data-intro";

/** First paint wants the intro: the overlay is in the box. */
const INTRO_PLAYING = "play";

/** The intro is over, skipped, or stalled: the overlay is out of the box. */
const INTRO_OFF = "off";

/** The app never arrived: the overlay is out *and* the page is handed back. */
const INTRO_STALLED = "stalled";

/**
 * Written on the overlay by this component, read only by the script's safety
 * net: while it is present, the app has the intro in hand.
 */
const INTRO_CLAIMED = "data-intro-claimed";

/** The two halves of one media query, spelled as each side needs it. */
const MOTION_QUERY = "(prefers-reduced-motion: no-preference)";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

/**
 * How long the bootstrap script waits for the app before it decides the app is
 * never coming. A safety net, not a schedule: the sequence waits for nothing,
 * and the app claims the overlay the moment it mounts. The net can therefore
 * only fire on a document whose JavaScript never ran at all.
 */
const STALL_MS = 6000;

/* --------------------------------------------------------------------------
   THE STAR, IN PIXELS
   -------------------------------------------------------------------------- */

/** The star's box. Its centre is what rides the axis, so the markup centres it
 *  with a half-width margin - a transform there would be one GSAP is about to
 *  own. */
const STAR_SIZE = 14;

/** How far above the bottom edge the star's centre stops: inside the frame, so
 *  its bloom is still on screen as the seam hands over to the panels. */
const STAR_LANDING = 4;

/* --------------------------------------------------------------------------
   THE SEQUENCE, IN SECONDS
   -------------------------------------------------------------------------- */

/** Phase 1 - the wordmark's reveal (comp: 0.5-0.8s), its beat, and its exit. */
const WORDMARK_IN = 0.7;
const WORDMARK_HOLD = 0.25;
const WORDMARK_OUT = 0.35;

/** Phase 2 - the fall: 1.1s of travel (comp: 0.8-1.2s, eased 10% slower),
 *  starting as the wordmark clears the axis. */
const FALL_AT = 1.25;
const FALL = 1.1;

/** Phase 3 - the arrival, at the end of the star's own line. */
const LANDED_AT = FALL_AT + FALL;
const BLOOM = 0.16;
const DISSOLVE = 0.35;

/** Phase 4 - the opening: the panels part, and the homepage starts to move as
 *  the gap widens. Everything is out of the document by 3.6s. */
const PANELS_AT = 2.55;
const PANEL_OPEN = 1.05;
const REVEAL_AT = PANELS_AT + 0.1;
const SEAM_OUT = 0.5;

/** The skip button's exit: the same two panels opening, without the wait. */
const PANEL_EXIT = 0.45;

/* --------------------------------------------------------------------------
   THE BOOTSTRAP SCRIPT
   -------------------------------------------------------------------------- */

/**
 * Runs during HTML parsing, as the first thing inside the overlay and ahead of
 * every visual sibling in it, so the very first paint already has its answer.
 * Three jobs, in order:
 *
 *   1. mark this document as playing - "play" on <html>. The stylesheet reads
 *      that one attribute (app/globals.css), so the first paint already has
 *      its answer: the sequence's own opening frame;
 *   2. arm the safety net: if the app has not claimed the overlay by then, the
 *      JavaScript never arrived. The overlay goes out of the box ("stalled") and
 *      the page's own pre-state is released the same way `releaseEntrance()`
 *      releases it for a live bundle (lib/heroEntrance.ts) - so nobody can be
 *      left in front of a black screen;
 *   3. nothing else. It is idempotent, and inert on any page whose markup does
 *      not contain the overlay.
 *
 * Every key and value below is interpolated from the constants above: this
 * string is the one place where the two halves of the contract meet, so they
 * cannot drift apart.
 *
 * (A strict Content-Security-Policy would need a nonce for an inline bootstrap
 * like this. This project ships no CSP.)
 */
const BOOTSTRAP = `(function(){var d=document.documentElement;d.setAttribute("${INTRO_ATTRIBUTE}","${INTRO_PLAYING}");setTimeout(function(){var el=document.getElementById("${INTRO_ID}");if(!el||el.hasAttribute("${INTRO_CLAIMED}"))return;d.setAttribute("${INTRO_ATTRIBUTE}","${INTRO_STALLED}");var m=document.querySelectorAll("[${ENTRANCE_MARKER}]");for(var i=0;i<m.length;i++)m[i].removeAttribute("${ENTRANCE_MARKER}")},${STALL_MS})})()`;

/* --------------------------------------------------------------------------
   THE DECISION, ON THE CLIENT — always "play" (the intro runs on every load)
   -------------------------------------------------------------------------- */

/** Whether the sequence should run *here*, now. Reduced motion and the
 * bootstrap's own "stalled" verdict can still take the overlay out; nothing
 * else does. The intro plays on every full page load, by request. */
function canPlayIntro(): boolean {
  /* "Stalled" means the app arrived after the page had already been handed back:
     the intro must not then play over a page the visitor is already using. */
  if (
    document.documentElement.getAttribute(INTRO_ATTRIBUTE) === INTRO_STALLED
  ) {
    return false;
  }

  /* Reduced motion: the stylesheet has already taken the overlay out of the box
     for these visitors, and this is the same query it used. */
  if (window.matchMedia(REDUCED_MOTION_QUERY).matches) return false;

  /* Reduced-motion and "stalled" stay out; otherwise the intro plays on every
     full page load, by request. */
  return true;
}

export default function FilmArcIntro() {
  /** The sequence is over (or was never going to run): React drops the overlay,
   *  and with it every node, listener and inline style this file created. */
  const [finished, setFinished] = useState(false);

  const introRef = useRef<HTMLDivElement | null>(null);
  const leftPanelRef = useRef<HTMLDivElement | null>(null);
  const rightPanelRef = useRef<HTMLDivElement | null>(null);
  const trailRef = useRef<HTMLDivElement | null>(null);
  const starRef = useRef<HTMLDivElement | null>(null);
  const wordmarkRef = useRef<HTMLDivElement | null>(null);
  const skipButtonRef = useRef<HTMLButtonElement | null>(null);

  /** The running sequence, so the skip button can end it early. */
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  /** One way out. Whichever path arrives first - the timeline's own end,
   *  the skip button, Escape, a reduced-motion visitor, or a stalled bootstrap -
   *  every later one is a no-op. */
  const overRef = useRef(false);

  /**
   * Ends the intro: the document switch, the page's entrance, and then the
   * overlay itself, so no paint can ever show a stopped sequence.
   *
   * `remember` is kept so every caller reads the same way; the intro replays
   * on every full page load, so it records nothing.
   */
  const endIntro = useCallback((remember: boolean) => {
    if (overRef.current) return;
    overRef.current = true;

    /* The intro replays on every full page load, so nothing is recorded. */
    void remember;

    /* The stylesheet's switch first, then the gate: with the overlay already out
       of the box, the homepage's entrance is free to start in this same frame. */
    document.documentElement.setAttribute(INTRO_ATTRIBUTE, INTRO_OFF);
    openEntranceGate();
    setFinished(true);
  }, []);

  /**
   * The skip button, and Escape with it. Not a cut: the two panels still part
   * and the homepage's entrance still rides with them, but in 0.45s rather than
   * 1.05s, and without the phases the visitor has not reached yet.
   */
  const skip = useCallback(() => {
    if (overRef.current) return;

    const wordmark = wordmarkRef.current;
    const star = starRef.current;
    const trail = trailRef.current;
    const skipButton = skipButtonRef.current;
    const leftPanel = leftPanelRef.current;
    const rightPanel = rightPanelRef.current;

    /* Nothing to hand over: end it outright rather than leave the page behind a
       curtain. */
    if (
      !wordmark ||
      !star ||
      !trail ||
      !skipButton ||
      !leftPanel ||
      !rightPanel
    ) {
      endIntro(true);
      return;
    }

    timelineRef.current?.kill();
    openEntranceGate();

    gsap
      .timeline({ onComplete: () => endIntro(true) })
      .set([wordmark, star, trail, skipButton], { opacity: 0 }, 0)
      .to(
        leftPanel,
        { xPercent: -100, duration: PANEL_EXIT, ease: "power2.inOut" },
        0,
      )
      .to(
        rightPanel,
        { xPercent: 100, duration: PANEL_EXIT, ease: "power2.inOut" },
        0,
      );
  }, [endIntro]);

  /* WHILE THE OVERLAY IS UP, the page behind it does not move.
     A wheel, a drag or a page-down would otherwise scroll the document under the
     panels, and the reveal would open on the middle of the hero with its reel
     paused off-screen. Both listeners are on the capture phase, so a gesture is
     stopped before the browser's own scrolling *or* Lenis's wheel handler
     (components/SmoothScroll.tsx) can act on it; anything aimed at the skip
     button is left alone, and a two-finger touch is left alone so pinch-zoom
     still works. Escape is the keyboard's skip. */
  useEffect(() => {
    /* Once the overlay is gone the page must scroll: these listeners exist
       only to hold the document still behind the closed panels. Note this
       effect also runs once on mount while the overlay is up, and returns
       early after `finished` flips — either way the listeners never leak
       into normal browsing. */
    if (finished) return;
    const SCROLL_KEYS = [
      " ",
      "PageDown",
      "PageUp",
      "Home",
      "End",
      "ArrowDown",
      "ArrowUp",
    ];

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        skip();
        return;
      }

      if (event.target === skipButtonRef.current) return;
      if (!SCROLL_KEYS.includes(event.key)) return;

      event.preventDefault();
      event.stopPropagation();
    };

    const onWheel = (event: WheelEvent) => {
      event.preventDefault();
      event.stopPropagation();
    };

    const onTouchMove = (event: TouchEvent) => {
      /* More than one finger is a pinch, not a scroll. */
      if (event.touches.length > 1) return;

      event.preventDefault();
      event.stopPropagation();
    };

    window.addEventListener("keydown", onKeyDown, { capture: true });
    window.addEventListener("wheel", onWheel, {
      capture: true,
      passive: false,
    });
    window.addEventListener("touchmove", onTouchMove, {
      capture: true,
      passive: false,
    });

    return () => {
      window.removeEventListener("keydown", onKeyDown, { capture: true });
      window.removeEventListener("wheel", onWheel, { capture: true });
      window.removeEventListener("touchmove", onTouchMove, { capture: true });
    };
  }, [skip, finished]);

  /* THE SEQUENCE. One timeline, built in a layout effect - before the browser
     paints the hydrated tree - and never started by a timer. */
  useIsomorphicLayoutEffect(() => {
    const intro = introRef.current;
    if (!intro) return;

    /* The stylesheet already took this overlay out of the box for a
       reduced-motion visitor (layer 1 at the top of this file). Nothing to
       run: hand the page over and leave. */
    if (!canPlayIntro()) {
      endIntro(false);
      return;
    }

    /* THE CLAIM. The app is here, so the bootstrap script's safety net must stop
       worrying: the overlay is marked, and the switch the stylesheet reads is
       re-asserted. The script wrote it before the first paint; this write is what
       covers a React remount of <html> - StrictMode resets attributes it does not
       render - and it happens in the same synchronous pass, so no paint can slip
       between the two. */
    intro.setAttribute(INTRO_CLAIMED, "");
    document.documentElement.setAttribute(INTRO_ATTRIBUTE, INTRO_PLAYING);

    /* The page's own entrance waits for the reveal. Bookkeeping only: the hero
       and the navbar keep owning their motion (lib/introGate.ts). */
    holdEntranceGate();

    const mm = gsap.matchMedia();
    let disposed = false;

    mm.add(MOTION_QUERY, () => {
      const star = starRef.current;
      const trail = trailRef.current;
      const wordmark = wordmarkRef.current;
      const skipButton = skipButtonRef.current;
      const leftPanel = leftPanelRef.current;
      const rightPanel = rightPanelRef.current;
      if (
        !star ||
        !trail ||
        !wordmark ||
        !skipButton ||
        !leftPanel ||
        !rightPanel
      ) {
        return;
      }

      /* 1 - the opening frame, taken before the next paint: the same silhouette
             the stylesheet was already holding (globals.css), plus the geometry
             it deliberately leaves to GSAP. None of it is visible while these
             values land, so none of it can be seen to move. */
      gsap.set([wordmark, skipButton], { opacity: 0, y: 12 });
      gsap.set(trail, { opacity: 1, scaleY: 0 });
      gsap.set(star, { opacity: 1, y: -STAR_SIZE, scale: 1 });

      /* 2 - and the stylesheet lets go of those same four elements, so from here
             nothing in the cascade can fight the timeline for their opacity. */
      releaseEntrance([wordmark, skipButton, trail, star]);

      const timeline = gsap.timeline({
        paused: true,
        defaults: { ease: "power3.out" },
        onComplete: () => endIntro(true),
      });

      /* PHASE 1 - the wordmark: up on black, held long enough to be read, and
         gone before the star reaches the middle of the frame. */
      timeline.to(
        [wordmark, skipButton],
        { opacity: 1, y: 0, duration: WORDMARK_IN },
        0,
      );
      timeline.to(
        wordmark,
        { opacity: 0, y: -10, duration: WORDMARK_OUT, ease: "power2.in" },
        WORDMARK_IN + WORDMARK_HOLD,
      );

      /* PHASE 2 - the fall. `scaleY` on the trail and `y` on the star share one
         duration and one ease, so the tip of the line stays on the star the whole
         way down; and because the trail is scaled rather than resized, and the
         star's target is measured from the viewport, neither can be out of step
         at any screen size. */
      timeline.to(
        trail,
        { scaleY: 1, duration: FALL, ease: "power2.inOut" },
        FALL_AT,
      );
      timeline.to(
        star,
        {
          y: () => window.innerHeight - STAR_SIZE / 2 - STAR_LANDING,
          duration: FALL,
          ease: "power2.inOut",
        },
        FALL_AT,
      );

      /* PHASE 3 - the arrival: one bloom at the end of the star's own line, then
         the star becomes the seam rather than stopping in front of it. */
      timeline.to(
        star,
        { scale: 1.55, duration: BLOOM, ease: "power2.out" },
        LANDED_AT,
      );
      timeline.to(
        star,
        { scale: 0.3, opacity: 0, duration: DISSOLVE, ease: "power2.in" },
        LANDED_AT + BLOOM,
      );

      /* PHASE 4 - the opening. Two panels, one motion: the same position, the
         same duration, the same easing, mirrored - so the seam stays the centre
         of the screen the whole way open. The seam goes as the gap widens, and
         the homepage's entrance starts with it. */
      timeline.to(
        leftPanel,
        { xPercent: -100, duration: PANEL_OPEN, ease: "power3.inOut" },
        PANELS_AT,
      );
      timeline.to(
        rightPanel,
        { xPercent: 100, duration: PANEL_OPEN, ease: "power3.inOut" },
        PANELS_AT,
      );
      timeline.to(
        [trail, skipButton],
        { opacity: 0, duration: SEAM_OUT, ease: "power1.inOut" },
        PANELS_AT + 0.05,
      );
      timeline.call(openEntranceGate, undefined, REVEAL_AT);

      timelineRef.current = timeline;

      /* 3 - play. On a screen that is already this sequence's first frame, wait
             for the display face rather than let a fallback font swap inside the
             wordmark's own reveal: `document.fonts.ready` is a real readiness
             signal, it resolves when loading settles (including when it fails),
             and no timer is involved anywhere in this file. */
      const play = () => {
        if (!disposed) timeline.play();
      };

      if (typeof document.fonts === "undefined") play();
      else void document.fonts.ready.then(play);

      return () => {
        timeline.kill();
        timelineRef.current = null;
      };
    });

    return () => {
      disposed = true;
      /* Reverting the matchMedia context is what removes the timeline above and
         every inline style this effect wrote - including on the branch where the
         query never matched. */
      mm.revert();
    };
  }, [endIntro]);

  /* The overlay leaves the document here. Every path above ends at this line:
     there is no state in which a finished intro is still on screen. */
  if (finished) return null;

  return (
    <div
      id={INTRO_ID}
      ref={introRef}
      /* Out of flow, above everything (the navbar is z-50), and clipped: the star
         starts above the top edge and the two panels finish outside the frame,
         and neither may paint past the viewport or add a scrollbar on its way. */
      className="fixed inset-0 z-[100] overflow-hidden"
    >
      {/* THE DECISION, BEFORE THE FIRST PAINT - layer 2 of the pre-state, and the
          first thing inside the overlay so that it runs before any of its
          siblings have even been parsed. It is the only script in the document. */}
      <script dangerouslySetInnerHTML={{ __html: BOOTSTRAP }} />

      {/* THE TWO PANELS. Each is a shade over half the viewport, so they overlap
          rather than meet: no subpixel seam can open between them at any width,
          and the same construction covers the frame's edges and its bottom. Both
          carry the site's own `bg-void` rather than a new black, so the panels
          and the page they uncover are literally the same colour. */}
      <div
        ref={leftPanelRef}
        aria-hidden
        className="absolute inset-y-0 left-0 w-[50.05%] bg-void will-change-transform"
      />
      <div
        ref={rightPanelRef}
        aria-hidden
        className="absolute inset-y-0 right-0 w-[50.05%] bg-void will-change-transform"
      />

      {/* THE AXIS - the star's path, the trail and, by the end of the sequence,
          the seam. One container on the exact centre of the viewport: the trail
          fills it and scales from its top, the star rides it, and both are
          measured against its height, so the line is the centre of the screen at
          every size. `-ml-px` on a 2px rule is what puts it exactly there - a
          translate utility would be a transform GSAP is about to overwrite. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-1/2 -ml-px w-0.5"
      >
        <div
          ref={trailRef}
          data-hero-enter
          className="absolute inset-0 w-full origin-top bg-cta"
        />
        <div
          ref={starRef}
          data-hero-enter
          className="absolute top-0 left-1/2 -ml-[7px] h-[14px] w-[14px] text-cta"
        >
          {/* The star itself: a four-point sparkle in the brand yellow with one
              warm-white core. Those two colours are the whole sequence. */}
          <svg
            aria-hidden
            viewBox="0 0 24 24"
            fill="none"
            className="h-full w-full"
          >
            <path
              d="M12 0 L14.75 9.25 L24 12 L14.75 14.75 L12 24 L9.25 14.75 L0 12 L9.25 9.25 Z"
              fill="currentColor"
            />
            <circle
              cx="12"
              cy="12"
              r="2.6"
              fill="currentColor"
              className="text-star-core"
            />
          </svg>
        </div>
      </div>

      {/* THE WORDMARK - the studio's own lockup: the same arc mark in the same
          yellow, above the same words in the same condensed face the navbar
          carries, centred and larger because this is a title card and not a bar. */}
      <div
        ref={wordmarkRef}
        data-hero-enter
        className="absolute inset-0 flex flex-col items-center justify-center gap-3 sm:gap-4"
      >
        <svg
          aria-hidden
          viewBox="0 0 32 32"
          fill="none"
          className="h-9 w-9 text-cta sm:h-11 sm:w-11"
        >
          <path
            d="M4 28A24 24 0 0 1 28 4"
            stroke="currentColor"
            strokeWidth="5"
            strokeLinecap="round"
          />
        </svg>
        <span className="font-display text-[1.5rem] uppercase leading-none tracking-[0.13em] text-bright sm:text-[2rem]">
          FilmArc Studios
        </span>
      </div>

      {/* THE WAY OUT. Discreet, there from the first beat, and the first thing
          Tab reaches, because it is the only focusable element inside the
          overlay. Escape does the same job from anywhere (the effect above). */}
      <div className="absolute inset-x-0 bottom-6 z-10 flex justify-center sm:bottom-8">
        <button
          ref={skipButtonRef}
          type="button"
          data-hero-enter
          onClick={skip}
          className="font-body text-[0.65rem] font-medium uppercase tracking-[0.22em] text-bright/45 transition-colors hover:text-bright focus-visible:text-bright focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cta"
        >
          Skip intro
        </button>
      </div>
    </div>
  );
}

