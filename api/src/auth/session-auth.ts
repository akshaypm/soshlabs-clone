import type { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import type { MembershipRole, PrismaClient } from "../generated/prisma/client.js";
import { HttpError } from "../errors.js";
import { TokenVerificationError, type TokenVerifier, type VerifiedSession } from "./token-verifier.js";

export type AuthContext = {
  clerkUserId: string;
  userId: string;
  brandSpaceId: string;
  role: MembershipRole;
};

declare module "fastify" {
  interface FastifyInstance {
    requireAuth: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }

  interface FastifyRequest {
    auth: AuthContext | null;
  }
}

export class RequestAuth {
  static require(request: FastifyRequest): AuthContext {
    if (!request.auth) {
      throw HttpError.unauthorized("Missing bearer token");
    }
    return request.auth;
  }
}

export class BearerToken {
  static fromAuthorizationHeader(header: string | undefined): string {
    if (!header) {
      throw HttpError.unauthorized("Missing bearer token");
    }
    const parts = header.split(" ");
    const scheme = parts[0];
    const token = parts[1];
    if (scheme !== "Bearer" || parts.length !== 2 || !token) {
      throw HttpError.unauthorized("Missing bearer token");
    }
    return token;
  }
}

export class OrgIdHeader {
  static from(header: string | string[] | undefined): string {
    if (typeof header !== "string") {
      throw HttpError.forbidden("Missing x-org-id");
    }
    const value = header.trim();
    if (value.length === 0 || value.length > 200) {
      throw HttpError.forbidden("Missing x-org-id");
    }
    return value;
  }
}

export class SessionAuth {
  constructor(
    private readonly verifier: TokenVerifier,
    private readonly prisma: PrismaClient,
  ) {}

  static install(app: FastifyInstance, deps: { verifier: TokenVerifier; prisma: PrismaClient }): void {
    const auth = new SessionAuth(deps.verifier, deps.prisma);
    app.decorateRequest("auth", null);
    app.decorate("requireAuth", async (request: FastifyRequest, _reply: FastifyReply) => {
      await auth.authenticate(request);
    });
  }

  async authenticate(request: FastifyRequest): Promise<void> {
    const token = BearerToken.fromAuthorizationHeader(request.headers.authorization);
    let session: VerifiedSession;
    try {
      session = await this.verifier.verify(token);
    } catch (error) {
      const reason = error instanceof TokenVerificationError ? error.reason : "invalid";
      request.log.warn({ reason }, "session verification failed");
      throw HttpError.unauthorized("Invalid session");
    }

    const brandSpaceId = OrgIdHeader.from(request.headers["x-org-id"]);
    const membership = await this.prisma.membership.findFirst({
      where: {
        brandSpaceId,
        user: { clerkUserId: session.clerkUserId },
      },
      select: {
        role: true,
        userId: true,
        brandSpaceId: true,
      },
    });
    if (!membership) {
      throw HttpError.forbidden("Not a member of this Brand Space");
    }

    request.auth = {
      clerkUserId: session.clerkUserId,
      userId: membership.userId,
      brandSpaceId: membership.brandSpaceId,
      role: membership.role,
    };
  }
}
