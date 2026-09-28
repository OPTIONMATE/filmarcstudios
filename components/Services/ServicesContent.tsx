"use client";

import Image from "next/image";
import { useRef } from "react";
import CubeText from "@/components/CubeText";
import { DisplayHeading } from "@/components/DisplayHeading";
import { gsap } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";
import { services } from "@/components/Home/services";

const HERO_LINES = [
  ["What", "We"],
  ["Create"],
] as const;

const CTA_LINES = [
  ["Have", "A"],
  ["Project", "Ahead?"],
] as const;

export default function ServicesContent() {
  const rootRef = useRef<HTMLElement | null>(null);

  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      // Hero entrance
      const heroChars = gsap.utils.toArray<HTMLElement>(
        "[data-services-hero-char]",
        root,
      );
      gsap.set(heroChars, { y: 22, opacity: 0 });

      gsap.to(heroChars, {
        y: 0,
        opacity: 1,
        duration: 0.65,
        stagger: 0.026,
        ease: "power3.out",
        clearProps: "transform,opacity",
      });

      const cards = gsap.utils.toArray<HTMLElement>("[data-service-block]", root);
      cards.forEach((card) => {
        gsap.from(card, {
          y: 28,
          opacity: 0,
          duration: 0.7,
          ease: "power3.out",
          scrollTrigger: {
            trigger: card,
            start: "top 82%",
            once: true,
          },
        });
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={rootRef} className="relative w-full bg-void px-6 pt-32 pb-24 sm:px-10 lg:pt-40 lg:pb-32">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="border-b border-hairline pb-14 sm:pb-20">
          <p className="font-body text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-smoke sm:text-xs">
            <span className="text-cta">01</span>
            <span aria-hidden className="mx-3 text-hairline">
              /
            </span>
            Disciplines
          </p>

          <div className="mt-6 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <DisplayHeading
              as="h1"
              lines={HERO_LINES}
              label="What We Create"
              accentWords={["Create"]}
              charMarker="data-services-hero-char"
              className="font-display text-[clamp(3.5rem,10vw,8.5rem)] uppercase leading-[0.85] tracking-[0.01em] text-bright"
            />

            <p className="max-w-[42ch] font-body text-base leading-relaxed text-ash lg:text-lg">
              Five specialized visual disciplines engineered to take cinematic
              narratives and ambitious brand campaigns from concept to screen.
            </p>
          </div>
        </div>

        {/* Cinematic Service Showcase */}
        <div className="mt-14 space-y-10 sm:mt-20 sm:space-y-14">
          {services.map((service, index) => (
            <article
              key={service.id}
              data-service-block
              className="group relative overflow-hidden rounded-2xl border border-hairline bg-abyss p-6 transition-all duration-500 hover:border-cta/40 hover:bg-ink/60 sm:p-8 lg:p-10"
            >
              <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12 lg:items-center">
                {/* Left: Info & Deliverables */}
                <div className="flex flex-col justify-between lg:col-span-7">
                  <div>
                    <div className="flex items-center gap-3">
                      <span className="font-display text-xl tracking-[0.1em] text-cta sm:text-2xl">
                        0{index + 1}
                      </span>
                      <span className="h-px w-8 bg-hairline" />
                      <span className="font-body text-[0.65rem] font-medium uppercase tracking-[0.22em] text-smoke">
                        Studio Discipline
                      </span>
                    </div>

                    <h2 className="mt-4 font-display text-[clamp(2.2rem,4.5vw,3.6rem)] uppercase leading-[0.88] tracking-[0.02em] text-bright transition-colors duration-300 group-hover:text-cta">
                      {service.name}
                    </h2>

                    <p className="mt-3 font-body text-sm font-medium tracking-wide text-bright/90 sm:text-base">
                      {service.tagline}
                    </p>

                    <p className="mt-3 max-w-[52ch] font-body text-sm leading-relaxed text-ash sm:text-base">
                      {service.description}
                    </p>
                  </div>

                  <div className="mt-8 border-t border-hairline pt-5">
                    <p className="font-body text-[0.65rem] font-semibold uppercase tracking-[0.24em] text-smoke">
                      Core Deliverables
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {service.deliverables.map((item) => (
                        <span
                          key={item}
                          className="rounded-full border border-hairline bg-void px-3 py-1 font-body text-[0.7rem] uppercase tracking-[0.12em] text-ash transition-colors duration-200 group-hover:border-bright/20 group-hover:text-bright"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right: Media Still Frame */}
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl border border-hairline bg-void lg:col-span-5">
                  <Image
                    src={service.image}
                    alt={service.name}
                    fill
                    sizes="(max-width: 1024px) 100vw, 42vw"
                    className="object-cover grayscale contrast-110 transition-all duration-700 ease-out group-hover:scale-105 group-hover:grayscale-0"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-void/80 via-transparent to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-40" />
                  <div className="absolute bottom-3 right-3 rounded-full bg-void/80 px-3 py-1 backdrop-blur-md">
                    <span className="font-body text-[0.65rem] uppercase tracking-[0.2em] text-cta">
                      Filmarc Master
                    </span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Action Closer Section */}
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
              href="mailto:hello@filmarc.studio"
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
