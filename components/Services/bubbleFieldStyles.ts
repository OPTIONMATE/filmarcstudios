export const BUBBLE_FIELD_CSS = `
.bubble-field { position: relative; width: 100%; height: 760px; }
.bubble { position: absolute; top: 0; left: 0; will-change: transform; }
.bubble__float { width: 100%; height: 100%; will-change: transform; }
.bubble__sphere {
  position: relative; width: 100%; height: 100%; border-radius: 9999px;
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 8px; padding: 15%; text-align: center; overflow: hidden;
  color: var(--filmarc-chalk);
  background:
    radial-gradient(circle at 30% 24%, rgba(255,255,255,0.34) 0%, rgba(255,255,255,0.08) 22%, transparent 40%),
    radial-gradient(circle at 50% 55%, var(--bubble-accent-soft) 0%, transparent 62%),
    radial-gradient(circle at 50% 50%, rgba(4,5,10,0.05) 0%, rgba(4,5,10,0.42) 100%);
  border: 1px solid color-mix(in srgb, var(--bubble-accent) 45%, transparent);
  box-shadow:
    inset 0 2px 10px rgba(255,255,255,0.20),
    inset 0 -14px 28px rgba(0,0,0,0.45),
    inset 6px 0 18px color-mix(in srgb, var(--bubble-accent) 22%, transparent),
    inset -6px 0 18px rgba(0,0,0,0.35),
    0 18px 44px rgba(0,0,0,0.55),
    0 0 34px color-mix(in srgb, var(--bubble-accent) 16%, transparent);
  transition: box-shadow 300ms ease, border-color 300ms ease;
}
.bubble__sphere::before {
  content: ""; position: absolute; left: 16%; top: 9%; width: 34%; height: 20%;
  border-radius: 9999px; transform: rotate(-18deg);
  background: radial-gradient(ellipse at center, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0) 70%);
  pointer-events: none;
}
.bubble__sphere::after {
  content: ""; position: absolute; right: 12%; bottom: 10%; width: 44%; height: 26%;
  border-radius: 9999px; transform: rotate(18deg);
  background: radial-gradient(ellipse at center, color-mix(in srgb, var(--bubble-accent) 30%, transparent) 0%, transparent 70%);
  pointer-events: none;
}
.bubble__icon { width: 26px; height: 26px; color: var(--bubble-accent); flex: none; }
.bubble__icon svg { width: 100%; height: 100%; }
.bubble__name { font-family: var(--font-body); font-weight: 700; font-size: 0.78rem; letter-spacing: 0.14em; text-transform: uppercase; line-height: 1.5; text-wrap: balance; max-width: 100%; }
.bubble__node { border-radius: 9999px; }
.bubble__node:hover .bubble__sphere, .bubble__node:focus-visible .bubble__sphere {
  border-color: color-mix(in srgb, var(--bubble-accent) 75%, transparent);
  box-shadow:
    inset 0 2px 12px rgba(255,255,255,0.28),
    inset 0 -14px 28px rgba(0,0,0,0.42),
    inset 6px 0 20px color-mix(in srgb, var(--bubble-accent) 34%, transparent),
    inset -6px 0 18px rgba(0,0,0,0.35),
    0 18px 44px rgba(0,0,0,0.55),
    0 0 48px color-mix(in srgb, var(--bubble-accent) 30%, transparent);
}
.bubble__node:focus-visible { outline: 2px solid var(--filmarc-cta); outline-offset: 6px; }
@media (max-width: 1023.5px) { .bubble-field { height: 640px; } }
@media (max-width: 767.5px) {
  .bubble-field { display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 22px; height: auto; padding: 8px 0 4px; }
  .bubble { position: relative; flex: none; }
  .bubble__name { font-size: 0.72rem; }
  .bubble__icon { width: 24px; height: 24px; }
}
@media (prefers-reduced-motion: reduce) { .bubble, .bubble__float { transform: none !important; } }
`;
