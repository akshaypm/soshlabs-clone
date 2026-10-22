import Anthropic from "@anthropic-ai/sdk";

export type AiPingInput = {
  message?: string;
};

export type AiPingResult = {
  provider: string;
  model: string;
  reply: string;
};

export type AiProviderConfig = {
  anthropicApiKey?: string | undefined;
  anthropicModel?: string | undefined;
};

export abstract class AiProvider {
  abstract readonly name: string;
  abstract readonly model: string;

  abstract ping(input: AiPingInput): Promise<AiPingResult>;

  static create(config: AiProviderConfig): AiProvider {
    if (!config.anthropicApiKey) {
      return new FakeAiProvider();
    }
    if (!config.anthropicModel) {
      throw new Error("ANTHROPIC_MODEL is required when ANTHROPIC_API_KEY is set");
    }
    return ClaudeAiProvider.fromApiKey(config.anthropicApiKey, config.anthropicModel);
  }
}

export class FakeAiProvider extends AiProvider {
  readonly name = "fake";
  readonly model = "fake-1";

  async ping(input: AiPingInput): Promise<AiPingResult> {
    return {
      provider: this.name,
      model: this.model,
      reply: `pong:${input.message ?? "ping"}`,
    };
  }
}

export class ClaudeAiProvider extends AiProvider {
  readonly name = "claude";
  readonly model: string;

  private constructor(
    private readonly client: Anthropic,
    model: string,
  ) {
    super();
    this.model = model;
  }

  static fromApiKey(apiKey: string, model: string): ClaudeAiProvider {
    return new ClaudeAiProvider(new Anthropic({ apiKey }), model);
  }

  async ping(input: AiPingInput): Promise<AiPingResult> {
    const message = await this.client.messages.create({
      model: this.model,
      max_tokens: 64,
      messages: [{ role: "user", content: input.message ?? "ping" }],
    });
    const reply = ClaudeAiProvider.textFrom(message.content);
    if (reply.length === 0) {
      throw new Error("Claude returned an empty reply");
    }
    return {
      provider: this.name,
      model: this.model,
      reply,
    };
  }

  private static textFrom(content: Anthropic.Message["content"]): string {
    const parts: string[] = [];
    for (const block of content) {
      if (block.type === "text") {
        parts.push(block.text);
      }
    }
    return parts.join("").trim();
  }
}
