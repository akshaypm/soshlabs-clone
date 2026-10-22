import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { AiProvider, ClaudeAiProvider, FakeAiProvider } from "../src/ai/ai-provider.js";
import { ApiConfig } from "../src/config.js";
import { ClerkTokenVerifier, TokenVerificationError } from "../src/auth/token-verifier.js";
import { AuthHeaders, Fixtures, MapTokenVerifier, TestHarness } from "./helpers.js";

describe("AI ping", () => {
  let harness: TestHarness;

  beforeAll(async () => {
    harness = await TestHarness.open({
      verifier: new MapTokenVerifier(new Map([["token-a", "user_a"]])),
      ai: new FakeAiProvider(),
    });
  });

  beforeEach(async () => {
    await harness.reset();
    await Fixtures.member(harness.prisma, {
      clerkUserId: "user_a",
      brandSpaceId: "space_a",
      slug: "space-a",
    });
  });

  afterAll(async () => {
    await harness.reset();
    await harness.close();
  });

  it("returns a deterministic fake reply behind auth", async () => {
    const response = await harness.app.inject({
      method: "POST",
      url: "/api/v1/ai/ping",
      headers: {
        ...AuthHeaders.bearer("token-a", "space_a"),
        "content-type": "application/json",
      },
      payload: { message: "hello" },
    });
    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({
      provider: "fake",
      model: "fake-1",
      reply: "pong:hello",
      brandSpaceId: "space_a",
    });
  });

  it("rejects an invalid body", async () => {
    const response = await harness.app.inject({
      method: "POST",
      url: "/api/v1/ai/ping",
      headers: {
        ...AuthHeaders.bearer("token-a", "space_a"),
        "content-type": "application/json",
      },
      payload: { message: "" },
    });
    expect(response.statusCode).toBe(400);
    expect(response.json()).toMatchObject({
      statusCode: 400,
      code: "validation_error",
      message: "Invalid request body",
    });
    const body = response.json() as { details: { path: string }[] };
    expect(body.details[0]?.path).toBe("message");
  });

  it("uses FakeAiProvider when no Anthropic key is set and Claude when one is", () => {
    const fakeConfig = ApiConfig.fromEnv({
      DATABASE_URL: "postgresql://sosh:sosh@localhost:5432/sosh",
    });
    expect(AiProvider.create(fakeConfig)).toBeInstanceOf(FakeAiProvider);

    const claude = AiProvider.create({
      anthropicApiKey: "test-key",
      anthropicModel: "claude-sonnet-4-5",
    });
    expect(claude).toBeInstanceOf(ClaudeAiProvider);
    expect(claude.model).toBe("claude-sonnet-4-5");

    expect(() =>
      AiProvider.create({
        anthropicApiKey: "test-key",
      }),
    ).toThrow(/ANTHROPIC_MODEL/);
  });

  it("rejects every token when Clerk is not configured", async () => {
    const verifier = ClerkTokenVerifier.fromConfig({ clerkAuthorizedParties: [] });
    await expect(verifier.verify("not-a-jwt")).rejects.toBeInstanceOf(TokenVerificationError);
  });
});
