# Contributing to AI Resume Builder

Thanks for considering a contribution! This project is maintained by volunteers and every PR,
issue report, and suggestion helps.

## Getting started

1. Fork the repo and clone your fork.
2. Install dependencies: `pnpm install` (requires Node.js 20+ and pnpm 9+).
3. Copy env files: `apps/api/.env.example` → `apps/api/.env`, `apps/web/.env.example` →
   `apps/web/.env.local`.
4. Start a local Postgres instance (or `docker compose -f docker/docker-compose.yml up postgres -d`).
5. Run migrations: `pnpm --filter @ai-resume-builder/api exec prisma migrate dev`.
6. `pnpm dev` to run the API and web app together.

## Development workflow

- Create a branch off `main`: `git checkout -b feat/short-description`.
- Keep PRs focused — one feature or fix per PR.
- Follow existing patterns: NestJS modules under `apps/api/src/<feature>`, Next.js App Router
  pages under `apps/web/app`, shared logic in `packages/*`.
- Add or update tests for any behavior change:
  - API: Jest unit tests (`*.spec.ts`) next to the code, e2e in `apps/api/test`.
  - `packages/utils` / `packages/ui`: Vitest.
  - Web: Vitest for units, Playwright for user flows (`apps/web/e2e`).
- Before opening a PR, run:
  ```bash
  pnpm lint
  pnpm typecheck
  pnpm test
  ```

## Commit messages

We loosely follow [Conventional Commits](https://www.conventionalcommits.org/):
`feat:`, `fix:`, `docs:`, `refactor:`, `test:`, `chore:`. This keeps history scannable and powers
the auto-generated release notes.

## Picking up an issue

- Issues labeled [`good first issue`](https://github.com/jisinth/AI-Resume-Builder/labels/good%20first%20issue)
  are scoped to be approachable for new contributors.
- Comment on the issue before starting significant work, so effort isn't duplicated.
- Roadmap items in [ROADMAP.md](ROADMAP.md) that don't yet have an issue are fair game — please
  open one first to align on approach (especially for the bigger features like the job tracker or
  cover letter generator, which touch the API, DB, and UI).

## Adding a new AI provider

The AI layer is provider-agnostic (`apps/api/src/ai/providers`). To add a provider:

1. Implement the `AiProvider` interface (or extend `BaseLlmProvider` if it's a chat-completion
   style REST API).
2. Register it in `AiProviderFactory`.
3. Add its API key field to `UserAiSettings` (Prisma schema) and `UpdateAiSettingsDto`.
4. Add a migration: `pnpm --filter @ai-resume-builder/api exec prisma migrate dev --name add_<provider>_key`.

## Code style

- TypeScript everywhere, `strict` mode on.
- Prettier + ESLint are enforced in CI (`pnpm lint`, `pnpm format:check`).
- Prefer small, composable functions over large ones; avoid premature abstraction.
- No unnecessary comments — code should read clearly on its own; comment only non-obvious
  "why", not "what".

## Reporting bugs / requesting features

Please use the issue templates — they help us triage faster. For questions or open-ended
discussion, use [GitHub Discussions](https://github.com/jisinth/AI-Resume-Builder/discussions)
instead of an issue.

## Code of Conduct

This project follows the [Code of Conduct](CODE_OF_CONDUCT.md). Be kind.
