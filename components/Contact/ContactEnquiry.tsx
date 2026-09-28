"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef, type ReactNode, type RefObject } from "react";

import { submitEnquiry } from "@/app/contact/actions";
import CubeText from "@/components/CubeText";
import {
  PROJECT_TYPE_PLACEHOLDER,
  PROJECT_TYPES,
  STUDIO_EMAIL,
  TIMELINE_PLACEHOLDER,
  TIMELINES,
} from "@/components/Contact/details";
import {
  CONTACT_LIMITS,
  INITIAL_CONTACT_STATE,
  type ContactField,
  type ContactState,
} from "@/components/Contact/enquiry";

/**
 * FILMARC STUDIOS — the enquiry form.
 *
 * The reason this page exists: just the form.
 *
 * NO JAVASCRIPT, NO PROBLEM
 * -------------------------
 * This is a `<form action={serverAction}>`, not a fetch. React posts it to the
 * Server Action in `app/contact/actions.ts` and re-renders this route with the
 * result, which is why the outcome lives in `useActionState` rather than in
 * local state: one submission path runs with JavaScript, without it, and under a
 * reader that never executes any — and the action's answer
 * (`components/Contact/enquiry.ts`) is the single shape all of them render.
 *
 * WHAT THE VISITOR IS TOLD
 * ------------------------
 * Four outcomes, four notices, and not one of them claims a delivery the studio
 * cannot prove: `sent` replaces the form with a received panel, `invalid` marks
 * the offending fields, and the other two say plainly that nothing was sent and
 * hand the typed brief back as a pre-filled `mailto:` draft. The action's own
 * docblock explains why that matters more than a friendly-looking "thanks".
 *
 * ACCESSIBILITY
 * -------------
 * Every field owns its label, its hint or its error (`aria-describedby`), and an
 * `aria-invalid` flag that doubles as the stylesheet's invalid hook — the colour
 * follows the state, so paint can never disagree with what a screen reader is
 * told. The notice is a live region that takes focus when it appears, so the
 * outcome is announced rather than merely painted somewhere below.
 *
 * The sub-components are declared at module scope, not inside `ContactEnquiry`:
 * a component defined in a render body is a new type on every render, and React
 * would remount — and so reset — the fields it renders.
 */
type NoticeStatus = Exclude<ContactState["status"], "idle">;

/** The eyebrow of the notice, per outcome. */
const NOTICE_LABELS: Record<NoticeStatus, string> = {
  sent: "Received",
  invalid: "Not sent",
  unconfigured: "Nothing sent",
  error: "Not sent",
};

/** The notice's border and wash, per outcome. The copy carries the meaning; the
 *  colour only agrees with it. */
const NOTICE_TONES: Record<NoticeStatus, string> = {
  sent: "border-cta/40 bg-cta/5",
  invalid: "border-ember/40 bg-ember/5",
  unconfigured: "border-amber/40 bg-amber/5",
  error: "border-amber/40 bg-amber/5",
};

/** One field's label, its control, and the single line of help it is allowed. */
function FieldShell({
  field,
  label,
  hint,
  error,
  wide = false,
  children,
}: {
  field: ContactField;
  label: string;
  hint?: string;
  error?: string;
  wide?: boolean;
  children: ReactNode;
}) {
  return (
    <div className={wide ? "sm:col-span-2" : undefined}>
      <label
        htmlFor={`contact-${field}`}
        className="font-body text-[0.7rem] font-semibold uppercase tracking-[0.24em] text-chalk"
      >
        {label}
      </label>

      <div className="mt-2.5">{children}</div>

      {error ? (
        <p
          id={`contact-${field}-error`}
          className="mt-2 font-body text-xs leading-relaxed text-ember"
        >
          {error}
        </p>
      ) : hint ? (
        <p className="mt-2 font-body text-xs leading-relaxed text-ash">{hint}</p>
      ) : null}
    </div>
  );
}

/**
 * The props every control in the form shares. `defaultValue` is only read when
 * React mounts a field, which is exactly the case it is here for: a submission
 * that was posted natively (no JavaScript) re-renders this route from the
 * action's state, and the brief has to come back with it.
 */
function fieldProps(state: ContactState, name: ContactField) {
  return {
    id: `contact-${name}`,
    name,
    defaultValue: state.values[name] ?? "",
    "aria-invalid": state.errors[name] ? (true as const) : undefined,
    "aria-describedby": state.errors[name] ? `contact-${name}-error` : undefined,
  };
}

