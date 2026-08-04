import type {
  AiRewriteRequest,
  AiRewriteResponse,
  AtsScoreResponse,
  ResumeSuggestionsResponse,
} from '@ai-resume-builder/types';
import { computeAtsScore, STRONG_ACTION_VERBS, WEAK_VERBS } from '@ai-resume-builder/utils';
import type { AiProvider } from './ai-provider.interface';

const WEAK_PHRASE_PATTERN = new RegExp(`^(i\\s+)?(${Array.from(WEAK_VERBS).join('|')})\\b`, 'i');
const METRIC_PATTERN = /\d/;

/**
 * Deterministic, zero-dependency AI provider. Active by default so the app
 * is fully usable without any external API key. Real provider adapters
 * (OpenAI/Anthropic/Gemini/DeepSeek) activate once a key is configured.
 */
export class MockAiProvider implements AiProvider {
  readonly id = 'mock';

  async rewrite(request: AiRewriteRequest): Promise<AiRewriteResponse> {
    const original = request.text.trim();
    const changes: string[] = [];

    let rewritten = original.replace(/^(i\s+|my\s+)/i, '');

    const weakMatch = rewritten.match(WEAK_PHRASE_PATTERN);
    if (weakMatch) {
      const replacement = pickStrongVerb(rewritten);
      rewritten = `${replacement} ${rewritten.slice(weakMatch[0].length).trim()}`;
      changes.push(
        `Replaced a weak opening ("${weakMatch[0].trim()}") with a stronger action verb.`,
      );
    } else if (!startsWithStrongVerb(rewritten)) {
      const replacement = pickStrongVerb(rewritten);
      rewritten = `${replacement} ${lowerFirst(rewritten)}`;
      changes.push('Added a strong action verb to open the bullet.');
    }

    rewritten = capitalizeFirst(rewritten.trim());
    if (!/[.!]$/.test(rewritten)) {
      changes.push('Standardized punctuation.');
    }

    if (!METRIC_PATTERN.test(rewritten)) {
      changes.push('Consider adding a quantifiable metric (%, $, time saved, users impacted).');
    }

    if (changes.length === 0) {
      changes.push('No changes needed — this line already reads well.');
    }

    return { original: request.text, rewritten, changes };
  }

  async atsScore(resumeText: string, jobDescription: string): Promise<AtsScoreResponse> {
    return computeAtsScore(resumeText, jobDescription);
  }

  async suggestions(resumeText: string): Promise<ResumeSuggestionsResponse> {
    const lines = resumeText
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);

    const suggestions: ResumeSuggestionsResponse['suggestions'] = [];

    lines.forEach((line, index) => {
      const lower = line.toLowerCase();
      const hasWeakVerb = Array.from(WEAK_VERBS).some((verb) => lower.startsWith(verb));
      if (hasWeakVerb) {
        suggestions.push({
          section: 'experience',
          itemId: `line-${index}`,
          severity: 'medium',
          issue: 'Bullet opens with a weak verb.',
          suggestion: `Rewrite "${line}" to start with a strong action verb like "Led", "Built", or "Optimized".`,
        });
      }

      if (line.length > 220) {
        suggestions.push({
          section: 'experience',
          itemId: `line-${index}`,
          severity: 'low',
          issue: 'Bullet is long and may be hard to scan.',
          suggestion: 'Split this into two shorter, more focused bullets.',
        });
      }

      if (!METRIC_PATTERN.test(line) && line.length > 40 && /^[A-Z]/.test(line)) {
        suggestions.push({
          section: 'experience',
          itemId: `line-${index}`,
          severity: 'low',
          issue: 'No quantifiable impact detected.',
          suggestion: 'Add a number, percentage, or measurable outcome to strengthen this line.',
        });
      }
    });

    if (suggestions.length === 0) {
      suggestions.push({
        section: 'general',
        itemId: null,
        severity: 'low',
        issue: 'No major issues detected.',
        suggestion: 'Your resume reads well. Consider tailoring keywords per job description.',
      });
    }

    return { suggestions: suggestions.slice(0, 20) };
  }
}

function pickStrongVerb(text: string): string {
  const lower = text.toLowerCase();
  if (/team|mentor|manage/.test(lower)) return 'Led';
  if (/build|develop|creat|implement/.test(lower)) return 'Built';
  if (/process|workflow|pipeline|automat/.test(lower)) return 'Streamlined';
  if (/reduce|cut|decrease|fix|debug/.test(lower)) return 'Resolved';
  if (/increase|grow|improve|boost/.test(lower)) return 'Improved';
  return 'Delivered';
}

function startsWithStrongVerb(text: string): boolean {
  const firstWord = text.split(/\s+/)[0]?.toLowerCase() ?? '';
  return STRONG_ACTION_VERBS.has(firstWord);
}

function capitalizeFirst(text: string): string {
  if (!text) return text;
  return text[0]!.toUpperCase() + text.slice(1);
}

function lowerFirst(text: string): string {
  if (!text) return text;
  return text[0]!.toLowerCase() + text.slice(1);
}
