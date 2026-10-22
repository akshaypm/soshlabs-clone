import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { PostStatus } from "../src/generated/prisma/client.js";
import { TestHarness } from "./helpers.js";

describe("core domain", () => {
  let harness: TestHarness;

  beforeAll(async () => {
    harness = await TestHarness.open();
    await harness.reset();
  });

  afterAll(async () => {
    await harness.reset();
    await harness.close();
  });

  it("stores a Brand Space, membership, Brand DNA, post, campaign, social account, and media asset", async () => {
    const user = await harness.prisma.user.create({
      data: { clerkUserId: "user_domain", email: "domain@example.test", name: "Domain" },
    });
    const space = await harness.prisma.brandSpace.create({
      data: { name: "North Lab", slug: "north-lab" },
    });
    await harness.prisma.membership.create({
      data: { userId: user.id, brandSpaceId: space.id, role: "admin" },
    });
    await harness.prisma.brandDna.create({
      data: {
        brandSpaceId: space.id,
        summary: "A neighborhood studio.",
        voice: "warm",
        audience: "founders",
        goals: "stay visible",
        websiteUrl: "https://example.test",
      },
    });
    const campaign = await harness.prisma.campaign.create({
      data: { brandSpaceId: space.id, name: "October", goal: "open house" },
    });
    const post = await harness.prisma.post.create({
      data: {
        brandSpaceId: space.id,
        campaignId: campaign.id,
        contentType: "carousel",
        platform: "instagram",
        status: PostStatus.pending_approval,
        body: "Saturday open house.",
        scheduledAt: new Date("2026-10-25T17:00:00.000Z"),
      },
    });
    await harness.prisma.socialAccount.create({
      data: {
        brandSpaceId: space.id,
        platform: "instagram",
        externalAccountId: "ig_1",
        displayName: "@north",
        tokenCiphertext: "ciphertext-placeholder",
      },
    });
    await harness.prisma.mediaAsset.create({
      data: {
        brandSpaceId: space.id,
        storageKey: "spaces/north/hero.webp",
        fileName: "hero.webp",
        mimeType: "image/webp",
        byteSize: 1024,
      },
    });

    const stored = await harness.prisma.post.findUniqueOrThrow({ where: { id: post.id } });
    expect(stored.status).toBe("pending_approval");

    const rows = await harness.prisma.$queryRaw<{ status: string }[]>`
      SELECT status::text AS status FROM "Post" WHERE id = ${post.id}
    `;
    expect(rows[0]?.status).toBe("pending-approval");

    const member = await harness.prisma.membership.findFirstOrThrow({
      where: { userId: user.id, brandSpaceId: space.id },
    });
    expect(member.role).toBe("admin");
  });
});