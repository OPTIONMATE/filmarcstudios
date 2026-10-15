"use client";

import { useRef } from "react";

import { BUBBLE_FIELD_CSS } from "@/components/Services/bubbleFieldStyles";
import { SERVICE_BUBBLES } from "@/components/Services/serviceBubbles";
import { gsap } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";

/**
 * FilmArc Studios — interactive service bubble field (Services page).
 *
 * Seven translucent spheres on asymmetric home positions. Each bubble owns
 * a `.bubble` positioner (GSAP x/y: float + elastic cursor pull) and an
 * inner `.bubble__float` (idle sine drift), so the two motions never fight.
 * Pointer math runs one rAF-throttled pass per frame with cached centres —
 * no React state per mousemove. Touch + reduced-motion get a stable field.
 * Bubbles are non-interactive list items: no dead click targets.
 */

const INFLUENCE = 220;
const MAX_PULL = 34;

function accentSoft(hex: string) {
  return `color-mix(in srgb, ${hex} 26%, transparent)`;
}

export default function BubbleField() {
  const fieldRef = useRef<HTMLUListElement | null>(null);

  useIsomorphicLayoutEffect(() => {
    const field = fieldRef.current;
    if (!field) return;
    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        const nodes = gsap.utils.toArray<HTMLElement>("[data-bubble]", field);
        const floats = gsap.utils.toArray<HTMLElement>("[data-bubble-float]", field);

        floats.forEach((el, i) => {
          const amp = Number(el.dataset.amp ?? 9);
          const dur = Number(el.dataset.dur ?? 5.5);
          gsap.to(el, {
            x: amp,
            y: -amp,
            duration: dur,
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut",
            delay: i * 0.6,
          });
        });

        const fine = window.matchMedia("(pointer: fine)").matches;
        if (!fine) return;

        let centres: { x: number; y: number }[] = [];
        const refresh = () => {
          const fr = field.getBoundingClientRect();
          centres = nodes.map((n) => {
            const r = n.getBoundingClientRect();
            return { x: r.left - fr.left + r.width / 2, y: r.top - fr.top + r.height / 2 };
          });
        };
        refresh();
        window.addEventListener("resize", refresh);

        let px = -9999;
        let py = -9999;
        let raf = 0;
        let queued = false;

        const apply = () => {
          queued = false;
          const fr = field.getBoundingClientRect();
          const lx = px - fr.left;
          const ly = py - fr.top;
          nodes.forEach((n, i) => {
            const c = centres[i];
            if (!c) return;
            const dx = lx - c.x;
            const dy = ly - c.y;
            const d = Math.hypot(dx, dy);
            let tx = 0;
            let ty = 0;
            if (d < INFLUENCE && d > 0.5) {
              const pull = (1 - d / INFLUENCE) * MAX_PULL;
              tx = (dx / d) * pull;
              ty = (dy / d) * pull;
            }
            gsap.to(n, { x: tx, y: ty, duration: 0.9, ease: "elastic.out(1, 0.45)", overwrite: "auto" });
          });
        };

        const onMove = (e: PointerEvent) => {
          px = e.clientX;
          py = e.clientY;
          if (!queued) {
            queued = true;
            raf = requestAnimationFrame(apply);
          }
        };
        const onLeave = () => {
          px = -9999;
          py = -9999;
          nodes.forEach((n) =>
            gsap.to(n, { x: 0, y: 0, duration: 1.1, ease: "elastic.out(1, 0.4)", overwrite: "auto" }),
          );
        };

        field.addEventListener("pointermove", onMove);
        field.addEventListener("pointerleave", onLeave);

        return () => {
          cancelAnimationFrame(raf);
          window.removeEventListener("resize", refresh);
          field.removeEventListener("pointermove", onMove);
          field.removeEventListener("pointerleave", onLeave);
        };
      }, field);
      return () => ctx.revert();
    });

    return () => mm.revert();
  }, []);

  return (
    <>
      <style>{BUBBLE_FIELD_CSS}</style>
      <ul ref={fieldRef} aria-label="Filmarc Studios services" className="bubble-field">
        {SERVICE_BUBBLES.map((bubble) => {
          const Icon = bubble.icon;
          return (
            <li
              key={bubble.id}
              data-bubble
              aria-label={bubble.name}
              className="bubble"
              style={{ left: `${bubble.pos.x}%`, top: `${bubble.pos.y}%`, width: bubble.size, height: bubble.size }}
            >
              <div data-bubble-float data-amp={bubble.floatAmp} data-dur={bubble.floatDur} className="bubble__float">
                <div
                  className="bubble__sphere"
                  style={{ ["--bubble-accent" as string]: bubble.accent, ["--bubble-accent-soft" as string]: accentSoft(bubble.accent) } as React.CSSProperties}
                >
                  <span className="bubble__icon">
                    <Icon />
                  </span>
                  <span className="bubble__name">{bubble.name}</span>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}
