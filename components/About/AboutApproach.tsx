"use client";

import { useRef } from "react";

import { DisplayHeading } from "@/components/DisplayHeading";
import { gsap } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";

/**
 * FilmArc Studios — The Filmarc Approach (About page).
 *
 * Two-column editorial composition:
 *   left  — eyebrow, house display heading, description with gold highlight,
 *           six benefit pills (2 cols x 3 rows).
 *   right — three-circle Venn diagram (inline SVG, crisp at any size)
 *           with a gold caption beneath; no centre marker.
 *
 * Only this section's interior is styled here. Colours resolve to the
 * existing tokens (gold --filmarc-cta, chalk, smoke, hairline); type uses
 * the house display (Bebas) + body faces. Motion is one subtle
 * ScrollTrigger reveal batch; `prefers-reduced-motion` renders static.
 */

const BENEFITS = [
  "Creative flexibility",
  "Faster iteration",
  "Better planning",
  "Production efficiency",
  "Visual ambition",
  "Controlled execution",
] as const;

const GOLD = "var(--filmarc-cta)";
const EMBER = "var(--filmarc-ember)";
const CYAN = "var(--filmarc-cyan)";
const CHALK = "var(--filmarc-chalk)";

function VennDiagram() {
  return (
    <svg
      viewBox="0 0 400 360"
      role="img"
      aria-label="Venn diagram of VFX expertise, AI workflows and previsualization"
      className="h-auto w-full"
    >
      <circle cx={200} cy={118} r={104} fill={GOLD} fillOpacity={0.07} stroke={GOLD} strokeOpacity={0.85} strokeWidth={1.4} />
      <circle cx={122} cy={248} r={104} fill={EMBER} fillOpacity={0.07} stroke={EMBER} strokeOpacity={0.85} strokeWidth={1.4} />
      <circle cx={278} cy={248} r={104} fill={CYAN} fillOpacity={0.07} stroke={CYAN} strokeOpacity={0.85} strokeWidth={1.4} />
      <text x={200} y={48} textAnchor="middle" fontSize={15} fill={GOLD}>
        VFX expertise
      </text>
      <text x={76} y={282} textAnchor="middle" fontSize={14.5} fill={EMBER}>
        AI workflows
      </text>
      <text x={320} y={284} textAnchor="middle" fontSize={13.5} fill={CYAN}>
        previsualization
      </text>
    </svg>
  );
}

export default function AboutApproach() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const reveals = gsap.utils.toArray<HTMLElement>("[data-approach-reveal]", section);
      const pills = gsap.utils.toArray<HTMLElement>("[data-approach-pill]", section);
      const diagram = gsap.utils.toArray<HTMLElement>("[data-approach-diagram]", section);
      gsap.set(reveals, { y: 22, opacity: 0 });
      gsap.set(pills, { y: 16, opacity: 0 });
      gsap.set(diagram, { y: 28, opacity: 0 });
      gsap.to(reveals, {
        y: 0, opacity: 1, duration: 0.65, stagger: 0.09, ease: "power3.out",
        clearProps: "transform,opacity",
        scrollTrigger: { trigger: section, start: "top 78%", once: true },
      });
      gsap.to(pills, {
        y: 0, opacity: 1, duration: 0.55, stagger: 0.07, ease: "power3.out",
        clearProps: "transform,opacity",
        scrollTrigger: { trigger: section, start: "top 65%", once: true },
      });
      gsap.to(diagram, {
        y: 0, opacity: 1, duration: 0.8, ease: "power3.out",
        clearProps: "transform,opacity",
        scrollTrigger: { trigger: section, start: "top 65%", once: true },
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="approach-heading"
      className="relative block overflow-x-clip border-t border-hairline bg-void py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-6 sm:px-10 lg:grid-cols-[1.05fr_1fr] lg:gap-20">
        <div className="flex flex-col justify-center lg:min-h-[560px] lg:py-4">
          <p
            data-approach-reveal
            className="font-body text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-smoke sm:text-[0.78rem]"
          >
            The Filmarc Approach
          </p>
          <DisplayHeading
            id="approach-heading"
            lines={[[`One`, `creative`, `vision.`]]}
            label="One creative vision."
            accentWords={[`vision.`]}
            charMarker="data-approach-reveal"
            className="mt-5 font-display text-[clamp(2.2rem,4.6vw,4.25rem)] uppercase leading-[0.9] tracking-[0.01em] text-bright whitespace-nowrap"
          />
          <p
            data-approach-reveal
            className="mt-6 max-w-[48ch] font-body text-[1rem] leading-relaxed text-ash sm:text-lg"
          >
            Film Arc Studios combines{" "}
            <span className="text-cta">
              VFX expertise + AI workflows + previsualization
            </span>{" "}
            into a single, practical filmmaking pipeline.
          </p>
          <ul
            aria-label="Approach benefits"
            className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2"
          >
            {BENEFITS.map((benefit) => (
              <li
                key={benefit}
                data-approach-pill
                className="flex min-h-[3.75rem] items-center gap-3 rounded-full border border-smoke px-6"
              >
                <span aria-hidden className="h-2.5 w-2.5 shrink-0 rounded-full bg-cta" />
                <span className="font-body text-[0.95rem] font-bold text-chalk">
                  {benefit}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div data-approach-diagram className="mx-auto w-full max-w-[560px] lg:max-w-none">
          <VennDiagram />
          <p
            className="mt-6 text-center font-body text-[0.7rem] font-semibold uppercase leading-[2] text-cta"
            style={{ letterSpacing: "0.4em", textIndent: "0.4em" }}
          >
            VFX + AI +
           
            Previs
          </p>
        </div>
      </div>
    </section>
  );
}
