"use client";

import Link from "next/link";
import { useRef } from "react";

import CubeText from "@/components/CubeText";
import { DisplayHeading } from "@/components/DisplayHeading";
import { gsap } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";

/**
 * FilmArc Studios — the 404 stage.
 *
 * One scene, four beats, all of them borrowed from the cutting room:
 *
 *   1. the room   a dark stage: the projector's halo, strip perforations top
 *                 and bottom, scan lines, and one scan line that travels the
 *                 height of the section on a loop.
 *   2. the dial   a film leader counting 3 · 2 · 1 and settling on 404, with a
 *                 shutter wedge turning behind the numerals the whole time.
 *   3. the words  the headline enters character by character, exactly like the
 *                 hero's, and the copy, actions and slate rise in behind it.
 *   4. the slate  the address that was asked for, against a reel with no record
 *                 of it, with a running timecode beside the dial.
 *
 * WHY THE COUNTDOWN IS REAL
 * -------------------------
 * Every frame of the countdown is in the server's markup, stacked on the dial's
 * axis, and only the code is visible in CSS. The timeline parks them all and
 * brings one in at a time, so the dial can never show two numerals at once, a
 * visitor without JavaScript sees a finished 404, and a visitor who has asked
 * for reduced motion gets that same static end state rather than a countdown
 * they did not ask for (`gsap.matchMedia` never builds the timeline for them).
 *
 * The requested address is read from `window.location` and written straight to
 * the slate: the server cannot know it, and writing it from a layout effect —
 * never through state — keeps the markup identical on both sides of hydration
 * (no mismatch, no cascading render) and leaves a visitor without JavaScript a
 * finished page, one dash lighter.
 *
 * Everything sits in one `gsap.matchMedia` scope rooted at the section, so a
 * StrictMode remount in development reverts cleanly.
 */

/** The headline, in the site's two-tier display style. */
const HEADING_LINES = [
  ["Frame", "Not"],
  ["Found"],
] as const;
const HEADING_LABEL = "Frame Not Found";

/** The leader's frames, in order. The last one is what the page is about. */
const LEADER_STEPS = ["3", "2", "1", "404"] as const;
const FINAL_STEP = LEADER_STEPS[LEADER_STEPS.length - 1];

/** The two routes worth offering a visitor who arrived by mistake. */
const ROUTES = [
  { href: "/services", label: "Services" },
  { href: "/about", label: "About" },
] as const;

/** 24 frames a second, the way a slate counts. */
const FPS = 24;

/** `HH:MM:SS:FF` from a frame count. Zero-padded, always the same width. */
function formatTimecode(frames: number) {
  const pad = (value: number) => String(value).padStart(2, "0");
  const total = Math.max(0, Math.floor(frames));
  const seconds = Math.floor(total / FPS);
  return [
    pad(Math.floor(seconds / 3600)),
    pad(Math.floor(seconds / 60) % 60),
    pad(seconds % 60),
    pad(total % FPS),
  ].join(":");
}

