import type { AtsScoreResponse } from '@ai-resume-builder/types';
import { extractKeywords, keywordOverlap, tokenize } from './keywords';

export const STRONG_ACTION_VERBS = new Set([
  'achieved',
  'accelerated',
  'architected',
  'automated',
  'built',
  'championed',
  'delivered',
  'designed',
  'drove',
  'engineered',
  'improved',
  'increased',
  'launched',
  'led',
  'migrated',
  'optimized',
  'orchestrated',
  'pioneered',
  'reduced',
  'refactored',
  'resolved',
  'scaled',
  'shipped',
  'spearheaded',
  'streamlined',
  'transformed',
  'implemented',
  'deployed',
]);

export const WEAK_VERBS = new Set([
  'helped',
  'worked',
  'did',
  'was responsible for',
  'assisted',
  'participated',
  'involved',
  'handled',
  'dealt with',
  'tasked with',
]);

const METRIC_PATTERN =
  /\d+(\.\d+)?\s?(%|percent|x|k|m|ms|s|hrs?|hours?|days?|users?|customers?)?/gi;

/**
 * Deterministic, rule-based ATS scoring used by the mock AI provider.
 * Real provider adapters (OpenAI/Anthropic/Gemini/DeepSeek) may layer an LLM
 * judgment on top of this baseline, but the heuristic itself has no external
 * dependency so the app is fully usable without any API key.
 */
export function computeAtsScore(resumeText: string, jobDescription: string): AtsScoreResponse {
  const jdKeywords = extractKeywords(jobDescription, 30);
  const { matched, missing } = keywordOverlap(jdKeywords, resumeText);
  const keywordsScore =
    jdKeywords.length === 0 ? 100 : Math.round((matched.length / jdKeywords.length) * 100);

  const formattingScore = scoreFormatting(resumeText);
  const experienceScore = scoreExperienceSignal(resumeText);
  const skillsScore = scoreSkillsOverlap(resumeText, jobDescription);

  const overall = Math.round(
    keywordsScore * 0.35 + formattingScore * 0.2 + experienceScore * 0.25 + skillsScore * 0.2,
  );

  return {
    score: {
      overall,
      formatting: formattingScore,
      keywords: keywordsScore,
      experience: experienceScore,
      skills: skillsScore,
    },
    matchedKeywords: matched,
    missingKeywords: missing.slice(0, 15),
    suggestions: buildSuggestions({ formattingScore, experienceScore, keywordsScore, missing }),
  };
}

function scoreFormatting(resumeText: string): number {
  let score = 100;
  const lines = resumeText.split(/\r?\n/).filter((line) => line.trim().length > 0);

  if (resumeText.length < 400) score -= 20;
  if (resumeText.length > 12000) score -= 15;
  if (!/\n[-•*]/.test(resumeText) && !lines.some((line) => /^[-•*]/.test(line.trim()))) {
    score -= 10;
  }
  const longLines = lines.filter((line) => line.length > 300);
  if (longLines.length > 0) score -= Math.min(20, longLines.length * 5);
  if (!/@/.test(resumeText)) score -= 10;

  return clampScore(score);
}

function scoreExperienceSignal(resumeText: string): number {
  let score = 60;
  const tokens = tokenize(resumeText);
  const tokenSet = new Set(tokens);

  const strongVerbHits = Array.from(STRONG_ACTION_VERBS).filter((verb) =>
    tokenSet.has(verb),
  ).length;
  score += Math.min(25, strongVerbHits * 3);

  const weakVerbHits = Array.from(WEAK_VERBS).filter((verb) =>
    resumeText.toLowerCase().includes(verb),
  ).length;
  score -= Math.min(20, weakVerbHits * 4);

  const metricMatches = resumeText.match(METRIC_PATTERN) ?? [];
  score += Math.min(20, metricMatches.length * 2);

  return clampScore(score);
}

function scoreSkillsOverlap(resumeText: string, jobDescription: string): number {
  const jdKeywords = extractKeywords(jobDescription, 20);
  const { matched } = keywordOverlap(jdKeywords, resumeText);
  if (jdKeywords.length === 0) return 100;
  return clampScore(Math.round((matched.length / jdKeywords.length) * 100));
}

function clampScore(value: number): number {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function buildSuggestions(input: {
  formattingScore: number;
  experienceScore: number;
  keywordsScore: number;
  missing: string[];
}): string[] {
  const suggestions: string[] = [];

  if (input.keywordsScore < 70 && input.missing.length > 0) {
    suggestions.push(
      `Add these missing keywords from the job description where relevant: ${input.missing.slice(0, 8).join(', ')}.`,
    );
  }
  if (input.formattingScore < 80) {
    suggestions.push(
      'Use consistent bullet points, keep lines under ~200 characters, and include a reachable email address.',
    );
  }
  if (input.experienceScore < 70) {
    suggestions.push(
      'Start bullets with strong action verbs (led, built, optimized) and quantify impact with numbers or percentages.',
    );
  }
  if (suggestions.length === 0) {
    suggestions.push(
      'Your resume aligns well with this job description. Consider a final proofread pass.',
    );
  }

  return suggestions;
}