/** The ghost action — the same pill geometry as the CTA, without the fill. */
const GHOST_LINK =
  "inline-flex items-center justify-center rounded-full border border-hairline px-6 py-3 font-body text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-chalk transition-colors duration-300 hover:border-cta/60 hover:text-cta focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cta";

/**
 * The outcome that is not a delivery: a rejected field, or a brief that could
 * not be sent. It is a live region (`role="status"` implies `aria-live="polite"`)
 * so it is announced when it appears, and it is focusable so the visitor lands
 * on the reason — hence `tabIndex={-1}` and the focus call in `ContactEnquiry`.
 */
function Notice({
  state,
  noticeRef,
}: {
  state: ContactState;
  noticeRef: RefObject<HTMLDivElement | null>;
}) {
  const status = state.status;
  if (status === "idle") return null;

  return (
    <div
      ref={noticeRef}
      tabIndex={-1}
      role="status"
      className={`rounded-xl border p-5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cta sm:p-6 ${NOTICE_TONES[status]}`}
    >
      <p className="font-body text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-smoke">
        {NOTICE_LABELS[status]}
      </p>

      <p className="mt-3 font-body text-sm leading-relaxed text-chalk sm:text-base">
        {state.message}
      </p>

      {state.draftHref ? (
        <>
          <a href={state.draftHref} className={`mt-6 ${GHOST_LINK}`}>
            Open the brief in your mail app
          </a>
          <p className="mt-3 font-body text-xs leading-relaxed text-smoke">
            Your message is already in the draft. Very long briefs are clipped to
            keep the link workable — check it before you send.
          </p>
        </>
      ) : null}
    </div>
  );
}

/**
 * The outcome that is a delivery. It replaces the form rather than sitting above
 * it: there is nothing left to do on this page, so the one useful thing it can
 * offer is where to go next. The detail — name, address, message — is not echoed
 * back, because the studio already has it and repeating it adds nothing.
 */
function ReceivedPanel({
  state,
  noticeRef,
}: {
  state: ContactState;
  noticeRef: RefObject<HTMLDivElement | null>;
}) {
  return (
    <div
      ref={noticeRef}
      tabIndex={-1}
      role="status"
      className="rounded-2xl border border-cta/40 bg-ink/70 p-8 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cta sm:p-10"
    >
      <p className="font-body text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-cta">
        {NOTICE_LABELS.sent}
      </p>

      <p className="mt-6 font-display text-[clamp(2rem,4.5vw,3.25rem)] uppercase leading-[0.9] tracking-[0.01em] text-bright">
        The brief is in
      </p>

      <p className="mt-5 max-w-[46ch] font-body text-sm leading-relaxed text-ash sm:text-base">
        {state.message}
      </p>

      <p className="mt-4 max-w-[46ch] font-body text-sm leading-relaxed text-ash">
        Anything to add later — a longer cut, a moved date — goes to the same
        inbox:{" "}
        <a
          href={`mailto:${STUDIO_EMAIL}`}
          className="text-chalk underline decoration-hairline underline-offset-4 transition-colors duration-300 hover:text-cta hover:decoration-cta"
        >
          {STUDIO_EMAIL}
        </a>
        .
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/services" className={GHOST_LINK}>
          See the disciplines
        </Link>
        <Link href="/" className={GHOST_LINK}>
          Back to the studio
        </Link>
      </div>
    </div>
  );
}

/**
 * The form itself.
 *
 * Every control is `contact-field` — one class in `app/globals.css` that owns the
 * background, the border, the focus ring and the invalid state for inputs,
 * selects and the textarea alike, so the six fields cannot drift apart and the
 * invalid colour is driven by `aria-invalid` rather than by a second flag that
 * could disagree with it.
 *
 * The browser's own validation runs first (`required`, `type="email"`,
 * `minLength`/`maxLength`, taken from the same `CONTACT_LIMITS` the Server Action
 * checks against); the action is still the authority, because a browser check is
 * a courtesy and not a control.
 */