export default function NotFoundStage() {
  const rootRef = useRef<HTMLElement | null>(null);
  const requestedRef = useRef<HTMLElement | null>(null);
  const timecodeRef = useRef<HTMLSpanElement | null>(null);
  const signalRef = useRef<HTMLSpanElement | null>(null);

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    /* The one fact only the browser has. Written before the first paint and
       never through React state — see the note at the top of the file. */
    const requested = requestedRef.current;
    if (requested) {
      requested.textContent = `${window.location.pathname}${window.location.search}`;
    }

    const mm = gsap.matchMedia();

    /* Everything below — the countdown, the dial, the scan line, the running
       clock — is decoration on top of a page that already reads correctly
       without any of it, so the whole build is gated on the OS preference. */
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const chars = gsap.utils.toArray<HTMLElement>("[data-error-char]", root);
      const rise = gsap.utils.toArray<HTMLElement>("[data-error-rise]", root);
      const steps = gsap.utils.toArray<HTMLElement>("[data-leader-step]", root);
      const finalStep = steps[steps.length - 1];
      const shutter = root.querySelector<HTMLElement>("[data-leader-sweep]");
      const sweep = root.querySelector<HTMLElement>("[data-error-sweep]");

      /* THE WORDS — the hero's own entrance: every character its own rise, one
         behind the next, with the supporting blocks following it in. */
      gsap.set(chars, { y: 26, opacity: 0 });
      gsap.set(rise, { y: 18, opacity: 0 });

      gsap
        .timeline({ defaults: { ease: "power3.out" } })
        .to(
          chars,
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.028,
            clearProps: "transform,opacity",
          },
          0.15,
        )
        .to(
          rise,
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            stagger: 0.09,
            clearProps: "transform,opacity",
          },
          0.42,
        );

      /* THE DIAL — 3 · 2 · 1, each frame a quick step up and away, then the code
         locked in the middle of the circle. The frames the page is not showing
         are held at zero, which is also their no-JavaScript state. */
      if (steps.length > 1) {
        gsap.set(steps, { opacity: 0, scale: 1 });

        const countdown = gsap.timeline({ delay: 0.2 });
        steps.slice(0, -1).forEach((step) => {
          countdown
            .set(step, { opacity: 1, scale: 1 })
            .to(
              step,
              { opacity: 0, scale: 1.22, duration: 0.32, ease: "power2.in" },
              "+=0.26",
            );
        });
        countdown.to(finalStep, {
          opacity: 1,
          scale: 1,
          duration: 0.7,
          ease: "power3.out",
          clearProps: "transform,opacity",
        });
      }

      /* The shutter wedge, turning inside the dial like a projector's. */
      if (shutter) {
        gsap.to(shutter, {
          rotate: 360,
          duration: 3.6,
          ease: "none",
          repeat: -1,
        });
      }

      /* THE SCAN LINE — one pass down the stage, fading in as it starts and out
         as it reaches the bottom, so the loop point is never a visible jump. */
      if (sweep) {
        gsap
          .timeline({ repeat: -1, repeatDelay: 0.5 })
          .fromTo(
            sweep,
            { top: "4%" },
            { top: "94%", duration: 6.2, ease: "none" },
            0,
          )
          .to(sweep, { opacity: 1, duration: 0.9, ease: "power2.out" }, 0)
          .to(sweep, { opacity: 0, duration: 1.1, ease: "power2.in" }, 4.6);
      }

      /* THE CLOCK — a timecode running at 24fps, written straight to the DOM:
         nothing here is React state, so the readout ticks without a re-render. */
      const readout = timecodeRef.current;
      if (readout) {
        const counter = { frames: 0 };
        gsap.to(counter, {
          frames: FPS * 60,
          duration: 24,
          ease: "none",
          repeat: -1,
          onUpdate: () => {
            readout.textContent = formatTimecode(counter.frames);
          },
        });
      }

      /* The sync lamp: on, off, on — the only thing on the page that blinks. */
      if (signalRef.current) {
        gsap.to(signalRef.current, {
          opacity: 0.15,
          duration: 0.62,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        });
      }
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      className="error-page flex min-h-[86vh] w-full items-center px-6 pt-32 pb-20 sm:px-10 lg:pt-40 lg:pb-28"
    >
      {/* THE ROOM — halo, scan lines, strip perforations and one passing scan
          line. All four are decoration, and all four are silent to a screen
          reader. */}
      <div aria-hidden className="error-page__ambient" />
      <div aria-hidden className="error-page__scanlines" />
      <div aria-hidden className="error-page__perfs" />
      <div
        aria-hidden
        className="error-page__perfs error-page__perfs--bottom"
      />
      <div aria-hidden data-error-sweep className="error-page__sweep" />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl gap-14 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-20">
        {/* THE WORDS — what happened, and where to go instead. */}
        <div className="flex flex-col items-start">
          <p className="font-body text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-smoke sm:text-xs">
            <span className="text-cta">404</span>
            <span aria-hidden className="mx-3 text-hairline">
              /
            </span>
            Signal lost
          </p>

          <DisplayHeading
            as="h1"
            lines={HEADING_LINES}
            label={HEADING_LABEL}
            accentWords={["Found"]}
            charMarker="data-error-char"
            className="mt-6 font-display text-[clamp(3.25rem,10vw,8rem)] uppercase leading-[0.85] tracking-[0.01em] text-bright"
          />

          <p
            data-error-rise
            className="mt-7 max-w-[46ch] font-body text-base leading-relaxed text-ash sm:text-lg"
          >
            This frame was never printed. The address you opened is not in the
            studio&apos;s archive — but the rest of the reel is still running.
          </p>

          <div
            data-error-rise
            className="mt-9 flex flex-wrap items-center gap-x-9 gap-y-5 sm:mt-10"
          >
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-full bg-cta px-8 py-4 font-body text-xs font-semibold uppercase tracking-[0.18em] text-cta-ink transition-[filter] duration-300 hover:brightness-[1.07] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cta sm:px-10 sm:py-4.5"
            >
              <CubeText label="Back to the top" />
            </Link>

            <ul className="flex items-center gap-x-8">
              {ROUTES.map((route) => (
                <li key={route.href}>
                  <Link
                    href={route.href}
                    className="font-body text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-ash transition-colors duration-300 hover:text-bright focus-visible:text-bright"
                  >
                    <CubeText label={route.label} />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* THE SLATE — what was asked for, against what the archive holds. */}
          <dl
            data-error-rise
            className="error-page__slate mt-12 grid w-full grid-cols-1 sm:grid-cols-2"
          >
            <div className="px-4 py-3.5 sm:px-5">
              <dt className="font-body text-[0.6rem] font-semibold uppercase tracking-[0.24em] text-smoke">
                Requested
              </dt>
              <dd
                ref={requestedRef}
                className="mt-1.5 truncate font-body text-sm text-bright"
              >
                —
              </dd>
            </div>

            <div className="border-t border-hairline px-4 py-3.5 sm:border-t-0 sm:border-l sm:px-5">
              <dt className="font-body text-[0.6rem] font-semibold uppercase tracking-[0.24em] text-smoke">
                Archive
              </dt>
              <dd className="mt-1.5 font-body text-sm text-bright">
                Reel 404 — no record
              </dd>
            </div>
          </dl>
        </div>

        {/* THE DIAL — the scene's one image, and its only countdown. */}
        <div
          aria-hidden
          data-error-rise
          className="flex flex-col items-center gap-5 justify-self-start lg:justify-self-end"
        >
          <div className="error-page__leader">
            <div data-leader-sweep className="error-page__leader-sweep" />
            <div className="error-page__leader-axis error-page__leader-axis--h" />
            <div className="error-page__leader-axis error-page__leader-axis--v" />

            {LEADER_STEPS.map((step) => (
              <span
                key={step}
                data-leader-step
                className={
                  step === FINAL_STEP
                    ? "error-page__step error-page__step--final"
                    : "error-page__step"
                }
              >
                {step}
              </span>
            ))}
          </div>

          <p className="flex items-center gap-3 font-body text-[0.65rem] uppercase tracking-[0.26em] text-smoke">
            <span ref={signalRef} className="h-1.5 w-1.5 rounded-full bg-cta" />
            <span ref={timecodeRef} className="tabular-nums text-ash">
              00:00:00:00
            </span>
            <span>No sync</span>
          </p>
        </div>
      </div>
    </section>
  );
}
