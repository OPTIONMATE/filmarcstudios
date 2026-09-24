"use client";

import { useRef } from "react";

import { gsap } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";

export interface CubeTextProps {
  /** The visible label. An identical copy is rendered for the flip. */
  label: string;
  /** Extra classes merged onto the perspective wrapper (sizing tweaks only). */
  className?: string;
  /** Perspective distance in px. Defaults to 600. */
  perspective?: number;
  /** Flip duration in seconds. Defaults to 0.52 (within the 450–600ms spec). */
  duration?: number;
}

/**
 * FilmArc Studios — the 3D cube-style text flip.
 *
 * A seamless mechanical flip around the horizontal axis: the visible line
 * rotates away over the top edge while an identical copy rotates in from
 * below, like two faces of one cube.
 *
 * STRUCTURE (all spans, so it can live inside <a> or <button>):
 *
 *   <span cube-text>            perspective wrapper (inline-block)
 *     <span cube-viewport>      overflow-hidden clipping window
 *       <span cube-face front>  in-flow: defines the viewport's dimensions
 *       <span cube-face back>   absolute inset-0: the identical copy
 *
 * MOTION (one paused GSAP timeline per instance):
 *
 *   front  yPercent 0 → -100,  rotationX 0 → -70   (origin 50% 100%)
 *   back   yPercent 100 → 0,   rotationX 70 → 0    (origin 50% 0%)
 *
 * Both faces move together on a single `power3.inOut` tween, so there is one
 * source of truth per text element and no competing timelines. The timeline
 * is played on hover / keyboard focus of the closest interactive ancestor
 * (so a button's padding also flips its label) and reversed on leave / blur.
 *
 * ACCESSIBILITY + SAFETY:
 * - the copy is `aria-hidden` and never announced twice;
 * - `prefers-reduced-motion: reduce` renders the static label, no timeline;
 * - touch devices never need hover: the label is always legible and clickable;
 * - the animation never touches the parent: the button background, click
 *   handlers, hrefs and focus outlines are owned by the ancestor;
 * - `will-change` is applied only while the timeline is active.
 */
export default function CubeText({
  label,
  className = "",
  perspective = 600,
  duration = 0.52,
}: CubeTextProps) {
  const rootRef = useRef<HTMLSpanElement | null>(null);
  const frontRef = useRef<HTMLSpanElement | null>(null);
  const backRef = useRef<HTMLSpanElement | null>(null);

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    const front = frontRef.current;
    const back = backRef.current;
    if (!root || !front || !back) return;

    /* The interactive ancestor owns the hover area: a pill button's padding
       flips its label, and moving between nested spans never re-fires. */
    const trigger =
      root.parentElement?.closest("a,button") ?? (root as HTMLElement);

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    /* Reduced motion: leave the CSS static state alone — front visible, copy
       parked below the clip — and never build a timeline. */
    if (reduced.matches) return;

    const ctx = gsap.context(() => {
      gsap.set(root, { perspective });
      gsap.set(front, {
        /* y: 0 wipes the px value GSAP parses from the computed CSS transform
           so yPercent is the single source of truth (no double offset). */
        y: 0,
        yPercent: 0,
        rotationX: 0,
        transformOrigin: "50% 100%",
        backfaceVisibility: "hidden",
        force3D: true,
      });
      gsap.set(back, {
        /* The CSS fallback parks the copy with translateY(100%). Its computed
           matrix reads back as y px — without y: 0 here the face would sit at
           y(px) + yPercent(100%) = 200% and, after the flip, settle at
           y(px) + yPercent(0%) = 100%: still below the clip, so nothing ever
           "comes down". Resetting y keeps start = 100% and end = 0%. */
        y: 0,
        yPercent: 100,
        rotationX: 70,
        transformOrigin: "50% 0%",
        backfaceVisibility: "hidden",
        force3D: true,
      });

      const timeline = gsap.timeline({
        paused: true,
        defaults: { ease: "power3.inOut", duration },
      });
      timeline.to(
        front,
        { yPercent: -100, rotationX: -70, willChange: "transform" },
        0,
      );
      timeline.to(
        back,
        { yPercent: 0, rotationX: 0, willChange: "transform" },
        0,
      );

      const play = () => {
        /* Touch pointers fire mouseenter alongside taps; never block or delay
           the tap — the flip is decorative and the click proceeds regardless. */
        timeline.play();
      };
      const reverse = () => {
        timeline.reverse();
      };
      /* Clearing will-change when fully settled keeps the compositor free for
         the hero reel; mid-flight reversals re-assert it on the next play. */
      const clearWillChange = () => {
        if (!timeline.isActive()) {
          gsap.set([front, back], { willChange: "auto" });
        }
      };
      timeline.eventCallback("onReverseComplete", clearWillChange);
      timeline.eventCallback("onComplete", clearWillChange);

      trigger.addEventListener("mouseenter", play);
      trigger.addEventListener("mouseleave", reverse);
      trigger.addEventListener("focusin", play);
      trigger.addEventListener("focusout", reverse);

      return () => {
        trigger.removeEventListener("mouseenter", play);
        trigger.removeEventListener("mouseleave", reverse);
        trigger.removeEventListener("focusin", play);
        trigger.removeEventListener("focusout", reverse);
        timeline.kill();
      };
    }, root);

    return () => ctx.revert();
  }, [perspective, duration]);

  return (
    <span
      ref={rootRef}
      data-cube-text
      className={`cube-text ${className}`}
      style={{ perspective }}
    >
      <span className="cube-text__viewport">
        <span ref={frontRef} data-cube-face="front" className="cube-text__face">
          {label}
        </span>
        <span
          ref={backRef}
          data-cube-face="back"
          aria-hidden="true"
          className="cube-text__face cube-text__face--copy"
        >
          {label}
        </span>
      </span>
    </span>
  );
}
