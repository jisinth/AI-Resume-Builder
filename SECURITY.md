# Security Policy

## Supported versions

This project is pre-1.0 and ships from `main`. Security fixes are only guaranteed against the
latest commit on `main`.

## Reporting a vulnerability

Please **do not** open a public GitHub issue for security vulnerabilities. Instead:

- Use [GitHub Security Advisories](https://github.com/jisinth/AI-Resume-Builder/security/advisories/new)
  to report privately, or
- Email the maintainer listed in [CODEOWNERS](.github/CODEOWNERS) with details and, if possible,
  a reproduction.

We aim to acknowledge reports within 5 business days and to ship a fix or mitigation within 30
days for confirmed issues, depending on severity.

## Security measures in this codebase

- **Authentication:** JWT access + refresh tokens, passwords hashed with bcrypt (12 rounds).
  Refresh tokens are hashed before storage.
- **Authorization:** every resume/AI/export endpoint verifies resource ownership before returning
  data.
- **Input validation:** all API input is validated via `class-validator` DTOs with
  `whitelist`/`forbidNonWhitelisted` enabled, rejecting unexpected fields.
- **Transport hardening:** `helmet` for security headers, explicit CORS allow-list, global rate
  limiting via `@nestjs/throttler` (tighter limits on `/auth/login` and `/ai/*`).
- **SQL injection:** all database access goes through Prisma's parameterized query builder — no
  raw string interpolation into SQL.
- **XSS:** React escapes all rendered content by default; no `dangerouslySetInnerHTML` is used
  with user-supplied content.
- **Secrets at rest:** user-supplied AI provider API keys are encrypted with AES-256-GCM before
  being stored (`apps/api/src/crypto/encryption.service.ts`) using a server-side encryption key
  that never leaves the API.
- **Secrets in transit/config:** `.env` files are gitignored; `.env.example` files document
  required variables without real values.

## Known tradeoffs

- **Token storage:** the web app currently stores JWTs in `localStorage` (via a Zustand store)
  rather than an httpOnly cookie session, which is simpler for a self-hosted, cross-origin
  API/web split but is more exposed to XSS than a cookie-based session would be. If you're
  deploying this for real users, consider migrating to httpOnly cookies + CSRF tokens, or put the
  API behind the same origin as the web app. Contributions here are welcome — see
  [ROADMAP.md](ROADMAP.md).
- **AI provider keys:** if you configure a global fallback API key via server environment
  variables, that key is shared across all users of the instance unless they set their own key in
  Settings. Only set a global key on instances you trust your users with.
