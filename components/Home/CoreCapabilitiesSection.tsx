"use client";

import Image from "next/image";
import { useRef } from "react";

import { DisplayHeading } from "@/components/DisplayHeading";
import { coreCapabilities } from "@/components/Home/coreCapabilities";
import { gsap } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";

const HEADING_LINES = [["Core", "Capabilities"]] as const;

export default function CoreCapabilitiesSection() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const chars = gsap.utils.toArray<HTMLElement>(
        "[data-core-cap-char]",
        section,
      );
      const eyebrow = gsap.utils.toArray<HTMLElement>(
        "[data-core-cap-eyebrow]",
        section,
      );
      const items = gsap.utils.toArray<HTMLElement>(
        "[data-core-cap-item]",
        section,
      );
      gsap.set(eyebrow, { y: 14, opacity: 0 });
      gsap.set(chars, { y: 22, opacity: 0 });
      gsap.set(items, { y: 26, opacity: 0 });
      gsap.to(eyebrow, {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: "power3.out",
        clearProps: "transform,opacity",
        scrollTrigger: { trigger: section, start: "top 80%", once: true },
      });
      gsap.to(chars, {
        y: 0,
        opacity: 1,
        duration: 0.65,
        stagger: 0.024,
        ease: "power3.out",
        clearProps: "transform,opacity",
        scrollTrigger: { trigger: section, start: "top 80%", once: true },
      });
      gsap.to(items, {
        y: 0,
        opacity: 1,
        duration: 0.65,
        stagger: 0.08,
        ease: "power3.out",
        clearProps: "transform,opacity",
        scrollTrigger: { trigger: section, start: "top 65%", once: true },
      });
    });
    return () => mm.revert();
  }, []);

  const { eyebrow, featured, capabilities, year } = coreCapabilities;

  return (
    <section
      ref={sectionRef}
      id={coreCapabilities.id}
      aria-labelledby="core-capabilities-heading"
      className="relative block overflow-x-clip border-t border-hairline bg-void py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto w-full max-w-7xl px-6 sm:px-10">
        <p
          data-core-cap-eyebrow
          className="font-body text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-smoke sm:text-[0.7rem]"
        >
          <span className="text-cta">02</span>
          <span aria-hidden className="mx-3 text-hairline">
            /
          </span>
          {eyebrow}
        </p>
        <div className="mt-3 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
          <DisplayHeading
            id="core-capabilities-heading"
            lines={HEADING_LINES}
            label={coreCapabilities.title}
            accentWords={["Capabilities"]}
            charMarker="data-core-cap-char"
            className="font-display text-[clamp(2.75rem,6vw,5rem)] uppercase leading-[0.85] tracking-[0.01em] text-bright"
          />
          <p className="max-w-[42ch] shrink-0 font-body text-[0.95rem] leading-relaxed text-ash lg:pb-2 lg:text-right">
            Six disciplines, one supervised pipeline — from on-set capture
            through final pixels.{" "}
            <span className="font-semibold uppercase tracking-[0.18em] text-cta">
              {year}
            </span>
          </p>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-5 sm:mt-14 lg:grid-cols-12 lg:gap-6">
          <article
            data-core-cap-item
            aria-labelledby="core-cap-featured-title"
            className="group relative flex min-h-[440px] flex-col justify-between overflow-hidden rounded-2xl border border-hairline bg-void transition-colors duration-300 hover:border-cta/50 sm:min-h-[500px] lg:col-span-5 lg:min-h-[560px]"
          >
            <Image
              src={featured.image}
              alt={featured.alt}
              fill
              sizes="(min-width: 1024px) 38vw, (min-width: 640px) 90vw, 88vw"
              className="absolute inset-0 h-full w-full object-cover brightness-[0.9] transition-transform duration-500 ease-out group-hover:scale-[1.04]"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-gradient-to-t from-void via-void/25 to-void/10"
            />
            <div className="relative z-[1] flex items-center gap-3 p-6 pb-0 sm:p-8 sm:pb-0">
              <span className="font-display text-[0.9rem] tracking-[0.1em] text-cta">
                01
              </span>
              <span aria-hidden className="h-px flex-1 bg-chalk/25" />
              <span className="font-body text-[0.65rem] font-semibold uppercase tracking-[0.22em] text-chalk">
                Featured
              </span>
            </div>
            <div className="relative z-[1] p-6 sm:p-8">
              <h3
                id="core-cap-featured-title"
                className="font-display text-[clamp(1.9rem,3.2vw,2.75rem)] uppercase leading-[0.9] tracking-[0.01em] text-bright"
              >
                {featured.title}
              </h3>
              <p className="mt-3 max-w-[44ch] font-body text-[0.95rem] leading-relaxed text-chalk/90">
                {featured.description}
              </p>
              <div aria-hidden className="mt-6 h-px w-full bg-chalk/20">
                <span className="block h-px w-10 bg-cta transition-[width] duration-300 group-hover:w-16" />
              </div>
            </div>
          </article>
          <ul
            aria-label="More capabilities"
            className="flex flex-col overflow-hidden rounded-2xl border border-hairline bg-abyss lg:col-span-7"
          >
            {capabilities.map((capability, index) => (
              <li
                key={capability.id}
                className={
                  index < capabilities.length - 1
                    ? "border-b border-hairline"
                    : undefined
                }
              >
                <article
                  data-core-cap-item
                  aria-labelledby={`core-cap-${capability.id}-title`}
                  className="group relative flex items-center gap-5 p-5 transition-colors duration-300 hover:bg-ink sm:gap-6 sm:p-6"
                >
                  <span
                    aria-hidden
                    className="absolute inset-y-0 left-0 w-[2px] origin-top scale-y-0 bg-cta transition-transform duration-300 group-hover:scale-y-100"
                  />
                  <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border border-hairline bg-void sm:h-[88px] sm:w-[88px]">
                    <Image
                      src={capability.icon}
                      alt={capability.alt}
                      fill
                      sizes="88px"
                      loading="lazy"
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.08]"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-3">
                      <span className="shrink-0 font-display text-[0.8rem] tracking-[0.1em] text-smoke transition-colors duration-300 group-hover:text-cta">
                        {String(index + 2).padStart(2, "0")}
                      </span>
                      <h3
                        id={`core-cap-${capability.id}-title`}
                        className="font-display text-[clamp(1.35rem,2.4vw,1.9rem)] uppercase leading-[0.95] tracking-[0.02em] text-cta transition-transform duration-300 group-hover:translate-x-1"
                      >
                        {capability.title}
                      </h3>
                    </div>
                    <p className="mt-1.5 max-w-[52ch] font-body text-[0.88rem] leading-relaxed text-ash transition-transform duration-300 group-hover:translate-x-1">
                      {capability.description}
                    </p>
                  </div>
                </article>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
