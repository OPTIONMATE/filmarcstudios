"use client";

import { useEffect, useRef } from "react";

import { SHOWREEL } from "@/lib/media";

/**
 * FilmArc Studios — the hero's footage layer.
 *
 * One <video>, mounted once and never remounted: the reel fills the viewport
 * from the first paint and stays exactly where it is. The hero section owns the
 * size (it *is* the frame), this component only fills it, so the footage is as
 * wide and as tall as the hero on every breakpoint:
 *
 * - `absolute inset-0 h-full w-full object-cover` — the video covers the whole
 *   viewport, is never stretched out of aspect ratio, and is cropped from the
 *   centre rather than letterboxed;
 * - `z-0` — the scrim (`z-10`) and the copy (`z-20`) paint above it, and the
 *   fixed navbar, a sibling of the hero, above those;
 * - no border, no radius, no wrapper card: the video is the scene, and it runs
 *   behind the navbar as well, because the navbar floats over the page instead
 *   of pushing the hero down.
 *
 * PLAYBACK
 * --------
 * muted / loop / autoPlay / playsInline, so playback starts without a gesture
 * wherever the browser allows it. An IntersectionObserver pauses the reel the
 * moment the hero leaves the screen, so a large loop is not decoded while
 * nobody can see it, and it resumes when the hero scrolls back into view.
 * `muted` is also written to the DOM property before the first `play()`
 * attempt: the autoplay policy reads the property, and a refused `play()` must
 * never surface as an unhandled rejection.
 */

export default function ShowreelVideo() {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    /* The property, not just the attribute: this is what the autoplay policy
       reads, and React writes it during hydration either way. */
    video.muted = true;
    video.defaultMuted = true;

    let onScreen = true;

    /* Autoplay can still be refused (Low Power Mode, data saver, a background
       tab). There is nothing to repair: the hero's own backdrop is already
       behind the video, and the observer retries on every re-entry. */
    const play = () => {
      if (!onScreen) return;
      void video.play().catch(() => {});
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        onScreen = entry.isIntersecting;
        if (entry.isIntersecting) play();
        else video.pause();
      },
      { threshold: 0 },
    );

    observer.observe(video);

    /* Some mobile browsers only allow playback once the visitor has interacted
       with the page. One retry covers that case. */
    window.addEventListener("pointerdown", play, { once: true });

    return () => {
      observer.disconnect();
      window.removeEventListener("pointerdown", play);
    };
  }, []);

  return (
    <video
      ref={videoRef}
      className="absolute inset-0 z-0 h-full w-full object-cover"
      src={SHOWREEL.video.src}
      muted
      loop
      autoPlay
      playsInline
      preload="auto"
      disablePictureInPicture
      tabIndex={-1}
      aria-hidden
    />
  );
}
