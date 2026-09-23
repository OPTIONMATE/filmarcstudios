/**
 * Filmarc Studios — the fixed navigation.
 *
 * Server-rendered on purpose: it holds no state and no handlers. Anchor clicks
 * are handled by Lenis (`anchors: true`, see components/SmoothScroll.tsx), so the
 * page keeps its eased scrolling when a link is used; the target sections carry
 * the matching `scroll-mt-*` so the fixed bar never covers a heading.
 *
 * It sits at `z-50`, above the hero's animation layer, so the bar stays legible
 * while the rectangle covers the stage.
 */

const LINKS = [{ href: "#showreel", label: "Reel" }] as const;

export default function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <nav
        aria-label="Primary"
        className="mx-auto flex h-16 w-full max-w-[100rem] items-center justify-between px-6 lg:h-20 lg:px-12"
      >
        <a
          href="#showreel"
          className="font-display text-2xl uppercase tracking-[0.16em] text-chalk transition-colors hover:text-ash lg:text-3xl"
        >
          Filmarc
        </a>
        <ul className="flex items-center gap-6 font-body text-[0.65rem] uppercase tracking-[0.3em] text-ash sm:gap-10 sm:text-xs">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="transition-colors hover:text-chalk focus-visible:text-chalk"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}


