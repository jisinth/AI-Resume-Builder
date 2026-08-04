import { BaseLlmProvider } from './base-llm.provider';
import type { AiProviderCredentials } from './ai-provider.interface';

const DEFAULT_MODEL = 'gemini-2.0-flash';

export class GeminiProvider extends BaseLlmProvider {
  readonly id = 'gemini';

  constructor(private readonly credentials: AiProviderCredentials) {
    super();
  }

  protected async complete(systemPrompt: string, userPrompt: string): Promise<string> {
    const model = this.credentials.model ?? DEFAULT_MODEL;
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${this.credentials.apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: systemPrompt }] },
        contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
        generationConfig: { temperature: 0.4, responseMimeType: 'application/json' },
      }),
    });

    if (!response.ok) {
      throw new Error(`Gemini API error (${response.status}): ${await response.text()}`);
    }

    const data = (await response.json()) as {
      candidates: { content: { parts: { text: string }[] } }[];
    };
    return data.candidates[0]?.content.parts.map((part) => part.text).join('') ?? '';
  }
}
