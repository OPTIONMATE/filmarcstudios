/**
 * FILMARC STUDIOS — Core Capabilities data (homepage).
 *
 * Single source of truth for the Core Capabilities section
 * (components/Home/CoreCapabilitiesSection.tsx). Titles and descriptions are
 * verbatim from the studio brief — do not reword them here.
 *
 * Imagery: every `image` / `icon` points at a file that ships in this
 * repository (public/images/services/), so the section depends on no
 * third-party host. The brief's `/images/on-site-vfx-supervision.webp` and
 * `/images/icons/*.webp` paths do not exist in the repo, so they are mapped
 * to the closest delivered stills below.
 */

export interface CoreCapability {
  id: number;
  title: string;
  description: string;
  /** Square thumbnail rendered at ~80px; keep the subject centre-cropped. */
  icon: string;
  /** Accessible description for the thumbnail. */
  alt: string;
}

export interface CoreCapabilitiesData {
  id: string;
  eyebrow: string;
  title: string;
  year: string;
  featured: {
    title: string;
    description: string;
    image: string;
    alt: string;
  };
  capabilities: readonly CoreCapability[];
}

export const coreCapabilities: CoreCapabilitiesData = {
  id: "core-capabilities",
  eyebrow: "WHAT WE DO",
  title: "Core Capabilities",
  year: "2026",
  featured: {
    title: "On-Site VFX Supervision",
    description:
      "Experienced supervision on set, so every VFX shot is planned, captured and handed over right.",
    image: "/images/services/onset-vfx-supervision.jpg",
    alt: "On-set VFX supervision — camera crew planning a visual-effects shot on location",
  },
  capabilities: [
    {
      id: 1,
      title: "VFX / CGI",
      description:
        "Cinematic digital environments, effects and visual storytelling.",
      icon: "/images/services/vfx-cgi.png",
      alt: "Cinematic CGI environment thumbnail",
    },
    {
      id: 2,
      title: "AI-Assisted VFX",
      description:
        "AI-supported workflows for visualization and VFX production.",
      icon: "/images/services/ai-vfx.jpg",
      alt: "AI-assisted visual effects workflow thumbnail",
    },
    {
      id: 3,
      title: "AI Filmmaking",
      description: "AI-assisted visual development and content creation.",
      icon: "/images/services/vfx.jpg",
      alt: "AI-assisted filmmaking and visual development thumbnail",
    },
    {
      id: 4,
      title: "Rotoscopy / Paint / Matchmove",
      description: "Precision technical work supporting complex VFX shots.",
      icon: "/images/services/rotoscopy.png",
      alt: "Rotoscopy and matchmove precision work thumbnail",
    },
    {
      id: 5,
      title: "Previsualization",
      description:
        "Visualize sequences before committing major production resources.",
      icon: "/images/services/screen-production.jpg",
      alt: "Previsualization of a sequence before production thumbnail",
    },
  ],
};
