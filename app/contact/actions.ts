"use server";

import { headers } from "next/headers";

import {
  DRAFT_BODY_LIMIT,
  DRAFT_SUBJECT,
  PROJECT_TYPES,
  RESPONSE_PROMISE,
  STUDIO_EMAIL,
  TIMELINES,
} from "@/components/Contact/details";
import {
  CONTACT_FIELDS,
  CONTACT_LIMITS,
  type ContactFieldErrors,
  type ContactState,
  type ContactValues,
} from "@/components/Contact/enquiry";

/**
 * FILMARC STUDIOS — where a brief is received.
 *
 * The contact form posts here (a Server Action, so the form works without
 * JavaScript and there is no API route to keep in sync with it). This file does
 * four things in order, and every one of them assumes the request is hostile:
 *
 *   1. DROPS BOTS. A field the visitor never sees (`HONEYPOT_FIELD`) is empty in
 *      every human submission. When it is filled, the reply is byte-for-byte the
 *      reply a real send gets — nothing is delivered, and the sender learns
 *      nothing about having been caught.
 *   2. BRAKES. `isThrottled` allows a handful of posts per connection per window.
 *      It is deliberately best-effort: the bucket lives in this instance's
 *      memory, so it does not survive a restart and is not shared between
 *      instances. It stops a script hammering the form; it is not a security
 *      boundary. A deployment that needs one puts a real limiter in front.
 *   3. VALIDATES. Lengths and membership are checked again here against
 *      `components/Contact/enquiry.ts`, whatever the browser already checked —
 *      the select's options are an allow-list, not a hint, because a field the
 *      client controls can carry anything.
 *   4. DELIVERS, AND NEVER LIES ABOUT IT.
 *
 * THE DELIVERY CONTRACT
 * ---------------------
 * `CONTACT_WEBHOOK_URL` is where a brief goes: a JSON POST — Formspree, Zapier,
 * an n8n or Slack workflow, your own endpoint — read at call time, so it is
 * configured by environment rather than by editing this file. `CONTACT_WEBHOOK_TOKEN`
 * is optional and, when present, is sent as `Authorization: Bearer …`.
 *
 * When no endpoint is configured, or the endpoint refuses the POST, the brief is
 * **not** sent and the page is told so explicitly: the visitor gets the studio's
 * email address and their own text turned into a pre-filled `mailto:` draft, so
 * the words are not lost and nobody is left waiting for a reply to a message that
 * never arrived. A form that answers "thanks, we'll be in touch" with nowhere to
 * be in touch from is the one outcome worth ruling out.
 */

/* The email's shape, server-side. The input is `type="email"` as well, but that
   is a convenience for the visitor: this is the check that decides. */
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;

/* One field, hidden off-canvas and `aria-hidden` in the markup, that only an
   automated submission ever fills. */
const HONEYPOT_FIELD = "website";

/* A delivery that hangs is a visitor staring at a spinner. */
const WEBHOOK_TIMEOUT_MS = 10_000;

/* See (2) above. */
const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const recentSubmissions = new Map<string, number[]>();

const NAME_LIMITS = CONTACT_LIMITS.name;
const EMAIL_LIMITS = CONTACT_LIMITS.email;
const COMPANY_LIMITS = CONTACT_LIMITS.company;
const MESSAGE_LIMITS = CONTACT_LIMITS.message;

/** Shown on success — and on a dropped bot, so both replies are identical. */
const SENT_MESSAGE = `Your brief is with the studio. ${RESPONSE_PROMISE}`;

function readText(formData: FormData, field: string): string {
  const value = formData.get(field);
  return typeof value === "string" ? value.trim() : "";
}

/** Every field the form owns, trimmed. Never throws: a missing field is "". */
function collectValues(formData: FormData): ContactValues {
  const values: ContactValues = {};
  for (const field of CONTACT_FIELDS) values[field] = readText(formData, field);
  return values;
}

/** One message per field that needs one. An empty object means "all good". */
function validate(values: ContactValues): ContactFieldErrors {
  const errors: ContactFieldErrors = {};

  const name = values.name ?? "";
  if (name.length < (NAME_LIMITS.min ?? 1)) {
    errors.name = "Tell us who we are writing back to.";
  } else if (name.length > NAME_LIMITS.max) {
    errors.name = `Keep your name under ${NAME_LIMITS.max} characters.`;
  }

  const email = values.email ?? "";
  if (!email) {
    errors.email = "We need an address to reply to.";
  } else if (email.length > EMAIL_LIMITS.max || !EMAIL_PATTERN.test(email)) {
    errors.email = "That address does not look complete — please check it.";
  }

  const company = values.company ?? "";
  if (company.length > COMPANY_LIMITS.max) {
    errors.company = `Keep the studio or company name under ${COMPANY_LIMITS.max} characters.`;
  }

  const projectType = values.projectType ?? "";
  if (!projectType) {
    errors.projectType = "Choose the discipline closest to the work.";
  } else if (!PROJECT_TYPES.includes(projectType)) {
    errors.projectType = "Choose one of the listed disciplines.";
  }

  const timeline = values.timeline ?? "";
  if (timeline && !TIMELINES.includes(timeline)) {
    errors.timeline = "Choose one of the listed timeframes.";
  }

  const message = values.message ?? "";
  if (message.length < (MESSAGE_LIMITS.min ?? 1)) {
    errors.message = `Add a little more — ${MESSAGE_LIMITS.min} characters at least.`;
  } else if (message.length > MESSAGE_LIMITS.max) {
    errors.message = `Keep the brief under ${MESSAGE_LIMITS.max} characters.`;
  }

  return errors;
}

