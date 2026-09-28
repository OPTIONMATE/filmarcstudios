/**
 * FILMARC STUDIOS — the studio's contact facts.
 *
 * Everything the contact page states as a *fact* lives here, so the page has one
 * place to correct rather than five: the address the briefs go to, the promise
 * about how quickly they are answered, where the studio is, and the short lists
 * the form chooses from. Components read these — none of them hardcodes an
 * email, a phone number or an option list.
 *
 * WHAT IS IN HERE IS INTENDED TO BE EDITED
 * ----------------------------------------
 * - `STUDIO_EMAIL` is the address the rest of the site already publishes
 *   (components/Navbar.tsx, components/Services/ServicesContent.tsx,
 *   components/About/AboutHero.tsx), so it is the one value here taken from the
 *   existing site rather than invented.
 * - `RESPONSE_PROMISE` and `STUDIO_LOCATION` are claims the studio makes on the
 *   page. They are written to be true by default (a promise about replying, and
 *   the standard "address shared on request" line) and are the first thing to
 *   make specific when the studio wants to.
 * - A phone line, a street address and a timezone are deliberately **not**
 *   invented: neither exists anywhere in this repository, and digits or a city
 *   set in the studio's name would be worse than the omission. To add one, add
 *   a row to `CHANNELS` (commented example below) and nothing else changes.
 */

import { services } from "@/components/Home/services";

/** The studio's inbox. Published on the site already; the form defaults to it. */
export const STUDIO_EMAIL = "hello@filmarc.studio";

/** The promise the page makes, in one sentence. Used in the rail and the steps. */
export const RESPONSE_PROMISE = "We reply within one business day.";

/** Where the studio is. Deliberately not an invented street address. */
export const STUDIO_LOCATION = "Studio address shared on request.";

export interface Channel {
  /** Stable key for React. */
  id: string;
  /** The microcopy label above the value. */
  label: string;
  /** What the row says. */
  value: string;
  /** Present when the row is something you can act on (mailto:, tel:, https:). */
  href?: string;
}

/**
 * The direct lines shown beside the form. Add, remove or reorder rows here.
 *
 *   { id: "phone", label: "Phone", value: "+…", href: "tel:+…" },
 *
 * A row without an `href` renders as plain text, so a fact that is not
 * clickable still reads as part of the same list.
 */
export const CHANNELS: readonly Channel[] = [
  {
    id: "email",
    label: "Email",
    value: STUDIO_EMAIL,
    href: `mailto:${STUDIO_EMAIL}`,
  },
  { id: "response", label: "Response", value: RESPONSE_PROMISE },
  { id: "studio", label: "Studio", value: STUDIO_LOCATION },
];

/**
 * The form's discipline options: the same five the studio actually sells, read
 * from the services data (`components/Home/services.ts`) so the two lists can
 * never drift apart, plus the one honest way out for anything else. Rename a
 * service there and this select follows; nothing here needs editing.
 */
export const PROJECT_TYPES: readonly string[] = [
  ...services.map((service) => service.name),
  "Something else",
];

/** Placeholder row for the project select — its `value` must stay empty. */
export const PROJECT_TYPE_PLACEHOLDER = "Choose a discipline";

/** When the work has to be finished. Timeframes, not budgets: no currency is
 *  named anywhere on the site, so no currency is invented for a dropdown. */
export const TIMELINES: readonly string[] = [
  "As soon as possible",
  "Within 1–3 months",
  "Within 3–6 months",
  "Still exploring",
];

/** Placeholder row for the timeline select — its `value` must stay empty. */
export const TIMELINE_PLACEHOLDER = "Not sure yet";

/** The brief the studio needs to give a useful first answer. */
export const BRIEF_CHECKLIST: readonly string[] = [
  "Format & runtime",
  "Deliverables",
  "Release date",
  "Where we come in",
];

/** Subject line used when a brief is handed to the visitor's mail client. */
export const DRAFT_SUBJECT = "Project enquiry — FilmArc Studios";

/** The mailto: draft is a URL, and URLs have practical length limits. A long
 *  message is clipped to this many characters; the full text is still on the
 *  page for the visitor to paste. */
export const DRAFT_BODY_LIMIT = 1200;
