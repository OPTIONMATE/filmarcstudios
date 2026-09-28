import { Fragment } from "react";

export type HeadingLine = readonly string[];

/**
 * One word in FilmArc's signature two-tier display style:
 * - First letter of every word at full size (1em) via `heading-initial`
 * - Subsequent letters at 75% size (0.75em) via `heading-rest` on the same baseline
 *
 * Each character is rendered as an `inline-block` span with an optional animation
 * hook attribute (`charMarker`), rendered statically at build time so the server's HTML
 * already contains the character breakdown without needing client-side DOM rewrites.
 */
export function HeroStyleWord({
  word,
  charMarker = "data-about-char",
}: {
  word: string;
  charMarker?: string;
}) {
  return (
    <span className="inline-block">
      {[...word].map((character, characterIndex) => (
        <span
          key={`${word}-${characterIndex}`}
          {...{ [charMarker]: true }}
          className={`inline-block ${
            characterIndex === 0 ? "heading-initial" : "heading-rest"
          }`}
        >
          {character}
        </span>
      ))}
    </span>
  );
}

/**
 * FilmArc Studios — Display Heading component with mandatory signature typography:
 * First letter big (`heading-initial`), rest smaller (`heading-rest`), with optional
 * accent/lime word highlighting.
 */
export function DisplayHeading({
  lines,
  label,
  accentWords = [],
  charMarker = "data-about-char",
  className = "",
  as: Tag = "h2",
  id,
}: {
  lines: readonly HeadingLine[];
  label: string;
  accentWords?: readonly string[];
  charMarker?: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p";
  id?: string;
}) {
  return (
    <Tag id={id} className={className}>
      <span className="sr-only">{label}</span>
      <span aria-hidden>
        {lines.map((words, lineIndex) => (
          <span key={lineIndex} className="block">
            {words.map((word, wordIndex) => (
              <Fragment key={`${word}-${wordIndex}`}>
                {wordIndex > 0 ? " " : null}
                <span
                  className={
                    accentWords.includes(word) ? "text-cta" : undefined
                  }
                >
                  <HeroStyleWord word={word} charMarker={charMarker} />
                </span>
              </Fragment>
            ))}
          </span>
        ))}
      </span>
    </Tag>
  );
}
