"use client";

/**
 * FilmArc Studios - the gate between the intro and the page's own entrance.
 *
 * The intro (components/Intro/FilmArcIntro.tsx) owns the viewport for ~3.6s.
 * The hero (components/Home/HeroSection.tsx) and the navbar
 * (components/Navbar.tsx) each own an entrance timeline. With nothing linking
 * the two, the page's copy would play its entrance *behind* a closed curtain --
 * spent, invisible, and over by the time the panels part -- and the visitor
 * would meet two separate introductions instead of one.
 *
 * So the two sides of the same introduction talk through this module, and only
 * through this module. Each of them still owns its own motion; neither reaches
 * across the tree by selector:
 *
 *   intro   holdEntranceGate()              mounted: the page waits for me
 *           openEntranceGate()              the panels are parting: go
 *
 *   hero    whenEntranceGateOpens(start)
 *   navbar  whenEntranceGateOpens(start)
 *
 * `openEntranceGate()` is idempotent, and a subscriber that arrives after it has
 * opened starts on the spot. So the entrance can never be lost to a mount order,
 * it can never be started twice, and on a page with no intro the gate is open
 * from the start: the hero and the navbar begin exactly when they always did.
 *
 * The state is deliberately module-level and tiny -- a signal, not application
 * state -- so it can be read and written synchronously from a layout effect,
 * before the browser paints.
 */

/** Open by default: a page that has no intro must not have to say so. */
let open = true;

/** The entrance timelines held back while the intro is on screen. */
const waiting = new Set<() => void>();

/** Closes the gate: the intro is on screen and owns the next few seconds. */
export function holdEntranceGate(): void {
  open = false;
}

/**
 * Opens the gate and starts everything waiting on it.
 *
 * Safe to call more than once, and safe to call when nothing is waiting: the
 * intro calls it the moment its panels begin to part, and again when it ends,
 * because a page whose entrance never starts is a page with a missing hero.
 */
export function openEntranceGate(): void {
  if (open) return;

  open = true;

  /* Copied, because a callback is allowed to unsubscribe while it runs. */
  for (const start of [...waiting]) start();
  waiting.clear();
}

/**
 * Runs `start` as soon as the gate opens -- immediately if it is already open --
 * and returns the unsubscriber a layout effect hands back to React.
 */
export function whenEntranceGateOpens(start: () => void): () => void {
  if (open) {
    start();
    return () => {};
  }

  waiting.add(start);

  return () => {
    waiting.delete(start);
  };
}
