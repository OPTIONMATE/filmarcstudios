"use client";

import Image from "next/image";
import { useRef } from "react";

import CubeText from "@/components/CubeText";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { useIsomorphicLayoutEffect } from "@/lib/useIsomorphicLayoutEffect";

/**
 * FilmArc Studios — the footer, the closing sequence.
 *
 * Three visual zones, one continuous scroll arrival, and at the very bottom the
 * studio's architectural signature: an enormous FILMARC wordmark in Bowlby,
 * an outline only at rest, that a broad cursor-following light fills.
 *
 *   Zone A — BRAND AND DESCRIPTION. The logo (`public/images/Logo.png`, the
 *            same mark the navbar carries) at the upper-left, and beneath it
 *            the studio's description — "Build Your Film's /
 *            Visual World With Us" — in Manrope, first line ivory, second
 *            line classic gold. Plain statement copy, not a link.
 *   Zone B — THE COORDINATES. Three columns — Contact, Registered, Office — in
 *            small-uppercase eyebrows with restrained tracking over readable
 *            body copy. The email is a `mailto:` link and the phone lines are
 *            `tel:` links, each with a restrained gold transition; the addresses
 *            are plain flowing paragraphs, unbracketed by cards or icons.
 *   Zone C — THE WORDMARK. One word, FILMARC, in Bowlby at the full viewport
 *            width, cropped at the footer's bottom edge with the top content
 *            allowed to overlap its crown. At rest it is an outline only
 *            (transparent fill, hairline chalk stroke — the `.footer-sigil`
 *            base layer); the `.footer-sigil__lit` twin is identical in every
 *            metric and carries the same word filled — but is *masked* to a
 *            broad radial window that follows the pointer, so a continuous
 *            region of several neighbouring characters illuminates at once,
 *            never a single letter. Two layers, one box: they can never
 *            disagree about metrics.
 *
 * SPOTLIGHT MECHANICS
 * -------------------
 * The pointer is tracked on the sigil's own box (no React state, no re-renders):
 * a `pointermove` listener records the cursor as fractions of the box, a
 * `requestAnimationFrame` loop eases the live values toward the recorded ones —
 * the smoothing *is* the feathered follow — and the results are written to
 * `--sigil-x` / `--sigil-y`, which the stylesheet's radial mask reads.
 * `pointerenter` raises `--sigil-glow` toward 1 and `pointerleave` parks it back
 * at 0, so the light fades in and out rather than snapping. The loop and the
 * listeners are cancelled and removed in one cleanup, beside the `gsap.context`
 * revert. No GSAP in the follow: there is nothing to tween, only two numbers
 * chasing the cursor.
 *
 * Touch has no hover to follow, so coarse pointers (and reduced-motion
 * visitors, for whom the mask never opens) get a tasteful static treatment: the
 * wordmark simply rests at its faint base ink — a tonal presence, never a
 * demand for a cursor it cannot have.
 *
 * MOTION
 * ------
 * One `gsap.timeline` on one ScrollTrigger for the content above the wordmark —
 * `start: "top bottom"`, no `once`, so leaving the viewport parks the entrance
 * on its opening frame and returning replays it. One soft rise-and-fade,
 * staggered in markup order. The wordmark itself gets its own small arrival: a
 * slow fade from nothing plus a short upward settle, gated behind the content,
 * so the signature is the last thing to resolve. Every tween is `power2.out` on
 * `opacity` and `transform` only, and both sequences end with `clearProps`.
 * `prefers-reduced-motion: reduce` returns before a single property is hidden
 * or moved — content and wordmark are simply already there.
 *
 * WHAT TO EDIT
 * ------------
 * `TAGLINE` for the description, `EMAIL`,
 * `PHONES`, `REGISTERED` and `OFFICE` for the details, and
 * `--sigil-glow-size` in app/globals.css for how broad the light is. No
 * addresses, links or credentials live anywhere else in this file.
 */

/** The studio's description. Rendered as two lines, ivory over gold, on purpose. */
const TAGLINE = ["Build Your Film's", "Visual World With Us"] as const;

/** The studio's inbox. Duplicated nowhere — the href is built from it. */
const EMAIL = "info@filmarcstudios.com";

/** The two phone lines, each a `tel:` link; the label is the number as written. */
const PHONES = [
  { label: "+91-8919 4866 38", href: "tel:+918919486638" },
  { label: "+91-9281277215", href: "tel:+919281277215" },
] as const;
/** The LLP's name and its registered address, one flowing paragraph. */
const REGISTERED = {
  name: "FilmArc Studios LLP",
  address:
    "D.No: 6-3, VV Vintage Residency, 1093, Raj Bhavan Rd, Somajiguda, Hyderabad, Telangana 500082",
} as const;

/**
 * The working office in Amaravati, one flowing paragraph. */
const OFFICE =
  "Villa Number 9, Misty First Avenue Villas, Near ISKCON Temple, Vundavalli, Amaravati, Andhra Pradesh 522501";

/** The one word the signature renders. Nothing else goes in it. */
const SIGIL = "FILMARC";

