import { AiTaskType } from '@ai-resume-builder/types';
import { MockAiProvider } from './mock-ai.provider';

describe('MockAiProvider', () => {
  const provider = new MockAiProvider();

  describe('rewrite', () => {
    it('replaces a weak opening verb with a stronger one', async () => {
      const result = await provider.rewrite({
        task: AiTaskType.REWRITE_BULLET,
        text: 'Helped the team build a new checkout flow',
      });

      expect(result.rewritten).not.toMatch(/^Helped/i);
      expect(result.changes.length).toBeGreaterThan(0);
    });

    it('suggests adding a metric when none is present', async () => {
      const result = await provider.rewrite({
        task: AiTaskType.REWRITE_BULLET,
        text: 'Led backend architecture for the payments platform',
      });

      expect(result.changes.some((change) => change.toLowerCase().includes('metric'))).toBe(true);
    });

    it('does not flag a metric suggestion when a number is already present', async () => {
      const result = await provider.rewrite({
        task: AiTaskType.REWRITE_BULLET,
        text: 'Led backend architecture for the payments platform, cutting latency by 40%',
      });

      expect(result.changes.some((change) => change.toLowerCase().includes('metric'))).toBe(false);
    });
  });

  describe('atsScore', () => {
    it('returns a full score breakdown within bounds', async () => {
      const result = await provider.atsScore(
        'Built and deployed Node.js services with PostgreSQL and Docker.',
        'Looking for a backend engineer with Node.js, PostgreSQL, and Docker experience.',
      );

      expect(result.score.overall).toBeGreaterThanOrEqual(0);
      expect(result.score.overall).toBeLessThanOrEqual(100);
      expect(Array.isArray(result.suggestions)).toBe(true);
    });
  });

  describe('suggestions', () => {
    it('flags lines that open with a weak verb', async () => {
      const result = await provider.suggestions('Was responsible for managing the sprint backlog');
      expect(result.suggestions.some((s) => s.issue.includes('weak verb'))).toBe(true);
    });

    it('returns a fallback suggestion when nothing is flagged', async () => {
      const result = await provider.suggestions(
        'Led migration of the API to TypeScript, reducing bugs by 25%',
      );
      expect(result.suggestions.length).toBeGreaterThan(0);
    });
  });
});
