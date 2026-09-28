# Imagery (public/images)

| Asset path                              | Used by                                          |
| --------------------------------------- | ------------------------------------------------ |
| `/images/services/vfx.jpg`              | Services page — VFX & Compositing                |
| `/images/services/cgi.jpg`              | Services page — CGI & Lookdev                    |
| `/images/services/2d-animation.jpg`     | Services page — 2D Animation                     |
| `/images/services/3d-motion.jpg`        | Services page — 3D Motion Design                 |
| `/images/services/screen-production.jpg`| Services page — Screen Production                |
| `/images/filmarc-showreel-poster.jpg`   | *nothing* — reserved for a future poster frame   |

## Services stills (public/images/services)

Five stills, one per discipline. They are declared once, per service, in
`components/Home/services.ts` (`image`) and rendered by
`components/Services/ServicesContent.tsx`; that page needs no other change when a
still is replaced.

**They are served from this repository, not from a third-party host.** An earlier
pass pointed `next/image` at `https://images.unsplash.com/...` URLs, which needs
`images.remotePatterns` in `next.config.ts` and puts a stock-photo CDN on the
critical path of the studio's own showcase — one of those five URLs had already
gone 404, which is what a hotlinked placeholder eventually does. Local paths need
no config, are optimised by `next/image` at build time, and can never break
because someone else's library changed.

### Swapping a still

1. Export at the sizes below and drop the file over the same name (or add a new
   one and update `image` in `components/Home/services.ts`).
2. Nothing else changes: the frame's aspect ratio, grade and hover are owned by
   `ServicesContent.tsx`.

| Property | Recommended                                                       |
| -------- | ----------------------------------------------------------------- |
| Format   | JPEG (progressive)                                                 |
| Size     | 1400x875 (16:10 — matches the frame's `aspect-[16/10]`)            |
| Weight   | <= 150 KB (the five in the repo today total ~296 KB)               |
| Crop     | the subject readable at the 16:10 centre; the frame crops, not pads |

### What these files are today

Placeholders, honestly: cinematic stock frames from Unsplash (the
[Unsplash License](https://unsplash.com/license) allows commercial use with no
attribution required). They exist so the showcase is real rather than empty while
graded stills are produced, and they are listed here so they can be traced and
replaced:

| File                    | Source photo id                     |
| ----------------------- | ----------------------------------- |
| `vfx.jpg`               | `photo-1478720568477-152d9b164e26`  |
| `cgi.jpg`               | `photo-1620121692029-d088224ddc74`  |
| `2d-animation.jpg`      | `photo-1634017839464-5c339ebe3cb4`  |
| `3d-motion.jpg`         | `photo-1618172193763-c511deb635ca`  |
| `screen-production.jpg` | `photo-1524985069026-dd778a71c7b4`  |

## Colour and typography

All colour comes from the tokens in `app/globals.css`. No image asset should be
the only carrier of a brand colour — flat colour swatches should carry the brand
when no image is available. `ServicesContent.tsx` applies a grade of its own
(grayscale, lifting to colour on hover), so a still is never the page's only
source of a hue.

## Hero poster (reserved)

### Status: not delivered, and deliberately not referenced

The hero plays the reel (`lib/media.ts` → `REEL_SRC`) directly, and no still has
been delivered. `lib/media.ts` therefore declares **no** poster path and
`components/ShowreelVideo.tsx` renders no poster layer: a path pointing at a file
that does not exist would 404 on every load, for a frame nobody would see anyway.

What the visitor sees while the first frames decode:

- the hero section's own background (`bg-void`), and
- the `hero-scrim` tint layered over it (app/globals.css).

## Adding the poster back

1. Drop a still at the path above.
2. Add it to `SHOWREEL` in `lib/media.ts`.
3. Pass it to the video's `poster` attribute in `components/ShowreelVideo.tsx`.

## Export guidance (poster)

| Property | Recommended                                  |
| -------- | -------------------------------------------- |
| Format   | JPEG (progressive)                           |
| Size     | 1920x1080 (16:9)                             |
| Weight   | <= 250 KB                                    |
| Frame    | a representative, cinematic showreel frame   |


