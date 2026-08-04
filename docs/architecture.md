# Architecture

## Overview

AI Resume Builder is a pnpm/Turborepo monorepo with two deployable apps and three shared
packages:

```
apps/api   NestJS REST API — auth, resumes, AI, export, templates
apps/web   Next.js 15 (App Router) frontend
packages/types  Shared TypeScript domain types + enums, used by both apps
packages/utils  Shared Zod schemas + pure helpers (ATS scoring, keyword extraction, string/date utils)
packages/ui     Shared design tokens (Tailwind preset) + cross-cutting UI primitives (ScoreRing, Logo, Badge)
```

The web app and API are separate services communicating over REST (`NEXT_PUBLIC_API_URL`), which
keeps the API reusable by a future mobile client or CLI.

## Request flow

```
Browser (Next.js, client components)
  -> TanStack Query hooks (apps/web/hooks)
  -> apiFetch (apps/web/lib/api-client.ts) — attaches JWT, retries once on 401 via /auth/refresh
  -> NestJS controllers (apps/api/src/**/*.controller.ts)
  -> Services (business logic, Prisma queries)
  -> PostgreSQL (via Prisma)
```

## Authentication

- Passwords are hashed with bcrypt (12 rounds).
- On login/register, the API issues a short-lived access token (15m default) and a longer-lived
  refresh token (7d default), both JWTs signed with separate secrets.
- The refresh token is hashed (bcrypt) before being stored on the `User` row, so a database leak
  doesn't hand over usable refresh tokens directly.
- The web app stores both tokens in a Zustand store persisted to `localStorage`, and transparently
  refreshes the access token on a 401 response (see [SECURITY.md](../SECURITY.md) for the
  tradeoffs of this approach vs. httpOnly cookies).

## AI provider architecture

`apps/api/src/ai/providers` defines an `AiProvider` interface with three methods: `rewrite`,
`atsScore`, and `suggestions`. Five implementations exist:

- **MockAiProvider** — deterministic, zero-dependency, active by default. Uses the same
  rule-based ATS scoring algorithm (`packages/utils/src/ats.ts`) that a real provider falls back
  to if it returns an unparseable response.
- **OpenAiProvider, AnthropicProvider, GeminiProvider, DeepSeekProvider** — extend
  `BaseLlmProvider`, which builds a JSON-mode prompt (`providers/prompts.ts`), calls the
  provider's REST API directly (no SDK dependency), and parses the JSON response
  (`providers/json.util.ts`).

`AiProviderFactory` resolves which provider to use per request: a user's own encrypted API key
(`UserAiSettings`, decrypted via `EncryptionService`) takes priority over the server-wide
`OPENAI_API_KEY` / etc. environment variables. If neither is present for a non-Mock provider, the
request fails fast with a clear error rather than silently falling back — so users know their
selected provider isn't actually active.

## Data model

See `apps/api/prisma/schema.prisma` for the full schema. It models the entire target domain
described in the project brief (Users, Resumes, ResumeVersions, Experience, Education, Projects,
Skills, Achievements, Certificates, Applications, CoverLetters, LinkedInProfiles, Templates,
Subscriptions) even though not every model has a working API/UI yet — see
[ROADMAP.md](../ROADMAP.md) for what's wired up today.

## PDF export

`apps/api/src/export` renders resumes to PDF server-side using `@react-pdf/renderer`, which has
its own layout engine (no headless browser / Puppeteer dependency, keeping the Docker image
small). `templates/style-presets.ts` maps each `templateSlug` to a color/font/layout preset, and
`templates/resume-document.tsx` renders either a sidebar layout (Modern) or single-column layout
(Minimal, Corporate, ATS-Friendly) from the same resume data.

## Why these tradeoffs

- **Prisma nested writes over a document store:** resumes have deeply nested, relational data
  (experience, education, etc.). Modeling each section as its own table (rather than a single
  JSON blob) keeps future features like resume version diffing and per-section AI feedback
  tractable, at the cost of more verbose create/update code (see `resumes.service.ts`).
- **REST over GraphQL:** the API surface is small and resource-oriented; REST + a typed shared
  `packages/types` package gives most of GraphQL's type-safety benefit without the extra
  infrastructure.
- **No BullMQ/queue yet:** all AI and export operations are synchronous HTTP requests today,
  which is fine because they complete in a few seconds. Redis is already wired into
  `docker-compose.yml` for when queued jobs (e.g., future AI mock interviews, bulk exports) are
  needed — see [ROADMAP.md](../ROADMAP.md).
- **React 18.3 instead of React 19 in `apps/web`:** at the time this was built, `@types/react`
  19.x has an unresolved typings regression where Radix UI's `forwardRef`-based components (and
  by extension shadcn/ui, which wraps them) fail to type-check under Next.js's required
  `"jsx": "preserve"` tsconfig setting — TypeScript reports the exported component's `ReactNode` as
  not assignable to `React.ReactNode`, even with a single, correctly deduplicated `@types/react`
  version in the dependency tree. This reproduces even for a from-scratch, dependency-free
  component, which rules out the usual "duplicate `@types/react` in the tree" explanation. `apps/api`
  still uses React 18.3 as well (for server-side PDF rendering via `@react-pdf/renderer`), so the
  whole repo is consistently on one React major version. Revisit this pin once the upstream types
  issue is resolved — see [ROADMAP.md](../ROADMAP.md).
