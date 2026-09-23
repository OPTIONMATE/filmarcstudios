/**
 * Filmarc Studios — media manifest.
 *
 * CURRENT REEL
 * ------------
 * The hero plays the studio reel that ships in this repository:
 *
 *   public/media/samplevideo.mp4   ->  REEL_SRC below
 *
 * When the graded master is delivered, either replace that file in place or drop
 * it at the reserved path and switch `REEL_SRC` — nothing else in the app has to
 * change, no component edits:
 *
 *   /media/samplevideo.mp4       current local reel
 *   /videos/filmarc-showreel.mp4 reserved path for the graded master
 *
 * POSTER
 * ------
 * No poster frame has been delivered yet, so `poster.src` is a clearly defined
 * placeholder path. `ShowreelVideo` relies on the poster layer. A missing poster file degrades
 * silently instead of leaving a broken image on screen — just drop the file at
 * the path below to activate it.
 *
 * Export guidance for delivered files:
 * - Video: H.264 MP4, 1920x1080 (or 2560x1440), 24-30fps, no audio track
 *   required (the hero is always muted), target <= 8 MB for the first load.
 * - Poster: a single representative frame, 1920x1080 JPEG, <= 250 KB.
 */

/** The reel file the hero plays. See the notes above before changing it. */
const REEL_SRC = "/media/samplevideo.mp4";

export const SHOWREEL = {
  video: {
    src: REEL_SRC,
    type: "video/mp4",
  },
  poster: {
    src: "/images/filmarc-showreel-poster.jpg",
    alt: "Still frame from the Filmarc Studios showreel, a composited VFX shot",
  },
  /** Human-readable description used for the hero region's accessible name. */
  label: "Filmarc Studios showreel",
} as const;

export type Showreel = typeof SHOWREEL;


