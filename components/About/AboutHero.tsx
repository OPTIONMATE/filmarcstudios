"use client";

import { useRef } from "react";
import CubeText from "@/components/CubeText";
import { DisplayHeading } from "@/components/DisplayHeading";
import { gsap } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";

const HEADLINE_LINES = [
  ["Architects", "of"],
  ["The", "Impossible"],
] as const;

export default function AboutHero() {
  const rootRef = useRef<HTMLElement | null>(null);
  const descRef = useRef<HTMLParagraphElement | null>(null);
  const ctaRef = useRef<HTMLAnchorElement | null>(null);

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const chars = gsap.utils.toArray<HTMLElement>(
        "[data-about-hero-char]",
        root,
      );

      gsap.set(chars, { y: 24, opacity: 0 });
      if (descRef.current) gsap.set(descRef.current, { y: 18, opacity: 0 });
      if (ctaRef.current) gsap.set(ctaRef.current, { y: 16, opacity: 0 });

      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.to(chars, {
        y: 0,
        opacity: 1,
        duration: 0.68,
        stagger: 0.026,
        clearProps: "transform,opacity",
      }, 0.15);

      if (descRef.current) {
        tl.to(
          descRef.current,
          {
            y: 0,
            opacity: 1,
            duration: 0.7,
            clearProps: "transform,opacity",
          },
          "-=0.4",
        );
      }

      if (ctaRef.current) {
        tl.to(
          ctaRef.current,
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            clearProps: "transform,opacity",
          },
          "-=0.35",
        );
      }
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={rootRef}
      className="relative flex min-h-[82vh] w-full flex-col justify-center overflow-hidden bg-void px-6 pt-32 pb-20 sm:px-10 lg:pt-40 lg:pb-28"
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col items-start">
        {/* Eyebrow rail */}
        <p className="font-body text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-smoke sm:text-xs">
          <span className="text-cta">01</span>
          <span aria-hidden className="mx-3 text-hairline">
            /
          </span>
          Who We Are
        </p>

        {/* Hero Display Heading */}
        <DisplayHeading
          as="h1"
          lines={HEADLINE_LINES}
          label="Architects of The Impossible"
          accentWords={["Impossible"]}
          charMarker="data-about-hero-char"
          className="mt-6 font-display text-8xl uppercase leading-[0.85] tracking-[0.01em] text-bright"
        />

        {/* Description */}
        <p
          ref={descRef}
          className="mt-8 max-w-[54ch] font-body text-xl leading-relaxed text-ash sm:mt-10"
        >
          FILMARC is an independent visual effects and cinematic post-production
          studio. We fuse cutting-edge visual technology with auteur-level
          storytelling to craft uncompromised images for international feature
          films, visionary directors, and forward-thinking brands.
        </p>

        {/* CTA */}
        <a
          ref={ctaRef}
          href="mailto:hello@filmarc.studio"
          className="mt-10 inline-flex items-center justify-center rounded-full bg-cta px-8 py-4 font-body text-xs font-semibold uppercase tracking-[0.18em] text-cta-ink transition-[filter] duration-300 hover:brightness-[1.07] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cta sm:mt-12 sm:px-10 sm:py-4.5"
        >
          <CubeText label="Initiate Project" />
        </a>
      </div>
    </section>
  );
}
