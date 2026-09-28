"use client";

import { useRef } from "react";
import { DisplayHeading } from "@/components/DisplayHeading";
import { gsap } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";

const DISCIPLINE_HEADING = [
  ["Mastered", "Crafts"],
  ["Precision", "Art"],
] as const;

const DISCIPLINES = [
  {
    step: "01",
    title: "VFX & Compositing",
    description:
      "Deep multi-pass digital compositing, photoreal CGI asset integration, digital matte painting, and seamless invisible visual effects.",
    tags: ["Nuke", "Deep Comp", "Rotoscopy", "CG Finishing"],
  },
  {
    step: "02",
    title: "CGI & Lookdev",
    description:
      "High-fidelity creature animation, mechanical rig modeling, complex environmental simulations, and physically-accurate lighting.",
    tags: ["Houdini", "Maya", "Unreal Engine 5", "Photoreal FX"],
  },
  {
    step: "03",
    title: "Color Science & Finishing",
    description:
      "Custom ACES look management, filmic color grading, theatrical master finishing, and multi-format HDR delivery.",
    tags: ["DaVinci Resolve", "ACES Pipeline", "Dolby Vision", "DCI-P3"],
  },
  {
    step: "04",
    title: "Pre-Viz & Creative Direction",
    description:
      "Virtual production scouting, technical sequence animatics, camera blocking, and on-set real-time VFX supervision.",
    tags: ["Virtual Camera", "Animatics", "Supervision", "Concept"],
  },
] as const;

export default function AboutDisciplines() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const chars = gsap.utils.toArray<HTMLElement>(
        "[data-discipline-char]",
        section,
      );
      const cards = gsap.utils.toArray<HTMLElement>(
        "[data-discipline-item]",
        section,
      );

      gsap.set(chars, { y: 22, opacity: 0 });
      gsap.set(cards, { y: 26, opacity: 0 });

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

      gsap.to(cards, {
        y: 0,
        opacity: 1,
        duration: 0.65,
        stagger: 0.08,
        ease: "power3.out",
        clearProps: "transform,opacity",
        scrollTrigger: {
          trigger: section,
          start: "top 70%",
          once: true,
        },
      });
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative border-t border-hairline bg-void py-24 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-10">
        <p className="font-body text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-smoke sm:text-xs">
          <span className="text-cta">03</span>
          <span aria-hidden className="mx-3 text-hairline">
            /
          </span>
          Core Capabilities
        </p>

        <DisplayHeading
          lines={DISCIPLINE_HEADING}
          label="Mastered Crafts Precision Art"
          accentWords={["Art"]}
          charMarker="data-discipline-char"
          className="mt-6 font-display text-[clamp(2.75rem,7vw,6.5rem)] uppercase leading-[0.85] tracking-[0.01em] text-bright"
        />

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:gap-8">
          {DISCIPLINES.map((item) => (
            <div
              key={item.title}
              data-discipline-item
              className="group relative flex flex-col justify-between border border-hairline bg-ink/40 p-8 transition-colors duration-300 hover:border-cta/40 hover:bg-ink/80 sm:p-10"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-display text-2xl tracking-[0.08em] text-cta">
                    {item.step}
                  </span>
                  <div className="h-1.5 w-1.5 rounded-full bg-cta" />
                </div>

                <h3 className="mt-6 font-display text-2xl uppercase tracking-[0.04em] text-bright sm:text-3xl">
                  {item.title}
                </h3>

                <p className="mt-4 font-body text-sm leading-relaxed text-ash">
                  {item.description}
                </p>
              </div>

              <div className="mt-8 flex flex-wrap gap-2 border-t border-hairline pt-6">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-void px-3 py-1 font-body text-[0.65rem] uppercase tracking-[0.14em] text-smoke transition-colors group-hover:text-ash"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
