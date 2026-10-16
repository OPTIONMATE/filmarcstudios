"use client";

import { useRef } from "react";

import { DisplayHeading } from "@/components/DisplayHeading";
import { PROJECTS, type Project } from "@/components/Home/projects";
import { SupervisorCard } from "@/components/Home/SupervisorCard";
import { gsap } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";

const HEADING = [
  ["Inside", "The", "Frame"]
] as const;

const LATEST = PROJECTS.filter((p) => p.group === "latest");
const COMPLETED = PROJECTS.filter((p) => p.group === "completed");
const ONGOING = PROJECTS.filter((p) => p.group === "ongoing");
const LAB = PROJECTS.filter((p) => p.group === "lab");

type AmbientVariant = "ember" | "violet" | "azure" | "emerald";

const AMBIENTS: readonly AmbientVariant[] = [
  "ember",
  "violet",
  "azure",
  "emerald",
] as const;

/* Deterministic per-project pick so each card keeps its own subtle corner
   treatment across renders (ember grid → violet dots → azure scales →
   emerald hairlines). */
function ambientFor(id: string): AmbientVariant {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) {
    hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  }
  return AMBIENTS[hash % AMBIENTS.length];
}

function ProjectAmbient({ variant }: { variant: AmbientVariant }) {
  return (
    <div
      aria-hidden
      className={`project-ambient project-ambient--${variant}`}
    >
      <span className="project-ambient__wash" />
      <span className="project-ambient__glow" />
      <span className="project-ambient__pattern" />
    </div>
  );
}

function ProjectPanel({
  project,
  index,
}: {
  project: Project;
  index: string;
}) {
  const ambient = ambientFor(project.id);
  return (
    <article
      data-project-item
      className="group relative flex flex-col justify-between overflow-hidden border border-hairline bg-ink p-6 transition-colors duration-300 hover:border-cta/60 sm:p-8"
    >
      <ProjectAmbient variant={ambient} />
      <div className="relative z-[1] flex items-center gap-3">
        <span className="font-display text-[0.9rem] tracking-[0.1em] text-cta">
          {index}
        </span>
        <span
          aria-hidden
          className="h-px flex-1 bg-hairline transition-colors duration-300 group-hover:bg-cta/60"
        />
        <span className="font-body text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-chalk">
          {project.context}
        </span>
      </div>
      <div className="relative z-[1] mt-10 sm:mt-14">
        <h3
          className="font-display uppercase leading-[0.9] tracking-[0.01em] text-bright text-[clamp(1.9rem,3.4vw,2.9rem)]"
        >
          {project.title}
        </h3>
      </div>
    </article>
  );
}

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
        ) : (
          <ProjectPanel
            key={project.id}
            project={project}
            index={project.title}
          />
        ),
      )}
    </div>
  );
}

function ProjectRow({ project, index }: { project: Project; index: string }) {
  const ambient = ambientFor(project.id);
  return (
    <article
      data-project-item
      className="group relative flex flex-col gap-3 overflow-hidden border border-hairline bg-void p-6 transition-colors duration-300 hover:border-cta/60 hover:bg-ink sm:flex-row sm:items-baseline sm:justify-between sm:gap-8 sm:p-7"
    >
      <ProjectAmbient variant={ambient} />
      <div className="relative z-[1] flex items-baseline gap-4">
        <span className="font-display text-[0.9rem] tracking-[0.1em] text-cta">
          {index}
        </span>
        <h3 className="font-poster text-[clamp(1.5rem,2.8vw,2.2rem)] font-black uppercase leading-[1.02] tracking-[0.01em] text-bright">
          {project.title}
        </h3>
      </div>
      <p className="relative z-[1] font-body text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-chalk sm:shrink-0">
        {project.context}
      </p>
    </article>
  );
}

export default function ProjectsSection() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const mm = gsap.matchMedia();
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const chars = gsap.utils.toArray<HTMLElement>(
        "[data-projects-char]",
        section,
      );
      const items = gsap.utils.toArray<HTMLElement>(
        "[data-project-item]",
        section,
      );
      gsap.set(chars, { y: 22, opacity: 0 });
      gsap.set(items, { y: 26, opacity: 0 });
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
        stagger: 0.07,
        ease: "power3.out",
        clearProps: "transform,opacity",
        scrollTrigger: { trigger: section, start: "top 65%", once: true },
      });
    });
    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="projects-heading"
      className="relative block overflow-x-clip border-t border-hairline bg-void py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto w-full max-w-7xl px-6 sm:px-10">
        <p className="font-body text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-chalk sm:text-[0.7rem]">
          <span className="text-cta">01</span>
          <span aria-hidden className="mx-3 text-chalk">
            /
          </span>
          Selected Works
        </p>
        <div className="mt-3 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
          <DisplayHeading
            id="projects-heading"
            lines={HEADING}
            label="Inside The Frame"
            accentWords={["Frame"]}
            charMarker="data-projects-char"
            className="font-display text-7xl uppercase leading-[0.85] tracking-[0.01em] text-bright"
          />
          <p className="max-w-[42ch] shrink-0 font-body text-[0.95rem] leading-relaxed text-chalk lg:pb-2 lg:text-right">
            VFX supervision, CGI, animation and emerging production
            technologies.
          </p>
        </div>

        <div className="mt-12 sm:mt-16">
          <div className="flex items-baseline justify-between gap-6 border-b border-hairline pb-4">
            <h3 className="font-body text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-bright">
              Latest Movies <span className="text-cta">—</span> VFX Supervision
            </h3>
            <span className="font-body text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-cta">
              2026
            </span>
          </div>
          <SupervisorGrid items={LATEST} />
        </div>

        <div className="mt-14 sm:mt-20">
          <div className="flex items-baseline justify-between gap-6 border-b border-hairline pb-4">
            <h3 className="font-body text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-bright">
              Completed
            </h3>
            <span className="font-body text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-cta">
              {String(COMPLETED.length).padStart(2, "0")}
            </span>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-5">
            {COMPLETED.map((project, i) => (
              <ProjectRow
                key={project.id}
                project={project}
                index={String(i + 1).padStart(2, "0")}
              />
            ))}
          </div>
        </div>        
      </div>
    </section>
  );
}


