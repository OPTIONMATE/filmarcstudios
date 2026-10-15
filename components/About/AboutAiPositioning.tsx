"use client";

import { useRef } from "react";

import { AI_CAPTION } from "@/components/About/aiStages";
import {
  AiPositioningHeader,
  AiReelScene,
  AiStaticFallback,
} from "@/components/About/AiReelScene";
import { gsap } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";

const REEL_TURNS = 1.5;

export default function AboutAiPositioning() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useIsomorphicLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
      const ctx = gsap.context(() => {
        const reelSpin = section.querySelector("[data-ai-reel-spin]");
        const viewport = section.querySelector("[data-ai-viewport]");
        const strip = section.querySelector("[data-ai-strip]");
        const scene = section.querySelector("[data-ai-scene]");
        const cells = gsap.utils.toArray<HTMLElement>("[data-ai-cell]", section);
        const flashes = gsap.utils.toArray<HTMLElement>("[data-ai-flash]", section);
        const caption = section.querySelector("[data-ai-caption]");
        if (!reelSpin || !viewport || !strip || !scene || !caption) return;

        /* Physical unwind: the band slides right → left out of the reel.
           Parked with its RIGHT edge exactly at the viewport's left edge, so
           zero pixels show initially — every frame travels out from inside
           the reel. Each cell's gold flash fires at the scrub instant its
           centre clears the reel edge, then hands off to the next. */
        const measure = () =>
          Math.max(0, (strip as HTMLElement).scrollWidth - (viewport as HTMLElement).clientWidth);
        const parkedX = () => -(measure() + (viewport as HTMLElement).clientWidth);
        const exitAt = (cell: HTMLElement) => {
          const total = parkedX() === 0 ? 1 : -parkedX();
          const edge = (viewport as HTMLElement).clientWidth * 0 + 40;
          const pos = cell.offsetLeft + cell.offsetWidth * 0.5 + edge;
          return Math.min(0.94, Math.max(0.04, 1 - pos / total));
        };

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: scene,
            start: "top top+=48",
            end: "+=1700",
            pin: true,
            scrub: 0.6,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        tl.fromTo(strip, { x: parkedX }, { x: 0, duration: 1 }, 0);
        tl.fromTo(reelSpin, { rotation: 0 }, { rotation: REEL_TURNS * 360, duration: 1 }, 0);
        cells.forEach((cell, i) => {
          const flash = flashes[i];
          if (!flash) return;
          const at = exitAt(cell);
          tl.fromTo(flash, { opacity: 0 }, { opacity: 1, duration: 0.025 }, at);
          tl.to(flash, { opacity: 0, duration: 0.055 }, at + 0.025);
        });
        tl.fromTo(caption, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.08 }, 0.92);
      }, section);

      return () => ctx.revert();
    });

    mm.add("(max-width: 1023.5px) and (prefers-reduced-motion: no-preference)", () => {
      const items = gsap.utils.toArray<HTMLElement>("[data-ai-m-item]", section);
      const reel = section.querySelector("[data-ai-m-reel]");
      gsap.set(items, { y: 26, opacity: 0 });
      if (reel) gsap.set(reel, { opacity: 0, scale: 0.92 });
      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: { trigger: section, start: "top 78%", once: true },
      });
      if (reel) tl.to(reel, { opacity: 1, scale: 1, duration: 0.7, clearProps: "transform,opacity" });
      tl.to(items, { y: 0, opacity: 1, duration: 0.6, stagger: 0.09, clearProps: "transform,opacity" }, "-=0.35");
      return () => {
        tl.scrollTrigger?.kill();
        tl.kill();
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="ai-positioning-heading"
      className="relative block overflow-x-clip border-t border-hairline bg-void py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto w-full max-w-7xl px-6 sm:px-10">
        <div className="hidden lg:block">
          <div className="ai-stage" data-ai-scene>
            <AiPositioningHeader />
            <AiReelScene />
            <p data-ai-caption className="ai-caption">
              {AI_CAPTION}
            </p>
          </div>
        </div>
        <div className="lg:hidden">
          <AiPositioningHeader />
        </div>
        <AiStaticFallback />
      </div>
    </section>
  );
}
