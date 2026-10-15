import type { SupervisorArtwork } from "@/components/Home/projects";

export const POSTER_GOLD = "var(--filmarc-cta)";
export const POSTER_IVORY = "var(--filmarc-star-core)";

export function MahakaliArt() {
  const cx = 200;
  const cy = 128;
  const rays = Array.from({ length: 72 }, (_, i) => (i * 360) / 72);
  return (
    <svg viewBox="0 0 400 260" role="presentation" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
      {rays.map((angle) => (
        <line
          key={angle}
          x1={cx + Math.cos((angle * Math.PI) / 180) * 44}
          y1={cy + Math.sin((angle * Math.PI) / 180) * 44}
          x2={cx + Math.cos((angle * Math.PI) / 180) * 150}
          y2={cy + Math.sin((angle * Math.PI) / 180) * 150}
          stroke={POSTER_GOLD}
          strokeOpacity={angle % 10 === 0 ? 0.34 : 0.13}
          strokeWidth={angle % 10 === 0 ? 1 : 0.6}
        />
      ))}
      {[112, 88, 64].map((r, i) => (
        <circle key={r} cx={cx} cy={cy} r={r} fill="none" stroke={POSTER_GOLD}
          strokeOpacity={0.22 - i * 0.05} strokeWidth={0.8}
          strokeDasharray={i === 1 ? "3 5" : undefined} />
      ))}
      <circle cx={cx} cy={cy} r={38} fill="none" stroke={POSTER_GOLD} strokeOpacity={0.75} strokeWidth={1.4} />
      <circle cx={cx} cy={cy} r={3.2} fill="#ff3b4e" />
      <circle cx={cx} cy={cy} r={8} fill="none" stroke="#ff3b4e" strokeOpacity={0.5} strokeWidth={0.8} />
    </svg>
  );
}

export function AdhiraArt() {
  const rings = [14, 26, 40, 56, 74, 94, 116, 140];
  return (
    <svg viewBox="0 0 400 260" role="presentation" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
      {rings.map((rx, i) => (
        <ellipse key={rx} cx={200} cy={130} rx={rx * 1.45} ry={rx * 0.52} fill="none"
          stroke={i % 2 === 0 ? "#7fb2ff" : POSTER_GOLD}
          strokeOpacity={i < 3 ? 0.55 - i * 0.08 : 0.28 - (i - 3) * 0.035}
          strokeWidth={i < 2 ? 1.2 : 0.8} />
      ))}
      <ellipse cx={200} cy={130} rx={7} ry={4} fill="#cfe4ff" opacity={0.9} />
    </svg>
  );
}

export function JaiHanumanArt() {
  const arcs = [30, 48, 68, 90, 114, 140];
  return (
    <svg viewBox="0 0 400 260" role="presentation" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
      {arcs.map((r, i) => (
        <path key={r} d={`M ${200 - r} 190 A ${r} ${r} 0 0 1 ${200 + r} 190`}
          fill="none" stroke={POSTER_GOLD}
          strokeOpacity={0.62 - i * 0.07} strokeWidth={i < 2 ? 1.3 : 0.9} />
      ))}
      <path d="M 186 190 A 14 14 0 0 1 214 190" fill="none"
        stroke={POSTER_IVORY} strokeOpacity={0.85} strokeWidth={1.2} />
    </svg>
  );
}

export function BhagavanthuduArt() {
  const cx = 200;
  const cy = 132;
  const diamonds = [22, 42, 64, 88, 114];
  return (
    <svg viewBox="0 0 400 260" role="presentation" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
      {diamonds.map((r, i) => (
        <g key={r}>
          <rect x={cx - r} y={cy - r} width={r * 2} height={r * 2} fill="none"
            stroke={POSTER_GOLD} strokeOpacity={0.55 - i * 0.07}
            strokeWidth={i < 2 ? 1.2 : 0.8}
            transform={`rotate(45 ${cx} ${cy})`} />
          <rect x={cx - r} y={cy - r} width={r * 2} height={r * 2} fill="none"
            stroke="#ff6a3d" strokeOpacity={0.28 - i * 0.03} strokeWidth={0.7} />
        </g>
      ))}
      <circle cx={cx} cy={cy} r={4} fill={POSTER_GOLD} opacity={0.9} />
    </svg>
  );
}

export function JangaaArt() {
  const lines = Array.from({ length: 13 }, (_, i) => 34 + i * 14);
  return (
    <svg viewBox="0 0 400 260" role="presentation" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
      {lines.map((y, i) => (
        <path key={y} d={`M 60 ${y} Q 200 ${y - 26 + (i % 3) * 8} 340 ${y}`}
          fill="none" stroke={i % 3 === 1 ? "#35d6f5" : POSTER_GOLD}
          strokeOpacity={0.5 - Math.abs(i - 6) * 0.045}
          strokeWidth={i === 6 ? 1.4 : 0.9} />
      ))}
      <circle cx={200} cy={118} r={5} fill={POSTER_IVORY} opacity={0.9} />
    </svg>
  );
}

export function DharmaArt() {
  const cx = 200;
  const cy = 130;
  const spokes = Array.from({ length: 24 }, (_, i) => (i * 360) / 24);
  const rings = [26, 52, 78, 104];
  return (
    <svg viewBox="0 0 400 260" role="presentation" className="h-full w-full" preserveAspectRatio="xMidYMid slice">
      {rings.map((r, i) => (
        <circle key={r} cx={cx} cy={cy} r={r} fill="none" stroke={POSTER_GOLD}
          strokeOpacity={0.55 - i * 0.08} strokeWidth={i === 0 ? 1.3 : 0.9} />
      ))}
      {spokes.map((angle) => (
        <line key={angle}
          x1={cx + Math.cos((angle * Math.PI) / 180) * 26}
          y1={cy + Math.sin((angle * Math.PI) / 180) * 26}
          x2={cx + Math.cos((angle * Math.PI) / 180) * 104}
          y2={cy + Math.sin((angle * Math.PI) / 180) * 104}
          stroke={POSTER_GOLD} strokeOpacity={0.3} strokeWidth={0.7} />
      ))}
      <circle cx={cx} cy={cy} r={9} fill="none" stroke={POSTER_IVORY} strokeOpacity={0.9} strokeWidth={1.2} />
      <circle cx={cx} cy={cy} r={3} fill={POSTER_GOLD} />
    </svg>
  );
}


export const POSTER_ART: Record<SupervisorArtwork, () => React.JSX.Element> = {
  mahakali: MahakaliArt,
  adhira: AdhiraArt,
  "jai-hanuman": JaiHanumanArt,
  bhagavanthudu: BhagavanthuduArt,
  jangaa: JangaaArt,
  dharma: DharmaArt,
};

export const POSTER_FIELD: Record<SupervisorArtwork, string> = {
  mahakali: "radial-gradient(120% 90% at 50% 18%, #3d0f1e 0%, #1c0a18 45%, #070a16 100%)",
  adhira: "radial-gradient(120% 90% at 50% 22%, #12244d 0%, #0a142e 48%, #05070f 100%)",
  "jai-hanuman": "radial-gradient(120% 90% at 50% 20%, #3a2410 0%, #201307 48%, #0a0705 100%)",
  bhagavanthudu: "radial-gradient(120% 90% at 50% 20%, #2b1210 0%, #170b0e 48%, #070507 100%)",
  jangaa: "radial-gradient(120% 90% at 50% 20%, #0e2a33 0%, #0a1620 48%, #04070b 100%)",
  dharma: "radial-gradient(120% 90% at 50% 20%, #2e1f0e 0%, #191007 48%, #070503 100%)",
};
