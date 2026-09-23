This is a [Next.js](https://nextjs.org) project bootstrapped with [create-next-app](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Filmarc Studios — hero experience

The landing page is built around a full-screen cinematic showreel that is
revealed by a scroll-driven wipe.

| Piece | Where |
| ----- | ----- |
| Hero structure, scroll pin, copy layers | components/HeroSection.tsx |
| Reusable video background (poster, playback, fallbacks) | components/ShowreelVideo.tsx |
| Scroll-linked wipe rectangle | components/HeroSection.tsx |
| Minimal fixed navigation | components/Navbar.tsx |
| Section the page continues into | components/StudioSection.tsx |
| Asset paths + export guidance | lib/media.ts |
| Every colour and typeface token | pp/globals.css |

How it works:

- A tall .hero-track section (300vh) contains a CSS sticky 100svh frame, so
  the hero is pinned while the track scrolls past it.
- The reel is the base layer of the hero: one <video>, mounted once, never
  remounted and never resized, playing muted/looping from the first paint. It is
  on the initial screen — there is no "reel arrives after the wipe" stage.
- A GSAP timeline drives a flat colour rectangle that scales from the centre.
  At rest it is scale(0); on scroll it grows to fill the viewport, covering the
  reel and revealing the hero content. All animation writes CSS transforms, so
  scrolling never re-renders React.
- The headline leaves, a minimal content layer arrives over the full-frame reel,
  and scrolling backwards reverses everything; after the track, normal scrolling
  continues into the next section.

### Showreel and poster assets

The reel source is declared once in lib/media.ts (REEL_SRC) and currently
points at the video that already ships in this repository:

`
public/media/samplevideo.mp4                # in use today (REEL_SRC)
public/videos/filmarc-showreel.mp4          # reserved path for the graded master
public/images/filmarc-showreel-poster.jpg   # 1920x1080 JPEG, not delivered yet
`

Change REEL_SRC — or replace the file in place — to swap reels; no component
edits are needed. See public/videos/README.md and public/images/README.md.
Until the poster lands, the hero falls back to the stage's void colour, and
prefers-reduced-motion visitors get a static frame with no pinned scroll track.

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