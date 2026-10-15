"use client";

import { useRef } from "react";
import CubeText from "@/components/CubeText";
import { DisplayHeading } from "@/components/DisplayHeading";
import BubbleField from "@/components/Services/BubbleField";
import { gsap } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";

const HERO_LINES = [["Our", "Services"]] as const;
const CTA_LINES = [["Have", "A"], ["Project", "Ahead?"]] as const;

export default function ServicesContent() {
  const rootRef = useRef<HTMLElement | null>(null);

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const heroChars = gsap.utils.toArray<HTMLElement>("[data-services-hero-char]", root);
      gsap.set(heroChars, { y: 22, opacity: 0 });
      gsap.to(heroChars, {
        y: 0, opacity: 1, duration: 0.65, stagger: 0.026,
        ease: "power3.out", clearProps: "transform,opacity",
      });
      const field = root.querySelector("[data-bubble-field]");
      if (field) {
        gsap.from(field, {
          y: 32, opacity: 0, duration: 0.9, ease: "power3.out",
          delay: 0.25, clearProps: "transform,opacity",
        });
      }
    });
    return () => mm.revert();
  }, []);

  return (
    <section ref={rootRef} className="relative w-full bg-void px-6 pt-32 pb-24 sm:px-10 lg:pt-40 lg:pb-32">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <p className="font-body text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-smoke sm:text-xs">
            <span className="text-cta">01</span>
            <span aria-hidden className="mx-3 text-hairline">/</span>
            Disciplines
          </p>
          <DisplayHeading
            as="h1"
            lines={HERO_LINES}
            label="Our Services"
            accentWords={["Services"]}
            charMarker="data-services-hero-char"
            className="mt-6 text-center font-display text-[clamp(2.75rem,8.5vw,7.5rem)] uppercase leading-[0.85] tracking-[0.01em] text-bright whitespace-nowrap"
          />
        </div>
        <div data-bubble-field className="mt-16 sm:mt-20">
          <BubbleField />
        </div>
        <div className="mt-20 sm:mt-28">
          <div className="flex flex-col items-start justify-between gap-8 rounded-2xl border border-hairline bg-ink/70 p-8 sm:p-12 md:flex-row md:items-center">
            <div>
              <DisplayHeading
                as="h2"
                lines={CTA_LINES}
                label="Have A Project Ahead?"
                accentWords={["Ahead?"]}
                className="font-display text-[clamp(2.2rem,5vw,4.2rem)] uppercase leading-[0.88] tracking-[0.01em] text-bright"
              />
              <p className="mt-3 max-w-[46ch] font-body text-sm leading-relaxed text-ash sm:text-base">
                Whether you need a dedicated VFX pipeline or end-to-end screen
                production, our studio is ready to build it.
              </p>
            </div>
            <a
              href="mailto:info@filmarcstudios.com"
              className="inline-flex shrink-0 items-center justify-center rounded-full bg-cta px-8 py-4 font-body text-xs font-semibold uppercase tracking-[0.18em] text-cta-ink transition-[filter] duration-300 hover:brightness-[1.07] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cta sm:px-10 sm:py-4.5"
            >
              <CubeText label="Start a project" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
