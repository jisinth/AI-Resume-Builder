import { BaseLlmProvider } from './base-llm.provider';
import type { AiProviderCredentials } from './ai-provider.interface';

const DEFAULT_MODEL = 'deepseek-chat';

/** DeepSeek exposes an OpenAI-compatible chat completions API. */
export class DeepSeekProvider extends BaseLlmProvider {
  readonly id = 'deepseek';

  constructor(private readonly credentials: AiProviderCredentials) {
    super();
  }

  protected async complete(systemPrompt: string, userPrompt: string): Promise<string> {
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.credentials.apiKey}`,
      },
      body: JSON.stringify({
        model: this.credentials.model ?? DEFAULT_MODEL,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.4,
      }),
    });

    if (!response.ok) {
      throw new Error(`DeepSeek API error (${response.status}): ${await response.text()}`);
    }

    const data = (await response.json()) as {
      choices: { message: { content: string } }[];
    };
    return data.choices[0]?.message.content ?? '';
  }
}
