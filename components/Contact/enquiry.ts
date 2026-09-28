/**
 * FILMARC STUDIOS — the brief's contract.
 *
 * Shared by both sides of the form: `app/contact/actions.ts` (the Server Action
 * that receives it) and `components/Contact/ContactEnquiry.tsx` (the Client
 * Component that renders it). One declaration of the field list, the length
 * limits and the state the action returns means the browser's own validation
 * attributes and the server's authoritative checks can never disagree about
 * what "too long" means.
 *
 * Nothing here is secret: it is a shape and a set of limits, not the delivery.
 * (The action file is `"use server"` and may export *only* async functions,
 * which is why these live next to it rather than in it.)
 */

/** Every field the form sends, in the order it asks for them. */
export const CONTACT_FIELDS = [
  "name",
  "email",
  "company",
  "projectType",
  "timeline",
  "message",
] as const;

export type ContactField = (typeof CONTACT_FIELDS)[number];

/** What the visitor typed, echoed back so a failed send never loses it. */
export type ContactValues = Partial<Record<ContactField, string>>;

/** One message per field, keyed by field. */
export type ContactFieldErrors = Partial<Record<ContactField, string>>;

/**
 * `idle`         nothing submitted yet
 * `sent`         delivered, or dropped as a bot (see actions.ts) — the visitor
 *                is done either way
 * `invalid`      the server rejected one or more fields
 * `unconfigured` no delivery endpoint is configured on this deployment, so
 *                nothing was sent — and the page says exactly that
 * `error`        delivery was attempted and failed
 */
export type ContactStatus = "idle" | "sent" | "invalid" | "unconfigured" | "error";

export interface ContactState {
  status: ContactStatus;
  /** One sentence for the notice above the form. Empty while `idle`. */
  message: string;
  errors: ContactFieldErrors;
  values: ContactValues;
  /** Set when the brief can be handed to the visitor's mail client instead of
   *  being lost — a `mailto:` URL pre-filled from the fields. */
  draftHref?: string;
}

export const INITIAL_CONTACT_STATE: ContactState = {
  status: "idle",
  message: "",
  errors: {},
  values: {},
};

/**
 * Length limits, in one place. `min` is only present where a floor is meaningful
 * (a name and a message: an empty-looking brief is not a brief). The browser is
 * given the same numbers as `minLength` / `maxLength`; the server checks them
 * again, because anything the browser does is a convenience, not a control.
 */
export const CONTACT_LIMITS: Record<ContactField, { min?: number; max: number }> = {
  name: { min: 2, max: 80 },
  email: { max: 160 },
  company: { max: 120 },
  projectType: { max: 80 },
  timeline: { max: 60 },
  message: { min: 20, max: 4000 },
};
