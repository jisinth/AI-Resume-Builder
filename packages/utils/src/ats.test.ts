import { describe, expect, it } from 'vitest';
import { computeAtsScore } from './ats';

describe('computeAtsScore', () => {
  const jobDescription = `
    We are hiring a Senior Backend Engineer with experience in Node.js, TypeScript,
    PostgreSQL, Docker, and Kubernetes. The ideal candidate has led migrations,
    optimized API performance, and mentored engineers.
  `;

  it('scores a well-matched resume highly', () => {
    const resumeText = `
      Jane Doe - jane@example.com
      Senior Backend Engineer

      - Led migration of a monolith to Node.js and TypeScript microservices, reducing latency by 40%
      - Optimized PostgreSQL queries, cutting API response time by 35%
      - Deployed services with Docker and Kubernetes across 3 environments
      - Mentored 4 engineers on backend best practices
    `;

    const result = computeAtsScore(resumeText, jobDescription);

    expect(result.score.overall).toBeGreaterThan(60);
    expect(result.matchedKeywords.length).toBeGreaterThan(0);
    expect(result.score.overall).toBeGreaterThanOrEqual(0);
    expect(result.score.overall).toBeLessThanOrEqual(100);
  });

  it('scores a poorly-matched resume lower than a well-matched one', () => {
    const weakResumeText = `
      John Smith
      I helped with some tasks and was responsible for various things at a company.
    `;

    const strongResumeText = `
      Jane Doe - jane@example.com
      - Led migration of a monolith to Node.js and TypeScript microservices, reducing latency by 40%
      - Optimized PostgreSQL queries, cutting API response time by 35%
      - Deployed services with Docker and Kubernetes across 3 environments
    `;

    const weak = computeAtsScore(weakResumeText, jobDescription);
    const strong = computeAtsScore(strongResumeText, jobDescription);

    expect(weak.score.overall).toBeLessThan(strong.score.overall);
  });

  it('always returns scores within 0-100 bounds', () => {
    const result = computeAtsScore('', jobDescription);
    for (const value of Object.values(result.score)) {
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThanOrEqual(100);
    }
  });
});