/**
 * The brief as a `mailto:` URL. Used when delivery is impossible or refused, so
 * a filled-in form still turns into a real email in one click instead of into an
 * apology. `DRAFT_BODY_LIMIT` clips the body: a mailto is a URL, and URLs have
 * practical length limits — the full text stays on the page to be copied.
 */
function draftHrefFor(values: ContactValues): string {
  const lines = [
    `Name: ${values.name ?? ""}`,
    `Email: ${values.email ?? ""}`,
    values.company ? `Company: ${values.company}` : null,
    values.projectType ? `Project: ${values.projectType}` : null,
    values.timeline ? `Timeline: ${values.timeline}` : null,
    "",
    (values.message ?? "").slice(0, DRAFT_BODY_LIMIT),
  ].filter((line): line is string => line !== null);

  const subject = encodeURIComponent(DRAFT_SUBJECT);
  const body = encodeURIComponent(lines.join("\r\n"));
  return `mailto:${STUDIO_EMAIL}?subject=${subject}&body=${body}`;
}

type Delivery =
  | { kind: "sent" }
  | { kind: "unconfigured" }
  | { kind: "failed"; detail: string };

async function deliver(values: ContactValues): Promise<Delivery> {
  /* Read at call time rather than at module load: the endpoint is deployment
     configuration, and a missing one is a state this action handles by name. */
  const endpoint = process.env.CONTACT_WEBHOOK_URL?.trim();
  if (!endpoint) return { kind: "unconfigured" };

  const token = process.env.CONTACT_WEBHOOK_TOKEN?.trim();

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        accept: "application/json",
        ...(token ? { authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        studio: "FilmArc Studios",
        source: "filmarc.studio/contact",
        submittedAt: new Date().toISOString(),
        ...values,
      }),
      signal: AbortSignal.timeout(WEBHOOK_TIMEOUT_MS),
    });

    if (!response.ok) {
      return { kind: "failed", detail: `endpoint answered ${response.status}` };
    }
    return { kind: "sent" };
  } catch (error) {
    return {
      kind: "failed",
      detail: error instanceof Error ? error.message : "unknown delivery error",
    };
  }
}

function clientKey(requestHeaders: Headers): string {
  const forwarded = requestHeaders.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return requestHeaders.get("x-real-ip")?.trim() || "unknown";
}

/** True when this connection has already had its share of submissions. */
function isThrottled(key: string): boolean {
  const now = Date.now();
  const hits = (recentSubmissions.get(key) ?? []).filter(
    (at) => now - at < RATE_LIMIT_WINDOW_MS,
  );

  if (hits.length >= RATE_LIMIT_MAX) {
    recentSubmissions.set(key, hits);
    return true;
  }

  hits.push(now);
  recentSubmissions.set(key, hits);

  /* The map is per instance and its entries expire on their own, but a
     long-lived server should not keep a key it will never read again. */
  if (recentSubmissions.size > 500) {
    for (const [other, times] of recentSubmissions) {
      if (times.every((at) => now - at >= RATE_LIMIT_WINDOW_MS)) {
        recentSubmissions.delete(other);
      }
    }
  }

  return false;
}

/**
 * Receives the brief. The signature is `useActionState`'s: the previous state
 * first (unused — every submission stands alone), then the form's own data.
 */
export async function submitEnquiry(
  _previous: ContactState,
  formData: FormData,
): Promise<ContactState> {
  const values = collectValues(formData);

  /* (1) A bot, by the only rule a hidden field can support. Answered exactly as
     a delivered brief is answered, and silently dropped. */
  if (readText(formData, HONEYPOT_FIELD)) {
    return { status: "sent", message: SENT_MESSAGE, errors: {}, values };
  }

  /* (2) */
  const requestHeaders = await headers();
  if (isThrottled(clientKey(requestHeaders))) {
    return {
      status: "error",
      message: `That is several briefs in a row from this connection, so this one was not sent. Give it a few minutes — or write to ${STUDIO_EMAIL} and it reaches us just the same.`,
      errors: {},
      values,
      draftHref: draftHrefFor(values),
    };
  }

  /* (3) */
  const errors = validate(values);
  if (Object.keys(errors).length > 0) {
    return {
      status: "invalid",
      message: "A few fields need another look before this can be sent.",
      errors,
      values,
    };
  }

  /* (4) */
  const delivery = await deliver(values);

  if (delivery.kind === "sent") {
    return { status: "sent", message: SENT_MESSAGE, errors: {}, values };
  }

  if (delivery.kind === "unconfigured") {
    return {
      status: "unconfigured",
      message: `This form has nowhere to deliver to on this deployment yet, so nothing was sent. Write to ${STUDIO_EMAIL} and it reaches the studio — or open the brief below in your mail app.`,
      errors: {},
      values,
      draftHref: draftHrefFor(values),
    };
  }

  /* The reason goes to the server log as well: the visitor only ever sees the
     notice below, and whoever runs the deployment needs the detail. */
  console.error(`[contact] delivery failed: ${delivery.detail}`);

  return {
    status: "error",
    message: `The brief could not be delivered just now, so please assume it did not arrive. Write to ${STUDIO_EMAIL} — or open the brief below in your mail app.`,
    errors: {},
    values,
    draftHref: draftHrefFor(values),
  };
}
