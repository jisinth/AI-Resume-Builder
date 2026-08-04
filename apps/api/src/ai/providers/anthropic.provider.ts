import { BaseLlmProvider } from './base-llm.provider';
import type { AiProviderCredentials } from './ai-provider.interface';

const DEFAULT_MODEL = 'claude-haiku-4-5-20251001';
const ANTHROPIC_VERSION = '2023-06-01';

export class AnthropicProvider extends BaseLlmProvider {
  readonly id = 'anthropic';

  constructor(private readonly credentials: AiProviderCredentials) {
    super();
  }

  protected async complete(systemPrompt: string, userPrompt: string): Promise<string> {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': this.credentials.apiKey ?? '',
        'anthropic-version': ANTHROPIC_VERSION,
      },
      body: JSON.stringify({
        model: this.credentials.model ?? DEFAULT_MODEL,
        max_tokens: 1024,
        system: systemPrompt,
        messages: [{ role: 'user', content: userPrompt }],
      }),
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error (${response.status}): ${await response.text()}`);
    }

    const data = (await response.json()) as { content: { type: string; text: string }[] };
    return data.content.find((block) => block.type === 'text')?.text ?? '';
  }
}
