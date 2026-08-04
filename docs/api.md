# API Reference

Full interactive docs (Swagger/OpenAPI) are served at `GET /api/docs` when the API is running.
This page is a quick-reference summary. Base URL: `/api/v1`.

All endpoints except `POST /auth/register`, `POST /auth/login`, and `POST /auth/refresh` require
`Authorization: Bearer <accessToken>`.

## Auth

| Method | Path             | Description                                                    |
| ------ | ---------------- | -------------------------------------------------------------- |
| POST   | `/auth/register` | Create an account, returns user + token pair                   |
| POST   | `/auth/login`    | Authenticate, returns user + token pair (rate-limited: 10/min) |
| POST   | `/auth/refresh`  | Exchange a refresh token for a new token pair                  |
| POST   | `/auth/logout`   | Revoke the current refresh token                               |

## Users

| Method | Path                    | Description                                                         |
| ------ | ----------------------- | ------------------------------------------------------------------- |
| GET    | `/users/me`             | Get the current user's profile                                      |
| PATCH  | `/users/me`             | Update name / avatar                                                |
| GET    | `/users/me/ai-settings` | Get preferred AI provider + which keys are configured               |
| PUT    | `/users/me/ai-settings` | Set preferred provider and/or provider API keys (encrypted at rest) |

## Resumes

| Method | Path                       | Description                                                          |
| ------ | -------------------------- | -------------------------------------------------------------------- |
| GET    | `/resumes`                 | List the current user's resumes                                      |
| POST   | `/resumes`                 | Create a resume (with nested experience/education/etc.)              |
| GET    | `/resumes/stats/dashboard` | Aggregate dashboard stats (resume count, avg ATS score, ...)         |
| GET    | `/resumes/:id`             | Get one resume                                                       |
| PATCH  | `/resumes/:id`             | Update a resume (any provided section arrays fully replace existing) |
| DELETE | `/resumes/:id`             | Delete a resume                                                      |
| POST   | `/resumes/:id/duplicate`   | Duplicate a resume                                                   |
| GET    | `/resumes/:id/export/pdf`  | Download the resume as a PDF                                         |

## AI

All AI endpoints are rate-limited (20/min) and route through whichever provider the user has
configured (Mock by default). See [docs/architecture.md](architecture.md#ai-provider-architecture).

| Method | Path              | Description                                                          |
| ------ | ----------------- | -------------------------------------------------------------------- |
| POST   | `/ai/rewrite`     | Rewrite a bullet or summary: `{ task, text, context? }`              |
| POST   | `/ai/ats-score`   | Score a resume vs. a job description: `{ resumeId, jobDescription }` |
| POST   | `/ai/suggestions` | Get improvement suggestions for a resume: `{ resumeId }`             |

## Templates

| Method | Path         | Description                                                |
| ------ | ------------ | ---------------------------------------------------------- |
| GET    | `/templates` | List available resume templates (public, no auth required) |

## Health

| Method | Path      | Description                            |
| ------ | --------- | -------------------------------------- |
| GET    | `/health` | Liveness + database connectivity check |

## Error shape

All errors return:

```json
{
  "statusCode": 400,
  "message": "Human-readable message",
  "error": "BadRequestException",
  "path": "/api/v1/resumes",
  "timestamp": "2026-01-01T00:00:00.000Z"
}
```
