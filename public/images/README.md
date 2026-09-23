# Hero imagery (public/images)

| Asset path                              | Used by                                        |
| --------------------------------------- | ---------------------------------------------- |
| `/images/filmarc-showreel-poster.jpg`   | `components/ShowreelVideo.tsx` (poster frame)  |

## Status: not delivered yet

The hero already plays the reel (`lib/media.ts` → `REEL_SRC`); the poster frame is
still outstanding, so this path is a placeholder. It is declared once in
`lib/media.ts` (`SHOWREEL.poster.src`) and is used for:

- the `<video poster>` attribute — what the visitor sees while the clip loads;
- a background layer behind the video — what the visitor sees if playback fails.

Because it is painted as a CSS background, a missing file degrades silently to
the stage's void colour — no broken
image icon, no layout shift. Nothing in the code needs editing once the file
lands here.

## Export guidance

| Property | Recommended                                  |
| -------- | -------------------------------------------- |
| Format   | JPEG (progressive)                           |
| Size     | 1920x1080 (16:9)                             |
| Weight   | <= 250 KB                                    |
| Frame    | a representative, cinematic showreel frame   |

## Colour and typography

All colour comes from the tokens in `app/globals.css`. No image asset should be
the only carrier of a brand colour — flat colour swatches should carry the brand when no image is available

