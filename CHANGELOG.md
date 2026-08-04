# Changelog

All notable changes to this project are documented here. Format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project intends to follow
[Semantic Versioning](https://semver.org/) from `v1.0.0` onward.

## [Unreleased]

### Added

- Initial public release of the core platform:
  - JWT authentication (register, login, refresh, logout)
  - Resume builder with personal info, experience, education, projects, skills, achievements,
    and certificates
  - AI-powered bullet/summary rewriting and resume suggestions
  - ATS scoring against a job description with keyword match breakdown
  - Four resume templates (Modern, Minimal, Corporate, ATS-Friendly)
  - PDF export
  - Autosave in the resume builder
  - Dashboard with aggregate stats
  - Dark mode
  - Bring-your-own AI provider key (OpenAI, Anthropic, Gemini, DeepSeek) with a built-in Mock
    provider as the zero-config default
  - Docker Compose deployment and GitHub Actions CI/CD