function EnquiryForm({
  state,
  formAction,
  pending,
}: {
  state: ContactState;
  formAction: (formData: FormData) => void;
  pending: boolean;
}) {
  return (
    <form action={formAction} className="relative flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <FieldShell field="name" label="Name" error={state.errors.name}>
          <input
            {...fieldProps(state, "name")}
            type="text"
            autoComplete="name"
            required
            minLength={CONTACT_LIMITS.name.min}
            maxLength={CONTACT_LIMITS.name.max}
            className="contact-field"
          />
        </FieldShell>

        <FieldShell field="email" label="Email" error={state.errors.email}>
          <input
            {...fieldProps(state, "email")}
            type="email"
            autoComplete="email"
            required
            maxLength={CONTACT_LIMITS.email.max}
            className="contact-field"
          />
        </FieldShell>

        <FieldShell
          field="company"
          label="Studio or company"
          hint="Optional."
          error={state.errors.company}
        >
          <input
            {...fieldProps(state, "company")}
            type="text"
            autoComplete="organization"
            maxLength={CONTACT_LIMITS.company.max}
            className="contact-field"
          />
        </FieldShell>

        <FieldShell
          field="projectType"
          label="Discipline"
          error={state.errors.projectType}
        >
          <select
            {...fieldProps(state, "projectType")}
            required
            className="contact-field contact-field--select"
          >
            <option value="">{PROJECT_TYPE_PLACEHOLDER}</option>
            {PROJECT_TYPES.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </FieldShell>

        <FieldShell
          field="timeline"
          label="Timeline"
          hint="Optional."
          error={state.errors.timeline}
          wide
        >
          <select
            {...fieldProps(state, "timeline")}
            className="contact-field contact-field--select"
          >
            <option value="">{TIMELINE_PLACEHOLDER}</option>
            {TIMELINES.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </FieldShell>

        <FieldShell
          field="message"
          label="The brief"
          hint="What you are making, what it has to do, and when it has to be finished."
          error={state.errors.message}
          wide
        >
          <textarea
            {...fieldProps(state, "message")}
            rows={7}
            required
            minLength={CONTACT_LIMITS.message.min}
            maxLength={CONTACT_LIMITS.message.max}
            className="contact-field contact-field--area"
          />
        </FieldShell>
      </div>

      {/* THE HONEYPOT. A field a person never meets and a form-filler always
          does: off-canvas, out of the tab order, `aria-hidden` so it is not part
          of the page's accessible content, and read by the Server Action as the
          one signal it treats as automated. The label stays for the case where a
          tool ignores `aria-hidden` — better a readable field than an unlabelled
          one. */}
      <div
        aria-hidden
        className="pointer-events-none absolute h-0 w-0 overflow-hidden opacity-0"
      >
        <label htmlFor="contact-website">Website</label>
        <input
          id="contact-website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div>
        <button
          type="submit"
          disabled={pending}
          className="inline-flex items-center justify-center rounded-full bg-cta px-8 py-4 font-body text-xs font-semibold uppercase tracking-[0.18em] text-cta-ink transition-[filter] duration-300 hover:brightness-[1.07] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cta disabled:cursor-progress disabled:opacity-55 sm:px-10 sm:py-4.5"
        >
          <CubeText label={pending ? "Sending" : "Send the brief"} />
        </button>
      </div>
    </form>
  );
}

export default function ContactEnquiry() {
  const [state, formAction, pending] = useActionState(
    submitEnquiry,
    INITIAL_CONTACT_STATE,
  );
  const noticeRef = useRef<HTMLDivElement | null>(null);

  /* The outcome takes focus when it arrives: it is announced, and the visitor is
     looking at the reason rather than at the button they just pressed.
     `preventScroll` keeps a page that is already showing the notice from
     jumping. This moves focus, it does not set state. */
  useEffect(() => {
    if (state.status === "idle") return;
    noticeRef.current?.focus({ preventScroll: true });
  }, [state]);

  return (
    <section
      id="enquiry"
      className="relative w-full scroll-mt-24 bg-abyss px-6 py-16 sm:px-10 lg:py-24"
    >
      <div className="mx-auto max-w-3xl">
        {state.status === "sent" ? (
          <ReceivedPanel state={state} noticeRef={noticeRef} />
        ) : (
          <>
            <Notice state={state} noticeRef={noticeRef} />
            <div className={state.status === "invalid" ? "mt-8" : undefined}>
              <EnquiryForm
                state={state}
                formAction={formAction}
                pending={pending}
              />
            </div>
          </>
        )}
      </div>
    </section>
  );
}
