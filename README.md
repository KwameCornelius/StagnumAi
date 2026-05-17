# Stagnum Dashboard

Construction-industry operations and project management dashboard.

A single-page React app backed by a [Supabase](https://supabase.com) Postgres database. Tracks projects, BoQs, RFQs, purchase orders, invoices, variations, assets, QA inspections, daily site logs, snag items, and procurement gates across multiple organizations.

## Stack

| Layer | Choice |
|---|---|
| UI | React 19 + Tailwind CSS 4 |
| Build | Vite 6 (TypeScript) |
| Charts | Recharts 3 |
| Animation | [motion](https://motion.dev) (Framer Motion successor) |
| Icons | lucide-react |
| Toasts | sonner |
| Backend | Supabase (Postgres + Auth + Row-Level Security) |

## Prerequisites

- Node.js 20+ (LTS)
- npm 10+
- A Supabase project — either the shared dev project or your own (see [supabase/README.md](./supabase/README.md))

## Quick start

```bash
# 1. Install
npm install

# 2. Configure
cp .env.example .env.local
# then fill in VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY
# (optionally also VITE_DEMO_EMAIL / VITE_DEMO_PASSWORD to enable the
# "Use Demo Account" button)

# 3. Run
npm run dev        # http://localhost:3000
```

## Scripts

| Script | What it does |
|---|---|
| `npm run dev` | Vite dev server on port 3000, bound to 0.0.0.0 |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Type-check + ESLint |
| `npm run test` | Vitest in run-once mode (CI) |
| `npm run test:watch` | Vitest in watch mode |

## Project layout

```
src/
  App.tsx                       Root, providers, ErrorBoundary, Toaster
  main.tsx                      ReactDOM mount
  components/
    Dashboard.tsx               Main dashboard view (KPIs, charts, tables, feed)
    Sidebar.tsx                 Responsive nav (mobile drawer + desktop column)
    StatsCard.tsx               KPI card primitive
    ErrorBoundary.tsx           Catches render-phase exceptions
  contexts/
    AuthContext.tsx             Supabase auth lifecycle, signIn/signUp/reset
    SidebarContext.tsx          Mobile drawer open/close state
  pages/
    LoginPage.tsx               Multi-mode auth UI (sign in/up/forgot/reset)
  lib/
    supabase.ts                 Typed Supabase client
    utils.ts                    cn() — tailwind-merge + clsx
  types/
    supabase.ts                 Generated DB types
supabase/
  migrations/                   SQL migrations (applied via Studio for now)
  README.md                     Migration workflow
```

## Supabase

The DB schema is non-trivial (~56 tables across the construction-management domain) and **every public table has RLS enabled**. The Supabase project ID for the shared dev environment is `losxbihilofdaxxoudwz`.

For schema changes, write a new migration in `supabase/migrations/` (see [supabase/README.md](./supabase/README.md)) and apply via the Supabase SQL Editor. When we adopt the Supabase CLI, `supabase db push` will apply them automatically.

## Deployment

Any static host works. Vercel, Netlify, Cloudflare Pages, or `aws s3 sync dist/ …` are all fine.

Environment variables to set in the host:

| Var | Required | Notes |
|---|---|---|
| `VITE_SUPABASE_URL` | yes | Your Supabase project URL |
| `VITE_SUPABASE_ANON_KEY` | yes | Public anon key (RLS protects data) |
| `VITE_DEMO_EMAIL` | no | If set with `VITE_DEMO_PASSWORD`, enables the demo button. **Leave unset in production.** |
| `VITE_DEMO_PASSWORD` | no | See above. |

> Note: `VITE_*` env vars are inlined into the client bundle — they are not secrets. Anything truly secret has to live server-side (Supabase Edge Functions, a separate API, etc.).

## CI

GitHub Actions runs `tsc`, `eslint`, `vitest`, and `vite build` on every push and pull request. See [`.github/workflows/ci.yml`](.github/workflows/ci.yml).
