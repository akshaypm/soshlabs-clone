import { Writable } from "node:stream";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { DatabasePing } from "../src/db.js";
import { RequestLogger } from "../src/logging.js";
import { ApiServer } from "../src/server.js";
import { ApiConfig } from "../src/config.js";
import { MapTokenVerifier, TestHarness } from "./helpers.js";

class DownDatabase implements DatabasePing {
  async ping(): Promise<void> {
    throw new Error("connect ECONNREFUSED");
  }
}

describe("health", () => {
  let harness: TestHarness;

  beforeAll(async () => {
    harness = await TestHarness.open();
  });

  afterAll(async () => {
    await harness.close();
  });

  it("GET / returns the service document", async () => {
    const response = await harness.app.inject({ method: "GET", url: "/" });
    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({
      status: "ok",
      service: "Sosh AI API",
      health: "/api/v1/health",
    });
  });

  it("GET /api/v1/health pings the database", async () => {
    const response = await harness.app.inject({ method: "GET", url: "/api/v1/health" });
    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({
      status: "ok",
      service: "Sosh AI API",
      database: "ok",
    });
  });

  it("GET /api/v1/health returns 503 when the database ping fails", async () => {
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error("DATABASE_URL is required to run api tests");
    }
    const app = await ApiServer.build({
      config: ApiConfig.fromEnv({ DATABASE_URL: databaseUrl, LOG_LEVEL: "silent" }),
      database: new DownDatabase(),
      verifier: new MapTokenVerifier(new Map()),
      logger: false,
      prisma: harness.prisma,
    });
    const response = await app.inject({ method: "GET", url: "/api/v1/health" });
    expect(response.statusCode).toBe(503);
    expect(response.json()).toEqual({
      statusCode: 503,
      error: "Service Unavailable",
      code: "service_unavailable",
      message: "Database unreachable",
    });
    await app.close();
  });

  it("returns a structured 404 for unknown routes", async () => {
    const response = await harness.app.inject({ method: "GET", url: "/api/v1/missing" });
    expect(response.statusCode).toBe(404);
    expect(response.json()).toMatchObject({
      statusCode: 404,
      error: "Not Found",
      code: "not_found",
    });
  });

  it("returns a structured 400 for invalid JSON", async () => {
    const response = await harness.app.inject({
      method: "POST",
      url: "/api/v1/ai/ping",
      headers: { "content-type": "application/json" },
      payload: "{",
    });
    expect(response.statusCode).toBe(400);
    expect(response.json()).toMatchObject({
      statusCode: 400,
      code: "invalid_json",
    });
  });

  it("logs the request and does not log a bearer token", async () => {
    const lines: string[] = [];
    const stream = new Writable({
      write(chunk, _encoding, callback) {
        lines.push(chunk.toString());
        callback();
      },
    });
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error("DATABASE_URL is required to run api tests");
    }
    const app = await ApiServer.build({
      config: ApiConfig.fromEnv({ DATABASE_URL: databaseUrl }),
      logger: RequestLogger.options("info", stream),
      prisma: harness.prisma,
      verifier: new MapTokenVerifier(new Map()),
    });
    const secret = "super-secret-token";
    const response = await app.inject({
      method: "GET",
      url: "/",
      headers: { authorization: `Bearer ${secret}` },
    });
    expect(response.statusCode).toBe(200);
    const logged = lines.join("\n");
    expect(logged).toContain("incoming request");
    expect(logged).toContain("\"url\":\"/\"");
    expect(logged).not.toContain(secret);
    await app.close();
  });
});
