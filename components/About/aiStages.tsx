import type { JSX } from "react";

export interface AiStage {
  index: string;
  title: string;
  description: string;
  icon: (props: { className?: string }) => JSX.Element;
}

function EyeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={className} aria-hidden>
      <path d="M2 12s3.5-6.5 10-6.5S22 12 22 12s-3.5 6.5-10 6.5S2 12 2 12Z" strokeLinejoin="round" />
      <circle cx={12} cy={12} r={2.6} />
    </svg>
  );
}

function IterateIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={className} aria-hidden>
      <path d="M20 12a8 8 0 1 1-2.34-5.66" strokeLinecap="round" />
      <path d="M20 3v4h-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function AssistIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={className} aria-hidden>
      <path d="M4 15c2.5 0 3-1.2 3-3V8.5A1.5 1.5 0 0 1 8.5 7h1A1.5 1.5 0 0 1 11 8.5V12" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11 12l2.2-2.2a1.4 1.4 0 0 1 2 2L12 15l-1.5 4.5a1.6 1.6 0 0 1-3-1L8.5 15" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M17.5 3.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7.7-1.8Z" strokeLinejoin="round" />
    </svg>
  );
}

function GaugeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={className} aria-hidden>
      <path d="M4 14a8 8 0 1 1 16 0" strokeLinecap="round" />
      <path d="M12 14l4-4.5" strokeLinecap="round" />
      <circle cx={12} cy={14} r={1.4} />
      <path d="M4 18h16" strokeLinecap="round" />
    </svg>
  );
}

function StarIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className={className} aria-hidden>
      <path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.9-5.2-2.8-5.2 2.8 1-5.9L3.5 9.7l5.9-.9L12 3.5Z" strokeLinejoin="round" />
    </svg>
  );
}

export const AI_STAGES: readonly AiStage[] = [
  { index: "01", title: "Visualize", description: "Turn creative ideas into visual possibilities.", icon: EyeIcon },
  { index: "02", title: "Iterate", description: "Explore more directions before production.", icon: IterateIcon },
  { index: "03", title: "Assist", description: "Accelerate VFX-intensive workflows.", icon: AssistIcon },
  { index: "04", title: "Optimize", description: "Improve efficiency, reduce avoidable effort.", icon: GaugeIcon },
  { index: "05", title: "Create", description: "Pursue ambitious visual concepts.", icon: StarIcon },
];

export const AI_CAPTION = "Visualize → Iterate → Assist → Optimize → Create";
