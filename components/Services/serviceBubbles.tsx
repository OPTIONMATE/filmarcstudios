import type { JSX } from "react";

/**
 * FILMARC STUDIOS — service bubbles data (Services page).
 *
 * Single source of truth for the interactive bubble field
 * (components/Services/BubbleField.tsx). Names are the studio's seven
 * disciplines, verbatim — do not reword them.
 *
 * `pos` is the bubble's home position as % of the field (left/top of its
 * box); `size` is its desktop diameter in px. Accents stay inside the
 * studio palette: gold, bronze, amber, burgundy, steel blue, violet, ember.
 */

export interface ServiceBubble {
  id: string;
  name: string;
  accent: string;
  size: number;
  pos: { x: number; y: number };
  floatAmp: number;
  floatDur: number;
  icon: () => JSX.Element;
}

const stroke = "currentColor";

function VfxIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={1.6} aria-hidden>
      <path d="M12 3l2.2 5.4 5.8.5-4.4 3.8 1.3 5.7L12 15.2 7.1 18.4l1.3-5.7-4.4-3.8 5.8-.5L12 3z" strokeLinejoin="round" />
    </svg>
  );
}

function AiVfxIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={1.6} aria-hidden>
      <rect x="7" y="7" width="10" height="10" rx="2" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3" strokeLinecap="round" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

function AiFilmIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={1.6} aria-hidden>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M7 5v14M17 5v14M3 10h4M3 14h4M17 10h4M17 14h4" />
    </svg>
  );
}

function OnsetIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={1.6} aria-hidden>
      <rect x="2" y="7" width="13" height="10" rx="2" />
      <path d="M15 10l7-3v10l-7-3" strokeLinejoin="round" />
      <path d="M6 7V4h11" strokeLinecap="round" />
    </svg>
  );
}

function PrevisIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={1.6} aria-hidden>
      <rect x="3" y="4" width="8" height="7" rx="1" />
      <rect x="13" y="4" width="8" height="7" rx="1" />
      <rect x="3" y="13" width="8" height="7" rx="1" />
      <path d="M13 16.5h8M17 13.5v6" strokeLinecap="round" />
    </svg>
  );
}

function RotoIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={1.6} aria-hidden>
      <path d="M4 4c4-1 12-1 16 2-1 4-5 6-8 6l4 8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="1.6" fill={stroke} stroke="none" />
      <circle cx="6" cy="17" r="1.2" />
    </svg>
  );
}

function QcIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth={1.6} aria-hidden>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M8.5 12.5l2.5 2.5 4.5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export const SERVICE_BUBBLES: readonly ServiceBubble[] = [
  { id: "vfx-cgi", name: "VFX / CGI", accent: "#D4AF37", size: 220, pos: { x: 4, y: 6 }, floatAmp: 9, floatDur: 5.2, icon: VfxIcon },
  { id: "ai-assisted-vfx", name: "AI-Assisted VFX", accent: "#7a5cff", size: 185, pos: { x: 36, y: 0 }, floatAmp: 11, floatDur: 6.1, icon: AiVfxIcon },
  { id: "ai-filmmaking", name: "AI Filmmaking", accent: "#5b7fa6", size: 200, pos: { x: 66, y: 6 }, floatAmp: 8, floatDur: 5.7, icon: AiFilmIcon },
  { id: "onset-supervision", name: "On-Set VFX Supervision", accent: "#c08a4d", size: 195, pos: { x: 16, y: 48 }, floatAmp: 10, floatDur: 6.4, icon: OnsetIcon },
  { id: "storyboard-previs", name: "Storyboard & Previsualization", accent: "#e8a33d", size: 230, pos: { x: 43, y: 36 }, floatAmp: 7, floatDur: 5.0, icon: PrevisIcon },
  { id: "roto-paint-matchmove", name: "Rotoscopy / Paint / Matchmove", accent: "#8e2434", size: 185, pos: { x: 72, y: 46 }, floatAmp: 12, floatDur: 6.8, icon: RotoIcon },
  { id: "technical-qc", name: "Technical QC", accent: "#ff6a3d", size: 150, pos: { x: 58, y: 72 }, floatAmp: 9, floatDur: 5.5, icon: QcIcon },
];