/** What a screen reader hears in place of the signature. */
const SIGIL_LABEL = "Filmarc Studios";

/**
 * Where the content above the wordmark starts, before the entrance brings it
 * home: slightly below, fully transparent. Never in from somewhere else, never
 * scaled — a short rise and a fade.
 */
const OPENING = {
  item: { autoAlpha: 0, y: 22 },
  sigil: { autoAlpha: 0, y: 34 },
} as const;

/**
 * One ease for the whole entrance. `power2.out` starts moving immediately and
 * eases out the whole way, so a tween is never stalled at its start and never
 * rushes at its end.
 */
const EASE = "power2.out";

/** The columns arrive one behind the next; the signature resolves last. */
const ITEM_DURATION = 0.85;
const ITEM_STAGGER = 0.09;
const SIGIL_DURATION = 1.6;
const SIGIL_DELAY = 0.75;

/**
 * How eagerly the spotlight chases the pointer: each animation frame the live
 * position covers this fraction of the remaining distance. Small enough to
 * glide, large enough to never feel detached.
 */
const SPOTLIGHT_EASE = 0.12;

/** The shared look of a column's eyebrow: small, uppercase, quietly tracked. */
const EYEBROW =
  "font-body text-[0.68rem] font-medium uppercase tracking-[0.24em] text-smoke";

/** The shared look of the body copy under an eyebrow. */
const BODY = "font-body text-[0.92rem] leading-[1.7] text-ash";

/** The shared look of an actionable line — email, phone — and its gold answer. */
const CONTACT_LINK =
  "text-ash underline decoration-hairline underline-offset-[5px] transition-colors duration-500 hover:text-cta hover:decoration-cta focus-visible:text-cta focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cta";
