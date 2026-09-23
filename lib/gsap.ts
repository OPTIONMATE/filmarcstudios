"use client";

/**
 * Filmarc Studios — single GSAP entry point.
 *
 * GSAP plugins are global singletons that must be registered exactly once, and
 * only in the browser. Every scroll-animated component imports `gsap` and
 * `ScrollTrigger` from here instead of reaching into `gsap/*` directly, so the
 * registration, the config and the plugin set live in one place.
 */

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* Mobile browsers expand and collapse the URL bar while scrolling, which
   "resizes" the viewport mid-flick; ScrollTrigger would otherwise refresh -- and
   visibly jump -- on every one of them. */
ScrollTrigger.config({ ignoreMobileResize: true });

export { gsap, ScrollTrigger };
