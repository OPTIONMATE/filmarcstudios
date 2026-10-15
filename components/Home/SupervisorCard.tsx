import type { SupervisorArtwork } from "@/components/Home/projects";
import {
  POSTER_ART,
  POSTER_FIELD,
  POSTER_GOLD,
  POSTER_IVORY,
} from "@/components/Home/posterArt";

export function SupervisorCard({ title, credit, artwork }: { title: string; credit: string; artwork: SupervisorArtwork }) {
  const Art = POSTER_ART[artwork];
  return (
    <article
      data-project-item
      aria-label={`${title} — ${credit}`}
      className="group relative flex aspect-[3/3.96] w-full flex-col overflow-hidden border border-hairline transition-colors duration-300 hover:border-cta/60"
      style={{ borderRadius: 28, background: POSTER_FIELD[artwork] }}
    >
      <div aria-hidden className="relative h-[58%] w-full">
        <div className="absolute inset-0 p-4 sm:p-5">
          <Art />
        </div>
      </div>
      <div className="relative flex flex-1 flex-col items-center justify-start px-5 pt-1 pb-6 text-center sm:px-6">
        <h3
          className="text-balance font-poster text-[clamp(1.55rem,2.4vw,2.25rem)] font-black uppercase leading-[1.02] tracking-[0.01em]"
          style={{ color: POSTER_IVORY }}
        >
          {title}
        </h3>
        <div aria-hidden className="mt-3 h-px w-16 transition-[width] duration-300 group-hover:w-24" style={{ background: POSTER_GOLD }} />
        <p className="mt-3 font-body text-[0.62rem] font-semibold uppercase sm:text-[0.68rem]"
          style={{ color: POSTER_GOLD, letterSpacing: "0.34em", textIndent: "0.34em" }}>
          {credit}
        </p>
      </div>
    </article>
  );
}
