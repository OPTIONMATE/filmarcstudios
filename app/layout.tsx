import type { Metadata } from "next";
import { Bebas_Neue, Honk, Space_Grotesk } from "next/font/google";
import SmoothScroll from "@/components/SmoothScroll";
import "./globals.css";

/* Bebas Neue — display / headings. Space Grotesk — body and UI copy. Honk — the
   footer wordmark (see components/Footer.tsx). All three are self-hosted by
   next/font and exposed to Tailwind as `font-display`, `font-body` and
   `font-wordmark` through the theme tokens in app/globals.css. */
const displayFont = Bebas_Neue({
  variable: "--font-bebas-neue",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

const bodyFont = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

/* Honk — the giant FILMARC at the foot of the page, and the only place the site
   uses it. Honk is a variable face whose only axes are `MORF` (the morph) and
   `SHLN` (the slant); the two are requested explicitly, because the wordmark's
   CSS pins both to 0. `weight` is left unset so Next treats it as the variable
   face it is — naming a static weight alongside `axes` is rejected at build
   time. next/font self-hosts the result, so there is no request to Google at
   runtime and no flash of unstyled type. */
const wordmarkFont = Honk({
  variable: "--font-honk",
  axes: ["MORF", "SHLN"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Filmarc Studios — VFX, CGI & Cinematic Post-Production",
  description:
    "Filmarc Studios is a visual effects and post-production studio crafting cinematic worlds through compositing, CGI and finishing.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${displayFont.variable} ${bodyFont.variable} ${wordmarkFont.variable} h-full antialiased`}
    >
      <body suppressHydrationWarning className="flex min-h-full flex-col bg-void font-body text-chalk">
        {/* Lenis wraps the whole document: every scroll animation on the page
            shares one smoothed scroll offset. */}
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
