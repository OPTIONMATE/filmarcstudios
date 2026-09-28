"use client";

import { useRef } from "react";
import { DisplayHeading } from "@/components/DisplayHeading";
import { gsap } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";

const MANIFESTO_HEADING = [
  ["Obsession", "With"],
  ["Every", "Frame"],
] as const;

const CORE_STATS = [
  {
    number: "140+",
    label: "Projects Delivered",
    detail: "Commercials, long-form cinema & episodic visual storytelling.",
  },
  {
    number: "09",
    label: "Industry Honors",
    detail: "Global accolades in visual artistry, sound design & VFX crafts.",
  },
  {
    number: "100%",
    label: "In-House Pipeline",
    detail: "From pre-visualization and shooting supervision to final master grade.",
  },
  {
    number: "18+",
    label: "Global Markets",
    detail: "Active collaborations spanning Tokyo, London, LA, and Mumbai.",
  },
] as const;

export default function AboutManifesto() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const chars = gsap.utils.toArray<HTMLElement>(
        "[data-manifesto-char]",
        section,
      );
      const items = gsap.utils.toArray<HTMLElement>(
        "[data-stat-card]",
        section,
      );

      gsap.set(chars, { y: 22, opacity: 0 });
      gsap.set(items, { y: 28, opacity: 0 });

      gsap.to(chars, {
        y: 0,
        opacity: 1,
        duration: 0.65,
        stagger: 0.024,
        ease: "power3.out",
        clearProps: "transform,opacity",
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          once: true,
        },
      });

      gsap.to(items, {
        y: 0,
        opacity: 1,
        duration: 0.7,
        stagger: 0.1,
        ease: "power3.out",
        clearProps: "transform,opacity",
        scrollTrigger: {
          trigger: section,
          start: "top 72%",
          once: true,
        },
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative border-t border-hairline bg-abyss py-24 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-10">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          {/* Left Column: Heading */}
          <div className="lg:col-span-6">
            <p className="font-body text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-smoke sm:text-xs">
              <span className="text-cta">02</span>
              <span aria-hidden className="mx-3 text-hairline">
                /
              </span>
              The Manifesto
            </p>

            <DisplayHeading
              lines={MANIFESTO_HEADING}
              label="Obsession With Every Frame"
              accentWords={["Frame"]}
              charMarker="data-manifesto-char"
              className="mt-6 font-display text-[clamp(2.75rem,7vw,6.5rem)] uppercase leading-[0.85] tracking-[0.01em] text-bright"
            />
          </div>

          {/* Right Column: Statement Paragraphs */}
          <div className="flex flex-col justify-end lg:col-span-6">
            <div className="space-y-6 font-body text-[clamp(0.95rem,1.5vw,1.15rem)] leading-relaxed text-ash">
              <p>
                We do not believe in disposable spectacles or formulaic renders.
                Every sequence authored at FILMARC begins with narrative intent:
                what emotion must the frame carry, and what physical rules must be
                bent or observed to make the illusion indestructible?
              </p>
              <p>
                By keeping our core creative leads deeply integrated from concept
                design to photorealistic final grading, we eliminate the friction
                between the director’s dream and technical execution.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="mt-20 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:mt-28 lg:grid-cols-4">
          {CORE_STATS.map((stat, idx) => (
            <div
              key={stat.label}
              data-stat-card
              className="group relative flex flex-col justify-between border border-hairline bg-ink/70 p-7 backdrop-blur-sm transition-colors duration-300 hover:border-bright/20"
            >
              <div className="flex items-baseline justify-between">
                <span className="font-display text-[clamp(2.5rem,4.5vw,4rem)] font-normal tracking-[0.02em] text-cta">
                  {stat.number}
                </span>
                <span className="font-body text-[0.65rem] font-medium tracking-[0.2em] text-smoke">
                  0{idx + 1}
                </span>
              </div>
              <div className="mt-6">
                <h3 className="font-display text-xl uppercase tracking-[0.08em] text-bright">
                  {stat.label}
                </h3>
                <p className="mt-2 font-body text-xs leading-relaxed text-smoke">
                  {stat.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
