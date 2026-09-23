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

/* The hero is pinned for a long scroll distance; on mobile browsers the URL bar
   expanding/collapsing "resizes" the viewport mid-scroll and would otherwise
   force a ScrollTrigger.refresh() (and a visible jump) on every flick. */
ScrollTrigger.config({ ignoreMobileResize: true });

export { gsap, ScrollTrigger };
