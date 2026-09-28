"use client";

import { useRef } from "react";
import CubeText from "@/components/CubeText";
import { DisplayHeading } from "@/components/DisplayHeading";
import { gsap } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";

const WORKFLOW_HEADING = [
  ["The", "Method"],
  ["To", "Creation"],
] as const;

const WORKFLOW_STEPS = [
  {
    phase: "Phase 01",
    title: "Discovery & Blueprint",
    text: "Deep script analysis, directorial alignment, visual target definition, and technical methodology budgeting.",
  },
  {
    phase: "Phase 02",
    title: "Pre-Viz & Shoot Prep",
    text: "Virtual camera pacing, camera lens mapping, LiDAR scanning, and on-set HDR environmental capture.",
  },
  {
    phase: "Phase 03",
    title: "Execution & Synthesis",
    text: "Iterative 3D sculpting, simulation cascades, multi-layer compositing passes, and visual polish reviews.",
  },
  {
    phase: "Phase 04",
    title: "Mastering & Delivery",
    text: "Final cinematic color grade, theatrical DCI deliverables, archival multi-channel audio passes, and delivery verification.",
  },
] as const;

const CTA_HEADING = [
  ["Let's", "Build"],
  ["The", "Vision"],
] as const;

export default function AboutProcess() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const chars = gsap.utils.toArray<HTMLElement>(
        "[data-process-char]",
        section,
      );
      const steps = gsap.utils.toArray<HTMLElement>(
        "[data-process-step]",
        section,
      );

      gsap.set(chars, { y: 22, opacity: 0 });
      gsap.set(steps, { y: 24, opacity: 0 });

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

      gsap.to(steps, {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.1,
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
      className="relative border-t border-hairline bg-abyss py-24 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 sm:px-10">
        <p className="font-body text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-smoke sm:text-xs">
          <span className="text-cta">04</span>
          <span aria-hidden className="mx-3 text-hairline">
            /
          </span>
          Studio Process
        </p>

        <DisplayHeading
          lines={WORKFLOW_HEADING}
          label="The Method To Creation"
          accentWords={["Creation"]}
          charMarker="data-process-char"
          className="mt-6 font-display text-[clamp(2.75rem,7vw,6.5rem)] uppercase leading-[0.85] tracking-[0.01em] text-bright"
        />

        {/* Linear Step Progression */}
        <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {WORKFLOW_STEPS.map((step) => (
            <div
              key={step.phase}
              data-process-step
              className="relative flex flex-col border-t border-hairline pt-6"
            >
              <div className="flex items-center gap-3">
                <span className="font-body text-xs font-semibold uppercase tracking-[0.2em] text-cta">
                  {step.phase}
                </span>
                <div className="h-px flex-1 bg-hairline" />
              </div>

              <h3 className="mt-5 font-display text-2xl uppercase tracking-[0.05em] text-bright">
                {step.title}
              </h3>

              <p className="mt-3 font-body text-sm leading-relaxed text-ash">
                {step.text}
              </p>
            </div>
          ))}
        </div>

        {/* Closer Banner */}
        <div className="mt-28 flex flex-col items-center justify-between gap-8 border border-hairline bg-ink/50 p-10 text-center sm:p-14 lg:flex-row lg:text-left">
          <div>
            <DisplayHeading
              as="h2"
              lines={CTA_HEADING}
              label="Let's Build The Vision"
              accentWords={["Vision"]}
              charMarker="data-process-char"
              className="font-display text-[clamp(2.2rem,5vw,4.5rem)] uppercase leading-[0.88] tracking-[0.01em] text-bright"
            />
            <p className="mt-4 max-w-[48ch] font-body text-sm text-ash sm:text-base">
              Ready to collaborate on your next feature, campaign, or visual experiment?
              Our studio doors are always open to audacious ideas.
            </p>
          </div>

          <a
            href="mailto:hello@filmarc.studio"
            className="inline-flex shrink-0 items-center justify-center rounded-full bg-cta px-8 py-4 font-body text-xs font-semibold uppercase tracking-[0.18em] text-cta-ink transition-[filter] duration-300 hover:brightness-[1.07] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cta sm:px-10"
          >
            <CubeText label="Get in touch" />
          </a>
        </div>
      </div>
    </section>
  );
}
