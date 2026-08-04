export const STOP_WORDS = new Set([
  'a',
  'an',
  'and',
  'are',
  'as',
  'at',
  'be',
  'by',
  'for',
  'from',
  'has',
  'have',
  'in',
  'is',
  'it',
  'its',
  'of',
  'on',
  'or',
  'our',
  'that',
  'the',
  'their',
  'this',
  'to',
  'we',
  'will',
  'with',
  'you',
  'your',
  'they',
  'them',
  'i',
  'us',
  'if',
  'but',
  'not',
  'can',
  'may',
  'able',
  'etc',
  'about',
  'into',
  'than',
  'then',
  'so',
  'do',
  'does',
  'did',
  'been',
  'being',
  'was',
  'were',
  'all',
  'any',
  'more',
  'most',
  'other',
  'such',
  'no',
  'nor',
  'per',
  'via',
  'up',
  'down',
  'out',
  'over',
  'under',
  'again',
  'here',
  'there',
  'when',
  'where',
  'why',
  'how',
  'both',
  'each',
]);

export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[^a-z0-9+.#\s-]/g, ' ')
    .split(/\s+/)
    .map((token) => token.trim().replace(/^[.-]+|[.-]+$/g, ''))
    .filter((token) => token.length > 1 && !STOP_WORDS.has(token));
}

export function extractKeywords(text: string, limit = 25): string[] {
  const tokens = tokenize(text);
  const frequency = new Map<string, number>();

  for (const token of tokens) {
    frequency.set(token, (frequency.get(token) ?? 0) + 1);
  }

  return Array.from(frequency.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([word]) => word);
}

export function keywordOverlap(
  sourceKeywords: string[],
  targetText: string,
): { matched: string[]; missing: string[] } {
  const targetTokens = new Set(tokenize(targetText));
  const matched: string[] = [];
  const missing: string[] = [];

  for (const keyword of sourceKeywords) {
    if (targetTokens.has(keyword)) {
      matched.push(keyword);
    } else {
      missing.push(keyword);
    }
  }

  return { matched, missing };
}
