# AI Resume Builder

[![CI](https://github.com/jisinth/AI-Resume-Builder/actions/workflows/ci.yml/badge.svg)](https://github.com/jisinth/AI-Resume-Builder/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)

An open-source, self-hostable AI resume builder: build ATS-friendly resumes, score them against
a job description, and get AI-powered rewrite suggestions — with a free built-in engine or your
own OpenAI / Anthropic / Gemini / DeepSeek API key.

> **Status:** actively developed. The features below marked ✅ are fully working end-to-end today.
> Everything else is modeled in the database schema and tracked in [ROADMAP.md](ROADMAP.md) —
> we don't ship fake pages. Contributions on roadmap items are very welcome.

## Features

| Feature                                                                                             | Status     |
| --------------------------------------------------------------------------------------------------- | ---------- |
| Email/password auth (JWT access + refresh tokens)                                                   | ✅         |
| Resume builder (personal info, experience, education, projects, skills, achievements, certificates) | ✅         |
| AI bullet/summary rewriting                                                                         | ✅         |
| AI resume suggestions (weak verbs, missing metrics, long bullets)                                   | ✅         |
| ATS score against a job description (keyword match, formatting, experience, skills)                 | ✅         |
| Multiple resumes, duplicate resume                                                                  | ✅         |
| Resume templates (Modern, Minimal, Corporate, ATS-Friendly)                                         | ✅         |
| PDF export                                                                                          | ✅         |
| Autosave                                                                                            | ✅         |
| Dashboard (resume count, average ATS score, profile completion)                                     | ✅         |
| Dark mode                                                                                           | ✅         |
| Bring-your-own AI provider key (OpenAI, Anthropic, Gemini, DeepSeek)                                | ✅         |
| DOCX / HTML / Markdown export                                                                       | 🗺️ Roadmap |
| Cover letter generator                                                                              | 🗺️ Roadmap |
| LinkedIn optimizer                                                                                  | 🗺️ Roadmap |
| Job application tracker                                                                             | 🗺️ Roadmap |
| Resume version history / compare / restore                                                          | 🗺️ Roadmap |
| OAuth (Google / GitHub)                                                                             | 🗺️ Roadmap |
| Resume import (PDF/DOCX/LinkedIn export)                                                            | 🗺️ Roadmap |
| i18n, offline mode                                                                                  | 🗺️ Roadmap |

See [ROADMAP.md](ROADMAP.md) for the full list and how to pick one up.

## Tech stack

- **Frontend:** Next.js 15, React 18.3, TypeScript, TailwindCSS, shadcn/ui (Radix primitives),
  Framer Motion, React Hook Form, Zod, TanStack Query, Zustand — pinned to React 18.3 rather than
  19 because `@types/react` 19.x currently has an unresolved typings incompatibility with Radix UI
  under Next's required `"jsx": "preserve"` mode; see [docs/architecture.md](docs/architecture.md)
- **Backend:** NestJS, PostgreSQL, Prisma, JWT auth
- **AI:** provider-agnostic interface with a deterministic zero-dependency **Mock** provider
  (default, no key required) plus OpenAI / Anthropic / Gemini / DeepSeek adapters
- **Export:** `@react-pdf/renderer` (server-side PDF, no headless browser needed)
- **Infra:** Docker, Docker Compose, GitHub Actions CI
- **Testing:** Jest (API unit + e2e), Vitest (packages + web unit), Playwright (web e2e)
- **Monorepo:** pnpm workspaces + Turborepo

## Project structure

```
apps/
  api/            NestJS REST API
  web/            Next.js frontend
packages/
  types/          Shared TypeScript domain types
  utils/          Shared Zod schemas + pure helpers (ATS scoring, keyword extraction, ...)
  ui/             Shared design tokens + cross-cutting UI primitives
docker/           Dockerfiles + docker-compose.yml
docs/             Architecture and API documentation
.github/          CI workflows, issue/PR templates
```

See [docs/architecture.md](docs/architecture.md) for a deeper walkthrough.

## Quick start

### Option A — Docker Compose (fastest)

```bash
git clone https://github.com/jisinth/AI-Resume-Builder.git
cd AI-Resume-Builder
docker compose -f docker/docker-compose.yml up --build
```

- Web: http://localhost:3000
- API: http://localhost:4000/api/v1
- API docs (Swagger): http://localhost:4000/api/docs

The AI provider defaults to the built-in **Mock** engine, so everything works with zero API keys.
To use a real provider, set `AI_PROVIDER` and the matching `*_API_KEY` in `docker/.env` (copy from
`docker/.env.example`), or let each user configure their own key from **Settings → AI Provider**.

### Option B — Local development

Prerequisites: Node.js 20+, pnpm 9+, a running PostgreSQL instance.

```bash
git clone https://github.com/jisinth/AI-Resume-Builder.git
cd AI-Resume-Builder
pnpm install

# API
cp apps/api/.env.example apps/api/.env
# edit apps/api/.env with your DATABASE_URL and secrets
pnpm --filter @ai-resume-builder/api exec prisma migrate dev
pnpm --filter @ai-resume-builder/api exec prisma db seed

# Web
cp apps/web/.env.example apps/web/.env.local

# Run both apps
pnpm dev
```

> **Windows note:** `pnpm build` on the web app produces a `.next/standalone` bundle for Docker,
> which requires filesystem symlink permissions. Without Windows Developer Mode enabled (or
> running as Administrator), the final trace-copy step may fail with `EPERM`. `pnpm dev`,
> `pnpm lint`, `pnpm typecheck`, and `pnpm test` are unaffected — this only affects local
> production builds on Windows, not Linux/CI/Docker builds.

### Running tests

```bash
pnpm lint
pnpm typecheck
pnpm test          # unit tests across all packages/apps
pnpm test:e2e       # Playwright e2e (requires the full stack running)
```

## API documentation

The API is self-documenting via Swagger/OpenAPI once running: `GET /api/docs`. See also
[docs/api.md](docs/api.md) for a summary of the REST surface.

## Contributing

Contributions are very welcome — see [CONTRIBUTING.md](CONTRIBUTING.md) for setup, coding
standards, and how to pick up a [good first issue](https://github.com/jisinth/AI-Resume-Builder/labels/good%20first%20issue).

## Security

Found a vulnerability? Please see [SECURITY.md](SECURITY.md) for responsible disclosure.

## License

[MIT](LICENSE)
