import type { Metadata } from "next";
import { Bebas_Neue, Space_Grotesk } from "next/font/google";
import SmoothScroll from "@/components/SmoothScroll";
import "./globals.css";

/* Bebas Neue — display / headings. Space Grotesk — body and UI copy.
   Both are self-hosted by next/font and exposed to Tailwind as `font-display`
   and `font-body` through the theme tokens in app/globals.css. */
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

export const metadata: Metadata = {
  title: "Filmarc Studios — VFX, CGI & Cinematic Post-Production",
  description:
    "Filmarc Studios is a visual effects and post-production studio crafting cinematic worlds through compositing, CGI and finishing.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" suppressHydrationWarning className={`${displayFont.variable} ${bodyFont.variable} h-full antialiased`}>
      <body suppressHydrationWarning className="flex min-h-full flex-col bg-void font-body text-chalk">
        {/* Lenis wraps the whole document: every scroll animation on the page
            shares one smoothed scroll offset. */}
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
