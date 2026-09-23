"use client";

import { useEffect, useRef } from "react";

import { SHOWREEL } from "@/lib/media";

/**
 * Filmarc Studios - the hero's footage layer.
 *
 * One <video>, mounted once, never resized and never remounted: the reel fills
 * the viewport from the first paint, behind the headline, and stays exactly
 * where it is for the whole pinned sequence (the pin, not this component, is
 * what holds it still).
 *
 * Playback:
 * - muted / loop / autoPlay / playsInline, so it starts without a gesture
 *   wherever the browser allows it;
 * - an IntersectionObserver pauses it the moment the hero leaves the screen,
 *   so a 1080p loop is not decoded while nobody can see it, and resumes when
 *   it scrolls back into view.
 *
 * Layers, bottom to top:
 *   1. the poster still - a CSS background path declared once in lib/media.ts;
 *   2. the <video>      - transparent until its first frame lands, so the poster
 *                         below covers loading, a missing file and a refused
 *                         autoplay alike. Before the poster is delivered, the
 *                         stage's void colour fills the frame.
 * The poster is painted as a CSS background rather than passed to the `poster`
 * attribute: the same frame, one request instead of two, and a still that has
 * not been delivered yet degrades into the stage's void colour instead of an
 * empty frame.
 */

export default function ShowreelVideo({ className }: { className?: string }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        if (entry.isIntersecting) {
          /* Autoplay can still be refused (low-power mode, data saver). The
              poster frame is already painted behind the video, so there is
              nothing to repair - just no playback. */
          void video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { threshold: 0 },
    );

    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={className ?? "absolute inset-0"}>
      <div
        aria-hidden
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${SHOWREEL.poster.src})` }}
      />
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
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
    </div>
  );
}
