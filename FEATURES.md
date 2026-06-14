# Funeral Compass — Feature Overview

Living document of what the app does. Update this whenever a feature is
added, changed, or removed — keep it short, one entry per capability.

## Wizard (`src/pages/Index.tsx`, `src/components/wizard/*`)

Multi-step guided flow for planning a funeral, state persisted to
`localStorage` (`funeral-compass:v3`) so users can resume later.

Steps (dynamic — some are skipped depending on earlier answers, see
`buildSteps` in `src/types/wizard.ts`):

1. **Intro** (`EntryStep`) — welcome / start screen
2. **Funeral type** (`FuneralTypeStep`) — burial vs. cremation etc.
3. **Final goodbye** (`FinalGoodbyeStep`)
4. **Ceremony outline** (`CeremonyOutlineStep`)
5. **Main ceremony** (`MainCeremonyStep`) — shown only if a main ceremony is selected
6. **Ceremony at grave** (`SubCeremonyStep`) — shown only if applicable
7. **Coffin & urn** (`CoffinUrnStep`)
8. **Grave** (`GraveDetailsStep`)
9. **Obituary** (`ObituaryStep`)
10. **Sympathy cards** (`SympathyStep`)
11. **Assistance** (`AssistanceStep`)
12. **Summary** (`SummaryStep`) — full cost breakdown, PDF export, submit/restart

Cascade logic (`src/lib/wizardCascade.ts`): changing an earlier answer
auto-clears dependent later answers, with a toast listing what was cleared.

## Plans & Accounts (`src/lib/plans/*`, `src/pages/Account.tsx`, `src/pages/MyPlans.tsx`)

- **Repository abstraction** (`PlanRepository`): `local` (browser-only demo
  mode, default) or `supabase` (if `VITE_SUPABASE_URL` /
  `VITE_SUPABASE_ANON_KEY` are set).
- **Auth**: magic-link sign-in via Supabase, or a local-only mock sign-in in
  demo mode.
- **Saved plans**: named, with status `draft` → `submitted` →
  `deposit_confirmed`.
- **MyPlans page**: list/manage saved plans per signed-in owner.

## Submission & Mock Payment (`src/components/wizard/PlanActions.tsx`)

- Submit a plan with contact details (name, email, phone, preferred office,
  message) → generates a human reference like `FC-2026-XK3M9`.
- **Demo deposit payment** — always fake, never real money — confirms the
  plan and stores a `MockPaymentInfo`.
- On submission, fires `/api/send-confirmation` (Resend) which:
  - Emails the family a bilingual (EN/DE) confirmation with reference number
    + cost breakdown.
  - If `RESEND_TO` is set, also emails the funeral home a notification with
    the submission's contact details, message, and cost breakdown (HTML-escaped).

## PDF Exports

- **Summary PDF** (`src/lib/exportPdf.ts`) — downloadable plan summary from
  the wizard's Summary step.
- **Invoice PDF** (`src/lib/invoicePdf.ts`) — downloadable invoice/quote after
  submission.

## Contact Form (`src/pages/Contact.tsx`, `api/send-contact.ts`)

- Name/email/message form with sending/success/error/rate-limited states.
- `/api/send-contact` (Vercel Edge Function, Resend):
  - Server-side validation: required fields, email format, max lengths
    (name ≤200, email ≤320, message ≤5000 chars).
  - HTML-escapes all user input before building email HTML.
  - Sends a notification to `RESEND_TO` (funeral home inbox) and a bilingual
    (EN/DE) auto-reply to the visitor.

## Spam Protection (`api/_lib/spam.ts`)

- Shared in-memory helpers used by `send-contact` and `send-confirmation`:
  - Per-IP rate limiting (contact: 3 / 15 min, plan submission: 5 / 15 min;
    returns HTTP 429).
  - Contact form also has a hidden honeypot field and a minimum fill-time
    check (<1.5s = bot) — both silently return `ok:true` without sending.

## Provider Branding (`src/lib/providerConfig.ts`)

Single `PROVIDER` config object (name, phone, address, tax ID, offices) —
falls back to neutral demo placeholders, overridable via `VITE_PROVIDER_*`
env vars without code changes. Used across static pages, the submission form,
and `EmergencyHelp`.

## Emergency Help (`src/components/EmergencyHelp.tsx`)

Persistent footer bar with a direct phone link to the provider, shown
throughout the app.

## i18n (`src/lib/i18n.tsx`)

Full EN/DE translations with a language switcher; all user-facing strings
are translation keys.

## Static Pages (`src/pages/*`)

- **About** — provider/company info
- **Impressum** — legal notice (DE requirement)
- **Datenschutz** — privacy policy
- **Terms** (`/terms`) — terms & conditions: clarifies that plan submissions
  are non-binding requests, prices are estimates, deposits/payments are
  simulated (demo only), liability, governing law (EN/DE)
- **NotFound** — 404

## Deployment

- Vercel (auto-deploy from GitHub `main`), Vite + React + shadcn/ui.
- Edge functions under `api/` (`send-contact.ts`, `send-confirmation.ts`).
- Env vars documented in `.env.example` (Supabase, provider branding, Resend).
