/**
 * FILMARC STUDIOS — projects data.
 *
 * Single source of truth for the Projects section
 * (components/Home/ProjectsSection.tsx). Titles and groupings come verbatim
 * from the studio deck (filmarc.pdf); nothing here is invented — no loglines,
 * dates, clients or credits beyond what the deck states.
 *
 * Groups:
 * - "latest"     Latest Movies — VFX Supervision (2026)
 * - "completed"  Completed Project
 * - "ongoing"    Ongoing Projects
 * - "lab"        Other Work From The Showreel (motion posters, trailers,
 *                pipeline experiments and AI demos)
 *
 * A project can belong to exactly one group. "Latest" ordering is the deck's
 * explicit featured order (Mahakali → Adhira → Jai Hanuman), not a date sort.
 *
 * Imagery: the repository ships no per-project stills (public/ holds leader
 * portraits, discipline stills, the logo and the reel only), so projects carry
 * `image: null` and the section renders a typographic treatment instead of a
 * borrowed poster. When a graded still is delivered, drop it under
 * public/images/projects/ and point `image` at it — nothing else changes.
 */

export type ProjectGroup = "latest" | "completed" | "ongoing" | "lab";

export type SupervisorArtwork =
  | "mahakali"
  | "adhira"
  | "jai-hanuman"
  | "bhagavanthudu"
  | "jangaa"
  | "dharma";

export interface Project {
  id: string;
  title: string;
  group: ProjectGroup;
  /** Deck-given context line, e.g. the supervision credit. Null when the deck gives none. */
  context: string | null;
  /** Path under public/ once a still is delivered. Null until then. */
  image: string | null;
  alt: string;
  /** Geometric line-art variant rendered by SupervisorCard. Null for non-poster rows. */
  artwork: SupervisorArtwork | null;
}

export const PROJECTS: readonly Project[] = [
  // ——— Latest Movies — VFX Supervision (2026) ———
  {
    id: "mahakali",
    title: "Mahakali",
    group: "latest",
    context: "VFX Supervision ",
    image: null,
    alt: "Mahakali — VFX supervision",
    artwork: "mahakali",
  },
  {
    id: "adhira",
    title: "Adhira",
    group: "latest",
    context: "VFX Supervision ",
    image: null,
    alt: "Adhira — VFX supervision",
    artwork: "adhira",
  },
  {
    id: "jai-hanuman",
    title: "Jai Hanuman",
    group: "latest",
    context: "VFX Supervision",
    image: null,
    alt: "Jai Hanuman — VFX supervision",
    artwork: "jai-hanuman",
  },
  // ——— Completed Project ———
  {
    id: "paradise",
    title: "the Paradise",
    group: "completed",
    context: "Completed",
    image: null,
    alt: "Paradise — completed production",
    artwork: null,
  },
  // ——— Ongoing Projects ———
  {
    id: "bhagavanthudu",
    title: "Bhagavanthudu",
    group: "ongoing",
    context: "In Production",
    image: null,
    alt: "Bhagavanthudu — in production",
    artwork: "bhagavanthudu",
  },
  {
    id: "jangaa",
    title: "Jangaa",
    group: "ongoing",
    context: "In Production",
    image: null,
    alt: "Jangaa — in production",
    artwork: "jangaa",
  },
  {
    id: "dharma-yodha-sri-krishna",
    title: "Dharma Yodha Sri Krishna",
    group: "ongoing",
    context: "In Production",
    image: null,
    alt: "Dharma Yodha Sri Krishna — in production",
    artwork: "dharma",
  },

];
