import { BadGatewayException, Logger } from '@nestjs/common';
import type {
  AiRewriteRequest,
  AiRewriteResponse,
  AtsScoreResponse,
  ResumeSuggestionsResponse,
} from '@ai-resume-builder/types';
import { computeAtsScore } from '@ai-resume-builder/utils';
import type { AiProvider } from './ai-provider.interface';
import { extractJson } from './json.util';
import {
  RESUME_ASSISTANT_SYSTEM_PROMPT,
  buildAtsScorePrompt,
  buildRewritePrompt,
  buildSuggestionsPrompt,
} from './prompts';

/**
 * Shared request/parse/fallback logic for LLM-backed providers. Subclasses
 * only need to implement `complete`, which sends a system + user prompt to
 * their respective chat completion API and returns the raw text response.
 */
export abstract class BaseLlmProvider implements AiProvider {
  abstract readonly id: string;
  protected readonly logger = new Logger(this.constructor.name);

  protected abstract complete(systemPrompt: string, userPrompt: string): Promise<string>;

  async rewrite(request: AiRewriteRequest): Promise<AiRewriteResponse> {
    const raw = await this.completeOrThrow(buildRewritePrompt(request));
    const parsed = extractJson<{ rewritten: string; changes: string[] }>(raw);

    if (!parsed?.rewritten) {
      throw new BadGatewayException(
        `${this.id} returned an unparseable response for the rewrite request`,
      );
    }

    return {
      original: request.text,
      rewritten: parsed.rewritten,
      changes: parsed.changes ?? [],
    };
  }

  async atsScore(resumeText: string, jobDescription: string): Promise<AtsScoreResponse> {
    try {
      const raw = await this.completeOrThrow(buildAtsScorePrompt(resumeText, jobDescription));
      const parsed = extractJson<AtsScoreResponse>(raw);
      if (parsed?.score) return parsed;
    } catch (error) {
      this.logger.warn(`Falling back to heuristic ATS score: ${(error as Error).message}`);
    }
    return computeAtsScore(resumeText, jobDescription);
  }

  async suggestions(resumeText: string): Promise<ResumeSuggestionsResponse> {
    const raw = await this.completeOrThrow(buildSuggestionsPrompt(resumeText));
    const parsed = extractJson<ResumeSuggestionsResponse>(raw);

    if (!parsed?.suggestions) {
      throw new BadGatewayException(
        `${this.id} returned an unparseable response for the suggestions request`,
      );
    }

    return parsed;
  }

  private async completeOrThrow(userPrompt: string): Promise<string> {
    try {
      return await this.complete(RESUME_ASSISTANT_SYSTEM_PROMPT, userPrompt);
    } catch (error) {
      this.logger.error(`${this.id} request failed`, error instanceof Error ? error.stack : error);
      throw new BadGatewayException(
        `Failed to reach ${this.id}. Check your API key and try again.`,
      );
    }
  }
}
