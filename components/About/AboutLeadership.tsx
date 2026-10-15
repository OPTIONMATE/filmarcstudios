"use client";

import { useRef } from "react";
import Image from "next/image";
import { DisplayHeading } from "@/components/DisplayHeading";
import { gsap } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";

const LEADERSHIP_HEADING = [
  ["The", "Team"],
  ["Behind", "The", "Pipeline"],
] as const;

const LEADERS = [
  {
    index: "01",
    name: "Kanaka Raju Dara",
    role: "Founder & CEO | VFX Supervisor",
    experience: "20 years of experience",
    image: "/images/leaders/kanaka-raju-dara.jpeg",
    alt: "Portrait of Kanaka Raju Dara",
    expertise: [
      "VFX/CGI Supervision",
      "3D Animation and Cartoon Production",
      "Virtual Production and Motion Capture",
      "Gaming & Emerging Technologies (AR, VR & MR)",
    ],
    credit: "Former VFX Supervisor — Hanu-Man, Baahubali",
  },
  {
    index: "02",
    name: "Sasikumar Peyyala",
    role: "Co-Founder & Business Head | AI & Technology Expert",
    experience: "10 years of experience",
    image: "/images/leaders/SasikumarPeyyala.webp",
    alt: "Portrait of Sasikumar Peyyala",
    expertise: [
      "AI",
      "Business Development",
      "Research Analyst",
      "Prompt Engineer",
    ],
    credit: null,
  },
  {
    index: "03",
    name: "Eeda Damodara Rao",
    role: "Technical Quality & Pipeline Lead | Technology & QA Expert",
    experience: "18 years of experience",
    image: "/images/leaders/eeda-damodhara-rao.png",
    alt: "Portrait of Eeda Damodara Rao",
    expertise: [
      "QA for AI/VFX pipelines",
      "Automated testing",
      "Render & performance validation",
    ],
    credit: "Former Senior Technical Lead — QA & Testing, HCLTech",
  },
] as const;

const CLOSING_STATEMENT =
  "Creative VFX Leadership + AI & Technology Expertise + Production Pipeline Quality Engineering";

export default function AboutLeadership() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const chars = gsap.utils.toArray<HTMLElement>(
        "[data-leadership-char]",
        section,
      );
      const items = gsap.utils.toArray<HTMLElement>(
        "[data-leadership-item]",
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
        stagger: 0.12,
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
      aria-labelledby="leadership-heading"
      className="relative block overflow-x-clip border-t border-hairline bg-void py-16 sm:py-20 lg:min-h-[100svh] lg:py-24"
    >
      <div className="mx-auto flex w-full max-w-7xl flex-col justify-center px-6 sm:px-10">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
          <div className="shrink-0">
            <p className="font-body text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-smoke sm:text-[0.7rem]">
              <span className="text-cta">04</span>
              <span aria-hidden className="mx-3 text-hairline">
                /
              </span>
              Leadership
            </p>

            <DisplayHeading
              id="leadership-heading"
              lines={LEADERSHIP_HEADING}
              label="The Team Behind The Pipeline"
              accentWords={["Pipeline"]}
              charMarker="data-leadership-char"
              className="mt-3 font-display text-[clamp(2.75rem,3.6vw,3.5rem)] uppercase leading-[0.9] tracking-[0.01em] text-bright"
            />
          </div>

          <p className="max-w-[38ch] shrink-0 font-body text-[0.8rem] leading-relaxed tracking-[0.06em] text-white lg:pb-2 lg:text-right lg:text-[0.85rem] lg:uppercase">
            <span className="sr-only">{CLOSING_STATEMENT}</span>
            <span aria-hidden>
              Creative VFX Leadership <span className="text-cta">+</span> AI
              &amp; Technology Expertise <span className="text-cta">+</span>{" "}
              Production Pipeline Quality Engineering
            </span>
          </p>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-px border border-hairline bg-hairline sm:grid-cols-2 lg:mt-[clamp(1.25rem,3.5svh,2rem)] lg:grid-cols-3">
          {LEADERS.map((leader) => (
            <article
              key={leader.name}
              data-leadership-item
              className="group flex flex-col bg-void p-5 sm:p-6"
            >
              <div className="relative h-[260px] w-full overflow-hidden border border-hairline bg-ink sm:h-[280px] lg:h-[300px]">
                <Image
                  src={leader.image}
                  alt={leader.alt}
                  fill
                  sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
                  className="object-cover object-top transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                />
              </div>

              <div className="min-w-0 flex-1 pt-5">
                <div className="flex items-center gap-2.5">
                  <span className="font-display text-[0.85rem] tracking-[0.08em] text-cta">
                    {leader.index}
                  </span>
                  <span aria-hidden className="h-px flex-1 bg-hairline" />
                  <span className="font-body text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-smoke">
                    {leader.experience}
                  </span>
                </div>

                <h3 className="mt-2 font-display text-[1.375rem] uppercase leading-[0.95] tracking-[0.02em] text-bright">
                  {leader.name}
                </h3>
                <p className="mt-1.5 font-body text-[0.72rem] font-semibold uppercase leading-[1.6] tracking-[0.1em] text-cta">
                  {leader.role}
                </p>

                <p className="mt-2 font-body text-[0.85rem] leading-[1.6] text-ash">
                  {leader.expertise.join(" · ")}
                </p>

                {leader.credit ? (
                  <p className="mt-1.5 font-body text-[0.78rem] leading-relaxed text-smoke">
                    {leader.credit}
                  </p>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
