import { verifyToken, type VerifyTokenOptions } from "@clerk/backend";

export type VerifiedSession = {
  clerkUserId: string;
};

export interface TokenVerifier {
  verify(token: string): Promise<VerifiedSession>;
}

export type TokenFailureReason = "unconfigured" | "invalid" | "missing_subject";

export class TokenVerificationError extends Error {
  readonly reason: TokenFailureReason;

  constructor(reason: TokenFailureReason) {
    super(reason);
    this.name = "TokenVerificationError";
    this.reason = reason;
  }
}

type ClerkVerifierConfig = {
  clerkSecretKey?: string | undefined;
  clerkJwtKey?: string | undefined;
  clerkAuthorizedParties: readonly string[];
};

export class ClerkTokenVerifier implements TokenVerifier {
  private readonly options: VerifyTokenOptions;

  private constructor(options: VerifyTokenOptions) {
    this.options = options;
  }

  static fromConfig(config: ClerkVerifierConfig): TokenVerifier {
    if (!config.clerkSecretKey && !config.clerkJwtKey) {
      return new UnconfiguredTokenVerifier();
    }
    const options: VerifyTokenOptions = {};
    if (config.clerkSecretKey) {
      options.secretKey = config.clerkSecretKey;
    }
    if (config.clerkJwtKey) {
      options.jwtKey = config.clerkJwtKey;
    }
    if (config.clerkAuthorizedParties.length > 0) {
      options.authorizedParties = [...config.clerkAuthorizedParties];
    }
    return new ClerkTokenVerifier(options);
  }

  async verify(token: string): Promise<VerifiedSession> {
    let result: unknown;
    try {
      result = await verifyToken(token, this.options);
    } catch {
      throw new TokenVerificationError("invalid");
    }
    if (ClerkTokenVerifier.hasErrors(result)) {
      throw new TokenVerificationError("invalid");
    }
    const clerkUserId = ClerkTokenVerifier.readSubject(result);
    if (!clerkUserId) {
      throw new TokenVerificationError("missing_subject");
    }
    return { clerkUserId };
  }

  private static hasErrors(result: unknown): boolean {
    if (result === null || typeof result !== "object" || !("errors" in result)) {
      return false;
    }
    return Array.isArray(result.errors) && result.errors.length > 0;
  }

  private static readSubject(result: unknown): string | undefined {
    const direct = ClerkTokenVerifier.subjectOf(result);
    if (direct) {
      return direct;
    }
    if (result !== null && typeof result === "object" && "data" in result) {
      return ClerkTokenVerifier.subjectOf(result.data);
    }
    return undefined;
  }

  private static subjectOf(value: unknown): string | undefined {
    if (
      value !== null &&
      typeof value === "object" &&
      "sub" in value &&
      typeof value.sub === "string" &&
      value.sub.length > 0
    ) {
      return value.sub;
    }
    return undefined;
  }
}

class UnconfiguredTokenVerifier implements TokenVerifier {
  async verify(): Promise<VerifiedSession> {
    throw new TokenVerificationError("unconfigured");
  }
}
