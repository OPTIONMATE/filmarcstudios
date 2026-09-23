# Showreel video (public/videos)

The hero plays **one** video file. Its source is declared once in `lib/media.ts`
(`REEL_SRC`) and consumed by `components/ShowreelVideo.tsx`.

| Asset path                     | Status                                  |
| ------------------------------ | --------------------------------------- |
| `/media/samplevideo.mp4`       | **in use** — the reel that ships today   |
| `/videos/filmarc-showreel.mp4` | reserved path for the graded master      |

## Switching the reel

Change `REEL_SRC` in `lib/media.ts` to point at the current master, or replace
the file in `public/media/` in place. Nothing else in the app changes: the video
element, the poster and the reveal animation all read from that one constant.

## Export guidance

Keep the reel web-optimised:

| Property   | Recommended                                 |
| ---------- | ------------------------------------------- |
| Codec      | H.264 (Baseline/Main profile) in an MP4 box |
| Size       | 1920x1080 (or 2560x1440 for a 2K master)    |
| Frame rate | 24-30 fps                                   |
| Audio      | none needed — the hero is always muted      |
| Bitrate    | 4-8 Mbps, target <= 8 MB total              |
| Faststart  | yes (`-movflags +faststart` when encoding)  |

Nothing else in the app needs changing: the same path is used for autoplay, loop,
muted and `playsInline` playback, and the reveal mask simply clips the footage.

## Behaviour

- Autoplay / loop / muted / `playsInline`; never relies on audio.
- Decoded only while the hero is on screen (paused when scrolled past).
- The poster frame (`/images/filmarc-showreel-poster.jpg`) covers loading, and
  the stage's void colour covers a missing or unplayable file.

