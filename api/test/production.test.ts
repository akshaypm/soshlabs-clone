import { Writable } from "node:stream";
import { describe, expect, it } from "vitest";
import { AiProvider, ClaudeAiProvider, FakeAiProvider } from "../src/ai/ai-provider.js";
import { ClerkTokenVerifier } from "../src/auth/token-verifier.js";
import { ApiConfig } from "../src/config.js";
import { RequestLogger } from "../src/logging.js";
import { ApiServer } from "../src/server.js";

const databaseUrl = "postgresql://sosh:sosh@localhost:5432/sosh";

describe("production startup", () => {
  it("fails when ANTHROPIC_API_KEY is missing", () => {
    expect(() =>
      ApiConfig.fromEnv({
        NODE_ENV: "production",
        DATABASE_URL: databaseUrl,
        CLERK_SECRET_KEY: "clerk-configured",
        ANTHROPIC_MODEL: "claude-sonnet-4-5",
      }),
    ).toThrow(/ANTHROPIC_API_KEY/);

    expect(() =>
      AiProvider.create({
        nodeEnv: "production",
        anthropicModel: "claude-sonnet-4-5",
      }),
    ).toThrow(/ANTHROPIC_API_KEY/);
  });

  it("fails when neither Clerk key is set", () => {
    expect(() =>
      ApiConfig.fromEnv({
        NODE_ENV: "production",
        DATABASE_URL: databaseUrl,
        ANTHROPIC_API_KEY: "anthropic-configured",
        ANTHROPIC_MODEL: "claude-sonnet-4-5",
      }),
    ).toThrow(/CLERK_SECRET_KEY or CLERK_JWT_KEY/);

    expect(() =>
      ClerkTokenVerifier.fromConfig({
        nodeEnv: "production",
        clerkAuthorizedParties: [],
      }),
    ).toThrow(/CLERK_SECRET_KEY or CLERK_JWT_KEY/);
  });

  it("keeps the fake provider and unconfigured verifier in development and test", () => {
    for (const nodeEnv of ["development", "test"]) {
      const config = ApiConfig.fromEnv({
        NODE_ENV: nodeEnv,
        DATABASE_URL: databaseUrl,
      });
      expect(AiProvider.create(config)).toBeInstanceOf(FakeAiProvider);
      expect(ClerkTokenVerifier.fromConfig(config).name).toBe("unconfigured");
    }
  });

  it("logs the active provider and verifier once, without secrets", async () => {
    const clerkSecret = "clerk-secret-should-not-appear";
    const anthropicKey = "anthropic-key-should-not-appear";
    const lines: string[] = [];
    const stream = new Writable({
      write(chunk, _encoding, callback) {
        lines.push(chunk.toString());
        callback();
      },
    });
    const config = ApiConfig.fromEnv({
      NODE_ENV: "development",
      DATABASE_URL: process.env.DATABASE_URL ?? databaseUrl,
      CLERK_SECRET_KEY: clerkSecret,
      ANTHROPIC_API_KEY: anthropicKey,
      ANTHROPIC_MODEL: "claude-sonnet-4-5",
    });
    const app = await ApiServer.build({
      config,
      logger: RequestLogger.options("info", stream),
    });
    const ready = lines.filter((line) => line.includes("integrations ready"));
    expect(ready).toHaveLength(1);
    expect(ready[0]).toContain('"aiProvider":"claude"');
    expect(ready[0]).toContain('"aiModel":"claude-sonnet-4-5"');
    expect(ready[0]).toContain('"tokenVerifier":"clerk"');
    expect(ready[0]).not.toContain(clerkSecret);
    expect(ready[0]).not.toContain(anthropicKey);
    expect(AiProvider.create(config)).toBeInstanceOf(ClaudeAiProvider);
    await app.close();
  });
});