export default function Footer() {
  const footerRef = useRef<HTMLElement | null>(null);
  /** The sigil's box — the only element the spotlight measures and writes to. */
  const sigilRef = useRef<HTMLDivElement | null>(null);

  useIsomorphicLayoutEffect(() => {
    const footer = footerRef.current;
    const sigil = sigilRef.current;
    if (!footer || !sigil) return;

    /* The entrance targets are read from the DOM: the stagger's order is the
       markup's order, and a ref per item could only ever disagree with it. */
    const items = gsap.utils.toArray<HTMLElement>("[data-footer-item]", footer);
    if (items.length === 0) return;

    /* ======================================================================
       1 — THE ENTRANCE (skipped wholesale for reduced motion)
       ====================================================================== */
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(items, OPENING.item);
        gsap.set(sigil, OPENING.sigil);

        /* One paused timeline, played and parked by the trigger's callbacks
           alone — the trigger's own `toggleActions` are all "none". */
        const timeline = gsap.timeline({
          defaults: { ease: EASE },
          paused: true,
        });

        /** Plays the whole entrance, from its opening frame. */
        const play = () => timeline.restart();

        /** Waits on the opening frame — what the footer is left in between visits. */
        const park = () => timeline.pause(0);

        /* 1 — the content: the mark and line, the columns, the studio line. */
        timeline.to(items, {
          autoAlpha: 1,
          y: 0,
          duration: ITEM_DURATION,
          stagger: ITEM_STAGGER,
        });

        /* 2 — the signature, held back so it resolves last: a slow fade from
           nothing with a short upward settle, like a title coming into focus. */
        timeline.to(
          sigil,
          {
            autoAlpha: 1,
            y: 0,
            duration: SIGIL_DURATION,
          },
          SIGIL_DELAY,
        );

        /* And out: every property handed back to the stylesheet, which holds
           the finished footer. Nothing is left inline, so nothing can drift. */
        timeline.set([sigil, ...items], {
          clearProps: "transform,opacity,visibility",
        });

        /* `start: "top bottom"` is the moment the footer's top edge reaches the
           viewport's bottom — it is arriving, not arrived. `end: "bottom top"`
           is the other edge leaving, so between the two the footer overlaps the
           viewport: entering that window plays the entrance, leaving it parks
           the timeline back on its opening frame. Both leaving moments have the
           footer entirely outside the viewport, so the park can never be seen. */
        ScrollTrigger.create({
          animation: timeline,
          trigger: footer,
          start: "top bottom",
          end: "bottom top",
          toggleActions: "none none none",
          onEnter: play,
          onEnterBack: play,
          onLeave: park,
          onLeaveBack: park,
        });
      });
    }, footer);
    /* ======================================================================
       2 — THE SPOTLIGHT (fine pointers only; still without motion)
       ======================================================================
       The lit twin of the wordmark is masked to a radial window around two
       custom properties, `--sigil-x` / `--sigil-y`, holding the cursor as
       fractions of the sigil's own box; `--sigil-glow` holds whether the light
       is on at all. Three listeners and one rAF loop keep them honest, and no
       React state is involved — the DOM is written to, never rendered from. */
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;

    /* The target the cursor is heading for, and the live position — both in
       box fractions, so a resize mid-glide cannot strand the light. */
    let targetX = 0.5;
    let targetY = 0.35;
    let liveX = targetX;
    let liveY = targetY;
    let liveGlow = 0;
    let targetGlow = 0;
    let frame = 0;

    const writeSpotlight = () => {
      sigil.style.setProperty("--sigil-x", liveX.toFixed(4));
      sigil.style.setProperty("--sigil-y", liveY.toFixed(4));
      sigil.style.setProperty("--sigil-glow", liveGlow.toFixed(4));
    };

    /* One always-on loop while the effect lives: each frame the live values
       cover a fraction of what remains, so the light glides after the cursor
       and settles onto it — and eases out again when the pointer leaves. */
    const tick = () => {
      liveX += (targetX - liveX) * SPOTLIGHT_EASE;
      liveY += (targetY - liveY) * SPOTLIGHT_EASE;
      liveGlow += (targetGlow - liveGlow) * SPOTLIGHT_EASE;
      /* Rest the values once they have arrived: at exactly 0 the mask's lit
         window closes completely and the wordmark is purely its base ink. */
      if (Math.abs(targetGlow - liveGlow) < 0.002) liveGlow = targetGlow;
      writeSpotlight();
      frame = requestAnimationFrame(tick);
    };

    const onPointerMove = (event: PointerEvent) => {
      const box = sigil.getBoundingClientRect();
      if (box.width === 0 || box.height === 0) return;
      targetX = (event.clientX - box.left) / box.width;
      targetY = (event.clientY - box.top) / box.height;
    };

    const onPointerEnter = () => {
      targetGlow = 1;
    };

    const onPointerLeave = () => {
      targetGlow = 0;
    };

    /* Coarse pointers get no listeners at all: the static base ink is the whole
       treatment. Reduced motion keeps the loop parked with the glow shut — the
       wordmark rests at its faint ink and never chases anything. */
    writeSpotlight();
    if (finePointer && !reduceMotion) {
      sigil.addEventListener("pointermove", onPointerMove);
      sigil.addEventListener("pointerenter", onPointerEnter);
      sigil.addEventListener("pointerleave", onPointerLeave);
      frame = requestAnimationFrame(tick);
    }

    /* One cleanup for both halves: the context reverts every tween, trigger
       and inline style, and the loop and listeners come down with it. */
    return () => {
      cancelAnimationFrame(frame);
      sigil.removeEventListener("pointermove", onPointerMove);
      sigil.removeEventListener("pointerenter", onPointerEnter);
      sigil.removeEventListener("pointerleave", onPointerLeave);
      ctx.revert();
    };
  }, []);
  return (
    <footer
      ref={footerRef}
      className="footer-sigil-scope relative overflow-x-clip border-t border-hairline bg-void"
    >
      <div className="relative z-10 mx-auto w-full max-w-[112rem] px-6 pt-16 sm:px-10 sm:pt-20">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)] lg:gap-16">
          {/* ZONE A — THE MARK AND THE LINE. The logo the navbar carries, and
              beneath it the studio's description in Manrope, regular weight:
              ivory over gold. Plain statement copy, not a link. */}
          <div data-footer-item>
            <Image
              src="/images/Logo.png"
              alt="FilmArc Studios"
              width={2170}
              height={725}
              sizes="(min-width: 64rem) 26rem, min(72vw, 19rem)"
              className="h-12 w-auto sm:h-14"
            />
            <p className="mt-8 font-hero-eyebrow text-xl leading-snug tracking-tight text-chalk sm:text-2xl">
              <span className="block">{TAGLINE[0]}</span>
              <span className="block text-cta">{TAGLINE[1]}</span>
            </p>
          </div>

          <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-3 md:gap-8">
            <div data-footer-item>
              <h2 className={EYEBROW}>Contact</h2>
              <ul className={`mt-5 space-y-2.5 ${BODY}`}>
                <li>
                  <a href={`mailto:${EMAIL}`} className={CONTACT_LINK}>
                    <CubeText label={EMAIL} />
                  </a>
                </li>
                {PHONES.map((phone) => (
                  <li key={phone.href}>
                    <a href={phone.href} className={CONTACT_LINK}>
                      <CubeText label={phone.label} />
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div data-footer-item>
              <h2 className={EYEBROW}>Registered Office</h2>
              <address className={`mt-5 not-italic ${BODY}`}>
                <p className="font-medium text-chalk">{REGISTERED.name}</p>
                <p className="mt-2.5">{REGISTERED.address}</p>
              </address>
            </div>

            <div data-footer-item>
              <h2 className={EYEBROW}>Office</h2>
              <address className={`mt-5 not-italic ${BODY}`}>
                <p>{OFFICE}</p>
              </address>
            </div>
          </div>
        </div>
      </div>
      
      <div ref={sigilRef} className="footer-sigil">
        <span className="sr-only">{SIGIL_LABEL}</span>
        <span aria-hidden className="footer-sigil__base">
          {SIGIL}
        </span>
        <span aria-hidden className="footer-sigil__lit">
          {SIGIL}
        </span>
      </div>
    </footer>
  );
}






