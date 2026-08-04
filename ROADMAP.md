# Roadmap

This roadmap is intentionally honest: items in **Shipped** work end-to-end today. Items in
**Planned** have a Prisma schema modeled for them (so the data model doesn't need to change
later) but no working API/UI yet. If you want to contribute, planned items with no linked issue
yet are a great place to start — please open an issue first to align on approach.

## Shipped

- Email/password authentication (JWT access + refresh tokens)
- Resume builder: personal info, experience, education, projects, skills, achievements,
  certificates
- AI bullet/summary rewriting (`POST /ai/rewrite`)
- AI resume suggestions — weak verbs, missing metrics, long bullets (`POST /ai/suggestions`)
- ATS scoring against a job description with keyword match breakdown (`POST /ai/ats-score`)
- Multiple resumes per user, duplicate resume
- 4 resume templates (Modern, Minimal, Corporate, ATS-Friendly)
- PDF export
- Autosave in the resume builder
- Dashboard with resume count, average ATS score, profile completion
- Dark mode
- Bring-your-own AI provider key: OpenAI, Anthropic, Gemini, DeepSeek (encrypted at rest),
  with a zero-dependency Mock provider as the default
- Docker Compose deployment, GitHub Actions CI (lint, typecheck, unit tests, API e2e, web e2e,
  Docker image build)

## Planned

Modeled in the Prisma schema (`apps/api/prisma/schema.prisma`) already:

- **Resume version history** — save/list/restore/compare versions (`ResumeVersion` model exists)
- **Cover letter generator** — generate from resume + job description (`CoverLetter` model exists)
- **LinkedIn optimizer** — headline/about/experience/skills suggestions (`LinkedInProfile` model
  exists)
- **Job application tracker** — wishlist/applied/interview/offer/rejected (`Application` model
  exists; dashboard stats already read from it, so wiring the CRUD + UI lights it up)
- **Subscriptions / billing** — plan tiers (`Subscription` model exists)

Not yet modeled, larger scope:

- OAuth login (Google, GitHub) — `AuthProvider` enum already anticipates this
- Resume import (PDF, DOCX, Markdown, LinkedIn export, JSON)
- DOCX / HTML / Markdown export (PDF export already establishes the template-rendering pattern
  in `apps/api/src/export`)
- Multi-language UI (i18n)
- Offline mode / PWA
- Accessibility audit pass (WCAG 2.1 AA)
- AI mock interview
- Portfolio generator
- GitHub / LeetCode / StackOverflow import
- Salary estimator
- AI career coach / skill gap analysis
- Public resume sharing + recruiter dashboard

## Known issues

- **Upgrade `apps/web` to React 19** once `@types/react` 19.x's typings regression with Radix
  UI/shadcn under `"jsx": "preserve"` is resolved upstream. See
  [docs/architecture.md](docs/architecture.md#why-these-tradeoffs) for the full explanation of why
  React 18.3 is pinned for now.

## Non-goals (for now)

- Native mobile apps — the web app is responsive and works well on mobile browsers.
- Multi-tenant white-labeling — out of scope until there's demand.
