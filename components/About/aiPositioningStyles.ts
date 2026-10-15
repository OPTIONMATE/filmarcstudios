export const AI_POSITIONING_CSS = `
.ai-stage { display: flex; flex-direction: column; justify-content: center; min-height: calc(100svh - 96px); padding: 0.5rem 0; }
.ai-scene { position: relative; display: flex; align-items: center; min-height: 300px; margin-top: 1.25rem; }
.ai-reel { position: relative; z-index: 2; width: 280px; height: 280px; flex: none; margin-right: -46px; margin-left: -24px; will-change: transform; }
.ai-reel__spin { width: 100%; height: 100%; will-change: transform; }
.ai-reel__img { width: 100%; height: 100%; object-fit: contain; }
.ai-reel__hub { position: absolute; left: 50%; top: 50%; width: 26px; height: 26px; transform: translate(-50%,-50%); border-radius: 9999px; background: var(--filmarc-cta); box-shadow: 0 0 0 6px var(--filmarc-void), 0 0 0 7px var(--filmarc-cta); }
.ai-strip-viewport { position: relative; flex: 1 1 auto; min-width: 0; overflow: hidden; padding: 6px 0 6px 40px; }
.ai-film { width: max-content; background: #05060a; border-top: 1px solid color-mix(in srgb, var(--filmarc-cta) 55%, transparent); border-bottom: 1px solid color-mix(in srgb, var(--filmarc-cta) 55%, transparent); will-change: transform; }
.ai-film__rail { display: flex; gap: 14px; padding: 9px 18px; }
.ai-film__rail--top { border-bottom: 1px solid color-mix(in srgb, var(--filmarc-cta) 22%, transparent); }
.ai-film__rail--bottom { border-top: 1px solid color-mix(in srgb, var(--filmarc-cta) 22%, transparent); }
.ai-film__hole { width: 12px; height: 9px; flex: none; border-radius: 2.5px; background: color-mix(in srgb, var(--filmarc-chalk) 16%, transparent); box-shadow: inset 0 0 0 1px color-mix(in srgb, var(--filmarc-cta) 28%, transparent); }
.ai-cells { display: flex; gap: 0; padding: 18px; }
.ai-cell { position: relative; width: 160px; flex: none; padding: 0 10px; border-left: 1px solid color-mix(in srgb, var(--filmarc-cta) 28%, transparent); }
.ai-cell:first-child { border-left: none; }
.ai-cell__flash { position: absolute; inset: 0; background: color-mix(in srgb, var(--filmarc-cta) 22%, transparent); opacity: 0; pointer-events: none; }
.ai-frame { background: transparent; border: none; border-radius: 0; overflow: visible; }
.ai-frame__body { display: flex; flex-direction: column; align-items: center; padding: 18px 12px 16px; text-align: center; }
.ai-frame__index { font-size: 0.62rem; letter-spacing: 0.3em; text-indent: 0.3em; color: var(--filmarc-smoke); font-family: var(--font-body); }
.ai-frame__icon { width: 34px; height: 34px; margin-top: 10px; color: var(--filmarc-cta); }
.ai-frame__title { margin-top: 10px; font-size: 0.72rem; font-weight: 700; letter-spacing: 0.22em; text-indent: 0.22em; text-transform: uppercase; color: var(--filmarc-chalk); font-family: var(--font-body); }
.ai-cell__desc { margin-top: 14px; font-size: 0.82rem; line-height: 1.55; color: var(--filmarc-ash); font-family: var(--font-body); }
.ai-cell__rule { display: block; width: 100%; height: 1px; margin-bottom: 10px; background: color-mix(in srgb, var(--filmarc-cta) 45%, transparent); }
.ai-caption { margin-top: 2rem; font-size: 0.7rem; font-weight: 600; letter-spacing: 0.24em; text-transform: uppercase; color: var(--filmarc-cta); font-family: var(--font-body); }
.ai-m-reel { width: 200px; height: 200px; }
.ai-m-card { border: 1px solid var(--filmarc-hairline); border-radius: 14px; background: var(--filmarc-ink); padding: 18px; }
.ai-m-icon { width: 26px; height: 26px; color: var(--filmarc-cta); flex: none; }
.ai-m-title { font-size: 0.78rem; font-weight: 700; letter-spacing: 0.18em; text-transform: uppercase; color: var(--filmarc-chalk); font-family: var(--font-body); }
.ai-m-desc { margin-top: 10px; font-size: 0.88rem; line-height: 1.55; color: var(--filmarc-ash); font-family: var(--font-body); }
@media (prefers-reduced-motion: reduce) { .ai-reel__spin, .ai-film { transform: none !important; } }
`;
