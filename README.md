This is a [Next.js](https://nextjs.org) project bootstrapped with [create-next-app](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Filmarc Studios — the hero

The landing page opens on one immersive scene: the studio reel plays full-bleed
behind a transparent navbar, a bold condensed headline, one line of copy and a
single yellow call to action.

| Piece | Where |
| ----- | ----- |
| Hero scene (layering, copy, entrance timeline) | components/Home/HeroSection.tsx |
| Full-bleed background reel | components/ShowreelVideo.tsx |
| Transparent navbar + mobile menu | components/Navbar.tsx |
| Section the page continues into | components/Home/Section2.tsx |
| Asset paths + export guidance | lib/media.ts |
| Every colour and typeface token | pp/globals.css |

How it works:

- One `min-h-svh` section holds the whole scene. Its layers, bottom to top: the
  reel (`ShowreelVideo`), the scrim (`hero-scrim`, declared in app/globals.css),
  the copy, and — outside the section, fixed at `z-50` — the navbar.
- The reel is the base layer: one `<video>`, mounted once, never remounted and
  never resized, covering the viewport with `object-cover` and playing
  muted/looping from the first paint. The navbar floats over it instead of
  pushing it down, and the video is never framed in a card or a rounded box.
- The copy — condensed display headline, one sentence, the yellow CTA — is
  centred on the viewport, with padding that keeps it clear of the bar.
- A single GSAP entrance timeline reveals the headline lines, then the
  description, then the CTA. It is built inside `gsap.matchMedia()` under
  "(prefers-reduced-motion: no-preference)" and reverted on cleanup, so
  reduced-motion visitors get the static hero and StrictMode cannot leave a
  duplicate timeline behind. The copy carries no hidden resting state in the
  markup: with animation disabled it is simply visible.

### Showreel assets

The reel source is declared once in lib/media.ts (REEL_SRC) and currently
points at the video that already ships in this repository:

```
public/media/samplevideo.mp4                # in use today (REEL_SRC)
public/videos/filmarc-showreel.mp4          # reserved path for the graded master
```

Change REEL_SRC — or replace the file in place — to swap reels; no component
edits are needed. See public/videos/README.md and public/images/README.md.

There is no poster frame in the manifest: no still has been delivered, and a
path pointing at a file that does not exist would 404 on every load. The hero
paints its own void colour plus the scrim while the first frames decode.

## Getting Started

First, run the development server:

`ash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying pp/page.tsx. The page auto-updates as you edit the file.

This project uses [
ext/font](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about the Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.