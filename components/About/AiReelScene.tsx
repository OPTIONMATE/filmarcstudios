"use client";

import Image from "next/image";

import { DisplayHeading } from "@/components/DisplayHeading";
import { AI_CAPTION, AI_STAGES } from "@/components/About/aiStages";
import { AI_POSITIONING_CSS } from "@/components/About/aiPositioningStyles";

const HEADING_LINES = [["AI", "that"], ["serves", "the"], ["filmmaker."]] as const;

function FrameCard({ stageIndex }: { stageIndex: number }) {
  const stage = AI_STAGES[stageIndex];
  const Icon = stage.icon;
  return (
    <div className="ai-frame">
      <div className="ai-frame__body">
        <span className="ai-frame__index">{stage.index}</span>
        <Icon className="ai-frame__icon" />
        <p className="ai-frame__title">{stage.title}</p>
      </div>
    </div>
  );
}

export function AiReelScene() {
  return (
    <div className="ai-scene">
      <div className="ai-reel" data-ai-reel>
        <div className="ai-reel__spin" data-ai-reel-spin>
          <Image
            src="/images/movie-reel.png"
            alt=""
            aria-hidden
            width={1263}
            height={1245}
            sizes="(min-width: 1024px) 300px, 220px"
            className="ai-reel__img"
            priority={false}
          />
        </div>
        <span aria-hidden className="ai-reel__hub" />
      </div>
      <div className="ai-strip-viewport" data-ai-viewport>
        <div className="ai-film" data-ai-strip>
          <div aria-hidden className="ai-film__rail ai-film__rail--top">
            {Array.from({ length: 60 }).map((_, i) => (
              <span key={i} className="ai-film__hole" />
            ))}
          </div>
          <div className="ai-cells">
            {AI_STAGES.map((stage, i) => (
              <div key={stage.index} className="ai-cell" data-ai-cell>
                <FrameCard stageIndex={i} />
              </div>
            ))}
          </div>
          <div aria-hidden className="ai-film__rail ai-film__rail--bottom">
            {Array.from({ length: 60 }).map((_, i) => (
              <span key={i} className="ai-film__hole" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function AiStaticFallback() {
  return (
    <div className="mt-10 lg:hidden">
      <div data-ai-m-reel className="ai-m-reel">
        <Image
          src="/images/movie-reel.png"
          alt="Film reel"
          width={1263}
          height={1245}
          sizes="200px"
          className="ai-reel__img"
          loading="lazy"
        />
      </div>
      <ol className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {AI_STAGES.map((stage) => (
          <li key={stage.index} data-ai-m-item className="ai-m-card">
            <div className="flex items-center gap-3">
              <stage.icon className="ai-m-icon" />
              <p className="ai-m-title">
                <span className="text-cta">{stage.index}</span>
                <span aria-hidden className="mx-2 text-hairline">/</span>
                {stage.title}
              </p>
            </div>
            <p className="ai-m-desc">{stage.description}</p>
          </li>
        ))}
      </ol>
      <p className="ai-caption mt-8">{AI_CAPTION}</p>
    </div>
  );
}

export function AiPositioningHeader() {
  return (
    <>
      <style>{AI_POSITIONING_CSS}</style>
      <p className="font-body text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-smoke sm:text-[0.7rem]">
        AI Positioning
      </p>
      <DisplayHeading
        id="ai-positioning-heading"
        lines={HEADING_LINES}
        label="AI that serves the filmmaker."
        accentWords={["filmmaker."]}
        charMarker="data-ai-head-char"
        className="mt-4 max-w-[16ch] font-display text-[clamp(2.75rem,6vw,5rem)] uppercase leading-[0.85] tracking-[0.01em] text-bright"
      />
    </>
  );
}
