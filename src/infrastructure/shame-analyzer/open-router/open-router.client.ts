export class OpenRouterClient {
  constructor(
    private readonly baseUrl: string,
    private readonly apiKey: string,
    private readonly model: string,
  ) {}

  async doJsonRequest<T>(prompt: string): Promise<T> {
    const payload = {
      method: 'POST',
      headers: this.headers,
      body: this.buildBody(prompt),
    };
    const response = await fetch(this.baseUrl, payload);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenRouter API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    console.dir(data, { depth: 10 });

    if (!content) {
      throw new Error(`Empty response from LLM: ${JSON.stringify(data)}`);
    }

    return JSON.parse(content) as T;
  }

  private get headers(): Record<string, string> {
    return {
      Authorization: `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
    };
  }

  private buildBody(content: string): string {
    return JSON.stringify({
      // https://openrouter.ai/docs/api/reference/overview
      model: this.model,
      temperature: 0.1,
      response_format: { type: 'json_object' },
      plugins: [{ id: 'response-healing' }],
      messages: [{ role: 'user', type: 'message', content }],
    });
  }
}
