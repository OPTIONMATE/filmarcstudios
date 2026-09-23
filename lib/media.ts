/**
 * FilmArc Studios — media manifest.
 *
 * THE REEL
 * --------
 * The hero plays the studio reel that ships in this repository:
 *
 *   public/media/samplevideo.mp4   ->  REEL_SRC below
 *
 * Swap the reel by replacing that file in place, or by pointing `REEL_SRC` at
 * the graded master and dropping it at the reserved path. Nothing else in the
 * app changes: the video element reads this one constant.
 *
 *   /media/samplevideo.mp4        current local reel
 *   /videos/filmarc-showreel.mp4  reserved path for the graded master
 *
 * Export guidance (see public/videos/README.md):
 * - H.264 MP4, 1920x1080 (or 2560x1440), 24-30fps, `-movflags +faststart`,
 *   no audio track required (the hero is always muted), target <= 8 MB.
 *
 * POSTER
 * ------
 * There is no poster frame in this manifest: no still has been delivered, and a
 * path pointing at a file that does not exist would be a guaranteed 404 on
 * every load. The hero therefore paints its own void colour plus the
 * `hero-scrim` tint while the first frames decode. When a still is delivered,
 * add it here and pass it to the video's `poster` attribute in
 * components/ShowreelVideo.tsx — one entry, one component.
 */

/** The reel the hero plays. See the notes above before changing it. */
const REEL_SRC = "/media/samplevideo.mp4";

export const SHOWREEL = {
  video: {
    src: REEL_SRC,
  },
} as const;

export type Showreel = typeof SHOWREEL;
