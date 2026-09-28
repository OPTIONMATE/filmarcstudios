/**
 * FILMARC STUDIOS — contact heading.
 *
 * A modest heading, nothing more. Plain markup, no animation.
 */
export default function ContactHero() {
  return (
    <section className="w-full bg-void px-6 pt-32 pb-10 sm:px-10 lg:pt-40 lg:pb-12">
      <div className="mx-auto flex w-full max-w-3xl flex-col items-start">
        <p className="font-body text-[0.7rem] font-semibold uppercase tracking-[0.28em] text-smoke sm:text-xs">
          <span className="text-cta">01</span>
          <span aria-hidden className="mx-3 text-hairline">
            /
          </span>
          Contact
        </p>

        <h1 className="mt-5 font-display text-4xl uppercase leading-[0.95] tracking-[0.01em] text-bright sm:text-5xl">
          Let&apos;s talk <span className="text-cta">pictures</span>
        </h1>
      </div>
    </section>
  );
}

