"use client";

import { useRef } from "react";

import { DisplayHeading } from "@/components/DisplayHeading";
import { PROJECTS, type Project } from "@/components/Home/projects";
import { SupervisorCard } from "@/components/Home/SupervisorCard";
import { gsap } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";

const HERO_LINES = [["Selected"], ["Work"]] as const;
const LATEST = PROJECTS.filter((p) => p.group === "latest");
const ONGOING = PROJECTS.filter((p) => p.group === "ongoing");
const COMPLETED = PROJECTS.filter((p) => p.group === "completed");

function SupervisorGrid({ items }: { items: readonly Project[] }) {
  return (
    <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((project) =>
        project.artwork ? (
          <SupervisorCard
            key={project.id}
            title={project.title}
            credit={project.context ?? "VFX Supervision"}
            artwork={project.artwork}
          />
        ) : null,
      )}
    </div>
  );
}

function SectionHead({ title, meta }: { title: React.ReactNode; meta: string }) {
  return (
    <div className="flex items-baseline justify-between gap-6 border-b border-hairline pb-4">
      <h2 className="font-body text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-bright">
        {title}
      </h2>
      <span className="font-body text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-cta">
        {meta}
      </span>
    </div>
  );
}

export default function WorkContent() {
  const rootRef = useRef<HTMLElement | null>(null);
  useIsomorphicLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const heroChars = gsap.utils.toArray<HTMLElement>("[data-work-hero-char]", root);
      gsap.set(heroChars, { y: 22, opacity: 0 });
      gsap.to(heroChars, {
        y: 0, opacity: 1, duration: 0.65, stagger: 0.026,
        ease: "power3.out", clearProps: "transform,opacity",
      });
      const cards = gsap.utils.toArray<HTMLElement>("[data-project-item]", root);
      cards.forEach((card) => {
        gsap.from(card, {
          y: 28, opacity: 0, duration: 0.7, ease: "power3.out",
          scrollTrigger: { trigger: card, start: "top 82%", once: true },
        });
      });
    });
    return () => mm.revert();
  }, []);
  return <WorkSections />;
}

function WorkSections() {
  return (
    <section className="relative w-full bg-void px-6 pt-32 pb-24 sm:px-10 lg:pt-40 lg:pb-32">
      <div className="mx-auto max-w-7xl">
        <div className="border-b border-hairline pb-14 sm:pb-20">
          <p className="font-body text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-smoke sm:text-xs">
            <span className="text-cta">01</span>
            <span aria-hidden className="mx-3 text-hairline">/</span>
            Selected Works
          </p>
          <div className="mt-6 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <DisplayHeading
              as="h1"
              lines={HERO_LINES}
              label="Selected Work"
              accentWords={["Work"]}
              charMarker="data-work-hero-char"
              className="font-display text-[clamp(3.5rem,10vw,8.5rem)] uppercase leading-[0.85] tracking-[0.01em] text-bright"
            />
            <p className="max-w-[42ch] font-body text-base leading-relaxed text-ash lg:text-lg">
              VFX supervision, CGI and production craft — from latest releases
              to productions currently on the floor.
            </p>
          </div>
        </div>
        <div className="mt-14 sm:mt-20">
          <SectionHead title={<>Latest Movies <span className="text-cta">—</span> VFX Supervision</>} meta="2026" />
          <SupervisorGrid items={LATEST} />
        </div>
        <div className="mt-14 sm:mt-20">
          <SectionHead title="Ongoing Projects" meta={String(ONGOING.length).padStart(2, "0")} />
          <SupervisorGrid items={ONGOING} />
        </div>
        <CompletedList />
      </div>
    </section>
  );
}

function CompletedList() {
  return (
    <div className="mt-14 sm:mt-20">
      <SectionHead title="Completed" meta={String(COMPLETED.length).padStart(2, "0")} />
      <ul className="mt-6 grid grid-cols-1 gap-5">
        {COMPLETED.map((project, i) => (
          <li key={project.id}>
            <article data-project-item className="group relative flex flex-col gap-3 overflow-hidden border border-hairline bg-void p-6 transition-colors duration-300 hover:border-cta/60 hover:bg-ink sm:flex-row sm:items-baseline sm:justify-between sm:gap-8 sm:p-7">
              <div className="relative z-[1] flex items-baseline gap-4">
                <span className="font-display text-[0.9rem] tracking-[0.1em] text-cta">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-poster text-[clamp(1.5rem,2.8vw,2.2rem)] font-black uppercase leading-[1.02] tracking-[0.01em] text-bright">
                  {project.title}
                </h3>
              </div>
              <p className="relative z-[1] font-body text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-chalk sm:shrink-0">
                {project.context}
              </p>
            </article>
          </li>
        ))}
      </ul>
    </div>
  );
}
