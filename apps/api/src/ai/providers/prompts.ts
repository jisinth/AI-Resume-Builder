import type { AiRewriteRequest } from '@ai-resume-builder/types';

export const RESUME_ASSISTANT_SYSTEM_PROMPT =
  'You are an expert resume writer and technical recruiter. You write concise, ATS-friendly, ' +
  'metrics-driven resume content. You always respond with a single valid JSON object and no ' +
  'additional commentary or markdown formatting.';

export function buildRewritePrompt(request: AiRewriteRequest): string {
  const role = request.context?.targetRole ?? request.context?.jobTitle ?? 'the target role';
  return [
    `Rewrite the following resume line for a candidate targeting ${role}.`,
    'Use a strong action verb, keep it under 220 characters, and add a quantifiable metric if plausible.',
    'Do not invent specific numbers that were not implied by the original text — use a bracketed placeholder like [X%] if none was given.',
    '',
    `Original: """${request.text}"""`,
    '',
    'Respond as JSON: { "rewritten": string, "changes": string[] }',
  ].join('\n');
}

export function buildAtsScorePrompt(resumeText: string, jobDescription: string): string {
  return [
    'Compare this resume against the job description and produce an ATS compatibility analysis.',
    '',
    `Resume:\n"""${resumeText}"""`,
    '',
    `Job description:\n"""${jobDescription}"""`,
    '',
    'Respond as JSON matching exactly this shape:',
    '{',
    '  "score": { "overall": number, "formatting": number, "keywords": number, "experience": number, "skills": number },',
    '  "matchedKeywords": string[],',
    '  "missingKeywords": string[],',
    '  "suggestions": string[]',
    '}',
    'All score fields are integers from 0 to 100.',
  ].join('\n');
}

export function buildSuggestionsPrompt(resumeText: string): string {
  return [
    'Review this resume and identify weak bullets, weak verbs, missing achievements, missing keywords,',
    'and overly long paragraphs. Be specific and reference the actual text.',
    '',
    `Resume:\n"""${resumeText}"""`,
    '',
    'Respond as JSON matching exactly this shape:',
    '{',
    '  "suggestions": [',
    '    { "section": string, "itemId": null, "severity": "low" | "medium" | "high", "issue": string, "suggestion": string }',
    '  ]',
    '}',
    'Return at most 15 suggestions.',
  ].join('\n');
}
