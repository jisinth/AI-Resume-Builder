import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AiProviderId } from '@ai-resume-builder/types';
import type { Env } from '../../config/env.validation';
import type { AiProvider } from './ai-provider.interface';
import { MockAiProvider } from './mock-ai.provider';
import { OpenAiProvider } from './openai.provider';
import { AnthropicProvider } from './anthropic.provider';
import { GeminiProvider } from './gemini.provider';
import { DeepSeekProvider } from './deepseek.provider';

export interface ResolvedProviderKeys {
  openaiApiKey?: string;
  anthropicApiKey?: string;
  geminiApiKey?: string;
  deepseekApiKey?: string;
}

@Injectable()
export class AiProviderFactory {
  constructor(private readonly configService: ConfigService<Env, true>) {}

  create(providerId: AiProviderId, userKeys: ResolvedProviderKeys): AiProvider {
    switch (providerId) {
      case AiProviderId.MOCK:
        return new MockAiProvider();

      case AiProviderId.OPENAI:
        return new OpenAiProvider({
          apiKey: this.requireKey(
            userKeys.openaiApiKey ?? this.configService.get('OPENAI_API_KEY', { infer: true }),
            'OpenAI',
          ),
        });

      case AiProviderId.ANTHROPIC:
        return new AnthropicProvider({
          apiKey: this.requireKey(
            userKeys.anthropicApiKey ??
              this.configService.get('ANTHROPIC_API_KEY', { infer: true }),
            'Anthropic',
          ),
        });

      case AiProviderId.GEMINI:
        return new GeminiProvider({
          apiKey: this.requireKey(
            userKeys.geminiApiKey ?? this.configService.get('GEMINI_API_KEY', { infer: true }),
            'Gemini',
          ),
        });

      case AiProviderId.DEEPSEEK:
        return new DeepSeekProvider({
          apiKey: this.requireKey(
            userKeys.deepseekApiKey ?? this.configService.get('DEEPSEEK_API_KEY', { infer: true }),
            'DeepSeek',
          ),
        });

      default:
        return new MockAiProvider();
    }
  }

  private requireKey(key: string | undefined, providerName: string): string {
    if (!key) {
      throw new BadRequestException(
        `No ${providerName} API key configured. Add one in Settings or switch to the Mock provider.`,
      );
    }
    return key;
  }
}
