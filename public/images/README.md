# Hero imagery (public/images)

| Asset path                              | Used by                                        |
| --------------------------------------- | ---------------------------------------------- |
| `/images/filmarc-showreel-poster.jpg`   | *nothing* — reserved for a future poster frame |

## Status: not delivered, and deliberately not referenced

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

