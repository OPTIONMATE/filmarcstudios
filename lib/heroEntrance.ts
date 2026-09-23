/**
 * FilmArc Studios — the hero entrance's one contract.
 *
 * The entrance is a single GSAP timeline split across two components
 * (components/Home/HeroSection.tsx animates the copy, components/Navbar.tsx the
 * bar), but its *opening frame* has to exist long before either of them runs:
 * the server's HTML is painted the moment it arrives, and React hydrates
 * afterwards. An opening frame declared in JavaScript is therefore an opening
 * frame declared too late — the visitor sees the finished design first, then
 * watches it snap back to the beginning and animate in again.
 *
 * So every element the entrance animates carries `data-hero-enter` in the
 * markup, and app/globals.css holds exactly those elements at `opacity: 0` —
 * under the two conditions in which the entrance will actually run:
 *
 *   - `scripting: enabled`, so a visitor without JavaScript is never left with a
 *     hidden hero: the marker simply does nothing for them;
 *   - `prefers-reduced-motion: no-preference`, the same query both components
 *     pass to `gsap.matchMedia()`, so a reduced-motion visitor gets the static
 *     hero rather than a hero that never appears.
 *
 * The first frame the browser paints is then the animation's own opening frame.
 *
 * `releaseEntrance()` is the other half of the handoff, called by both
 * components at the top of their layout effect, immediately after `gsap.set()`
 * has asserted that same opening frame on the same elements:
 *
 *   gsap.set(targets, { opacity: 0, y: 24 });  // before the next paint
 *   releaseEntrance(targets);                  // the stylesheet lets go
 *   timeline.to(targets, { opacity: 1, y: 0 }); // GSAP now owns both properties
 *
 * From that moment the cascade has no declaration left that could fight the
 * timeline for an element's opacity or transform, and each timeline ends with
 * `clearProps`, handing the properties back to CSS — with nothing waiting there
 * to hide them again.
 *
 * Keep `data-hero-enter` in step across this file, every component that uses it
 * (the hero, the navbar, and the intro's own cast) and app/globals.css: they are
 * halves of the same handoff. The intro's bootstrap script releases the same
 * marker if the app never arrives (components/Intro/FilmArcIntro.tsx).
 */

/** The marker that pairs an element with the stylesheet's entrance pre-state. */
export const ENTRANCE_MARKER = "data-hero-enter";

/**
 * Hands elements over to the timelines: removing the marker takes them out of
 * the stylesheet's pre-state, so nothing can hide them once the entrance has
 * settled.
 */
export function releaseEntrance(elements: readonly Element[]): void {
  for (const element of elements) element.removeAttribute(ENTRANCE_MARKER);
}
