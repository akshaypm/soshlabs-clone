import type { FastifyInstance, FastifyServerOptions } from "fastify";
import { FakeAiProvider, type AiProvider } from "../src/ai/ai-provider.js";
import { TokenVerificationError, type TokenVerifier, type VerifiedSession } from "../src/auth/token-verifier.js";
import { ApiConfig } from "../src/config.js";
import { PrismaDatabase } from "../src/db.js";
import { ApiServer } from "../src/server.js";
import type { MembershipRole, PrismaClient } from "../src/generated/prisma/client.js";

export class MapTokenVerifier implements TokenVerifier {
  readonly name = "test";

  constructor(private readonly tokens: ReadonlyMap<string, string>) {}

  async verify(token: string): Promise<VerifiedSession> {
    const clerkUserId = this.tokens.get(token);
    if (!clerkUserId) {
      throw new TokenVerificationError("invalid");
    }
    return { clerkUserId };
  }
}

export class TestDatabase {
  static async reset(prisma: PrismaClient): Promise<void> {
    await prisma.$transaction([
      prisma.mediaAsset.deleteMany(),
      prisma.post.deleteMany(),
      prisma.socialAccount.deleteMany(),
      prisma.campaign.deleteMany(),
      prisma.brandDna.deleteMany(),
      prisma.membership.deleteMany(),
      prisma.brandSpace.deleteMany(),
      prisma.user.deleteMany(),
    ]);
  }
}

export class Fixtures {
  static async member(
    prisma: PrismaClient,
    input: { clerkUserId: string; brandSpaceId: string; slug: string; role?: MembershipRole },
  ): Promise<{ userId: string; brandSpaceId: string }> {
    const user = await prisma.user.create({
      data: {
        clerkUserId: input.clerkUserId,
        email: `${input.clerkUserId}@example.test`,
      },
    });
    const brandSpace = await prisma.brandSpace.create({
      data: {
        id: input.brandSpaceId,
        name: input.slug,
        slug: input.slug,
      },
    });
    await prisma.membership.create({
      data: {
        userId: user.id,
        brandSpaceId: brandSpace.id,
        role: input.role ?? "owner",
      },
    });
    return { userId: user.id, brandSpaceId: brandSpace.id };
  }
}

export class AuthHeaders {
  static bearer(token: string, orgId?: string): Record<string, string> {
    const headers: Record<string, string> = {
      authorization: `Bearer ${token}`,
    };
    if (orgId !== undefined) {
      headers["x-org-id"] = orgId;
    }
    return headers;
  }
}

export class TestHarness {
  readonly app: FastifyInstance;
  readonly prisma: PrismaClient;

  private constructor(app: FastifyInstance, prisma: PrismaClient) {
    this.app = app;
    this.prisma = prisma;
  }

  static async open(options?: {
    verifier?: TokenVerifier;
    ai?: AiProvider;
    logger?: FastifyServerOptions["logger"];
    databaseUrl?: string;
  }): Promise<TestHarness> {
    const databaseUrl = options?.databaseUrl ?? process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error("DATABASE_URL is required to run api tests");
    }
    const config = ApiConfig.fromEnv({
      ...process.env,
      DATABASE_URL: databaseUrl,
      NODE_ENV: "test",
      LOG_LEVEL: "silent",
      ANTHROPIC_API_KEY: "",
      ANTHROPIC_MODEL: "",
    });
    const prisma = PrismaDatabase.connect(databaseUrl);
    const app = await ApiServer.build({
      config,
      prisma,
      verifier: options?.verifier ?? new MapTokenVerifier(new Map()),
      ai: options?.ai ?? new FakeAiProvider(),
      logger: options?.logger ?? false,
    });
    return new TestHarness(app, prisma);
  }

  async reset(): Promise<void> {
    await TestDatabase.reset(this.prisma);
  }

  async close(): Promise<void> {
    await this.app.close();
    await this.prisma.$disconnect();
  }
}
