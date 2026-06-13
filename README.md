# Funeral Compass

A gentle, guided wizard that helps people plan a funeral — either after a recent bereavement or as quiet preparation for the future. It walks through the key decisions step by step, keeps a live cost estimate, and produces a downloadable PDF summary of the plan.

## About

Planning a funeral involves a lot of unfamiliar choices at a difficult time. Funeral Compass turns that into a calm, one-question-at-a-time experience: care of the body, resting place, coffin or urn, ceremony, grave type, and personal wishes such as music and flowers. Nothing is sent to a server — the plan stays in your browser and can be exported as a PDF whenever you're ready.

## Features

- Two entry modes: **bereavement** (planning for someone who has died) and **pre-planning** (for yourself or a loved one)
- Step-by-step wizard with illustrated options
  - Care of the body (earth burial / cremation)
  - Resting place (traditional cemetery / forest / sea)
  - Coffin or urn (metal / wood / bring your own)
  - Ceremony (with or without a service)
  - Grave type (single, family, anonymous, tree)
- Personal wishes: music, flowers, free-form notes
- Live cost estimate in EUR, updated as you choose
- **PDF export** of the complete plan, including choices, wishes and the cost breakdown
- **Auto-save to `localStorage`** — close the tab and resume your plan later
- Fully responsive, accessible UI

## Tech stack

- [Vite](https://vitejs.dev/) + [React 18](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) (Radix primitives)
- [jsPDF](https://github.com/parallax/jsPDF) for PDF export
- [React Router](https://reactrouter.com/) for routing
- [TanStack Query](https://tanstack.com/query) for async state
- [Vitest](https://vitest.dev/) + Testing Library for unit tests

## Getting started

### Prerequisites

- Node.js 18+ (or [Bun](https://bun.sh/))
- npm, pnpm, or bun

### Install and run

```bash
# Install dependencies
npm install

# Start the dev server (http://localhost:8080)
npm run dev

# Production build
npm run build

# Preview the production build
npm run preview

# Run tests
npm run test

# Lint
npm run lint
```

## Project structure

```
src/
├── components/
│   ├── wizard/            # Wizard steps and shared UI (StepShell, OptionCard, Progress)
│   │   ├── EntryStep.tsx
│   │   ├── BurialStep.tsx
│   │   ├── LocationStep.tsx
│   │   ├── CoffinStep.tsx
│   │   ├── CeremonyStep.tsx
│   │   ├── GraveStep.tsx
│   │   └── SummaryStep.tsx
│   └── ui/                # shadcn/ui primitives
├── designs/               # Alternative theme CSS files
├── lib/
│   └── exportPdf.ts       # jsPDF-based PDF generation
├── pages/
│   ├── Index.tsx          # Wizard host + localStorage persistence
│   └── NotFound.tsx
├── types/
│   └── wizard.ts          # WizardState, COSTS, calculateTotal
├── design.css             # Active theme import
└── index.css              # Tailwind setup + shared theme hooks
```

## Changing the design

The active app design is selected in `src/design.css`:

```css
@import "./designs/soft-luxury.css";
```

To try another design, replace that import with another file from `src/designs/`, for example:

```css
@import "./designs/himmelblau-inspired.css";
```

Create new designs by copying an existing CSS file in `src/designs/`, editing its colors, fonts, backgrounds, and component rules, then pointing `src/design.css` to the new file.

## Editing the project

This repository is connected to [Lovable](https://lovable.dev/) with bidirectional GitHub sync:

- Changes made in Lovable are pushed to this repo automatically.
- Pushes to this repo (locally or via a pull request) sync back into Lovable in real time.

You can develop in either place — use whichever workflow you prefer.

## Deployment

- **One click:** open the project in Lovable and use the **Publish** button.
- **Self-host:** the standard `npm run build` output in `dist/` is plain static assets and can be hosted on any static host (Netlify, Vercel, Cloudflare Pages, S3, GitHub Pages, etc.).

## Disclaimer

The cost figures shown by Funeral Compass are **illustrative estimates only**. Actual prices depend on regional fees, the funeral director you work with, and the specific products and services chosen. Always confirm pricing with a qualified funeral provider before making decisions.


## Accounts, saved plans, submission & demo billing (claude/fixes)

The app now supports saving plans, submitting them to the funeral home (US 19),
and a clearly-marked **demo** deposit + invoice flow.

**Storage backends** — selected automatically:
- **Local demo mode (default):** everything stays in the browser's localStorage.
  No setup needed; sign-in is a simulated magic link.
- **Supabase mode:** create a Supabase project (EU region recommended), run
  `supabase/schema.sql`, enable Email/magic-link auth, and fill `.env`
  (see `.env.example`). Plans then sync per signed-in user with row-level security.

**What's included**
- `/account` — passwordless sign-in (magic link; simulated in demo mode)
- `/plans` — list / open / duplicate / delete multiple saved plans per user
- Summary page: **Save plan**, **Send to funeral home** (creates a reference,
  e.g. `FC-2026-XK3M9`), **Confirm deposit (demo)** and **Download demo invoice**
  (contains the mandatory § 14 (4) UStG fields, 19% VAT split, demo disclaimer)

**E-invoicing note:** German B2B invoices must follow EN 16931
(XRechnung/ZUGFeRD); issuing becomes mandatory 2027 (>€800k turnover) / 2028
(all businesses). B2C invoices to families are not covered by the mandate, so
the demo PDF invoice is the legally appropriate shape for the consumer side.
Real XRechnung/ZUGFeRD export is documented future work.
