import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";
import { AuthHeaders, Fixtures, MapTokenVerifier, TestHarness } from "./helpers.js";

const tokens = new Map<string, string>([
  ["token-a", "user_a"],
  ["token-b", "user_b"],
]);

describe("auth", () => {
  let harness: TestHarness;

  beforeAll(async () => {
    harness = await TestHarness.open({ verifier: new MapTokenVerifier(tokens) });
  });

  beforeEach(async () => {
    await harness.reset();
    await Fixtures.member(harness.prisma, {
      clerkUserId: "user_a",
      brandSpaceId: "space_a",
      slug: "space-a",
      role: "owner",
    });
    await Fixtures.member(harness.prisma, {
      clerkUserId: "user_b",
      brandSpaceId: "space_b",
      slug: "space-b",
      role: "member",
    });
  });

  afterAll(async () => {
    await harness.reset();
    await harness.close();
  });

  it("returns 401 when the bearer token is missing", async () => {
    const response = await harness.app.inject({
      method: "POST",
      url: "/api/v1/ai/ping",
      headers: { "x-org-id": "space_a" },
      payload: {},
    });
    expect(response.statusCode).toBe(401);
    expect(response.json()).toMatchObject({
      statusCode: 401,
      error: "Unauthorized",
      code: "unauthorized",
      message: "Missing bearer token",
    });
  });

  it("returns 401 when the session token is invalid", async () => {
    const response = await harness.app.inject({
      method: "POST",
      url: "/api/v1/ai/ping",
      headers: AuthHeaders.bearer("not-a-session", "space_a"),
      payload: {},
    });
    expect(response.statusCode).toBe(401);
    expect(response.json()).toMatchObject({
      statusCode: 401,
      code: "unauthorized",
      message: "Invalid session",
    });
  });

  it("returns 403 when x-org-id is missing", async () => {
    const response = await harness.app.inject({
      method: "POST",
      url: "/api/v1/ai/ping",
      headers: AuthHeaders.bearer("token-a"),
      payload: {},
    });
    expect(response.statusCode).toBe(403);
    expect(response.json()).toMatchObject({
      statusCode: 403,
      error: "Forbidden",
      code: "forbidden",
      message: "Missing x-org-id",
    });
  });

  it("returns 403 when the user is not a member of the Brand Space", async () => {
    const response = await harness.app.inject({
      method: "POST",
      url: "/api/v1/ai/ping",
      headers: AuthHeaders.bearer("token-a", "space_b"),
      payload: {},
    });
    expect(response.statusCode).toBe(403);
    expect(response.json()).toMatchObject({
      statusCode: 403,
      code: "forbidden",
      message: "Not a member of this Brand Space",
    });
  });

  it("returns 403 for an unknown Brand Space without leaking that it is missing", async () => {
    const response = await harness.app.inject({
      method: "POST",
      url: "/api/v1/ai/ping",
      headers: AuthHeaders.bearer("token-a", "space_missing"),
      payload: {},
    });
    expect(response.statusCode).toBe(403);
    expect(response.json()).toMatchObject({
      message: "Not a member of this Brand Space",
    });
  });

  it("returns 200 and scopes the request to the caller's Brand Space", async () => {
    const asMemberA = await harness.app.inject({
      method: "POST",
      url: "/api/v1/ai/ping",
      headers: AuthHeaders.bearer("token-a", "space_a"),
      payload: { message: "hello" },
    });
    expect(asMemberA.statusCode).toBe(200);
    expect(asMemberA.json()).toMatchObject({ brandSpaceId: "space_a" });

    const asMemberB = await harness.app.inject({
      method: "POST",
      url: "/api/v1/ai/ping",
      headers: AuthHeaders.bearer("token-b", "space_b"),
      payload: {},
    });
    expect(asMemberB.statusCode).toBe(200);
    expect(asMemberB.json()).toMatchObject({ brandSpaceId: "space_b" });
  });
});
