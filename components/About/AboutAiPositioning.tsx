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
        const caption = section.querySelector("[data-ai-caption]");
        if (!reelSpin || !viewport || !strip || !scene || !caption) return;

        const measure = () =>
          Math.max(0, (strip as HTMLElement).scrollWidth - (viewport as HTMLElement).clientWidth);

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

        tl.fromTo(strip, { x: () => -measure() * 0.9 }, { x: 0, duration: 1 }, 0);
        tl.fromTo(reelSpin, { rotation: 0 }, { rotation: REEL_TURNS * 360, duration: 1 }, 0);
        tl.fromTo(cells, { opacity: 0.25 }, { opacity: 1, duration: 0.2, stagger: 0.14 }, 0.05);
        tl.fromTo(caption, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.08 }, 0.9);
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
