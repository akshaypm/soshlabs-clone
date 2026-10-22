import { z } from "zod";

const logLevels = ["fatal", "error", "warn", "info", "debug", "trace", "silent"] as const;

export type LogLevel = (typeof logLevels)[number];

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  PORT: z.string().optional(),
  HOST: z.string().optional(),
  LOG_LEVEL: z.enum(logLevels).optional(),
  NODE_ENV: z.string().optional(),
  CLERK_SECRET_KEY: z.string().optional(),
  CLERK_JWT_KEY: z.string().optional(),
  CLERK_AUTHORIZED_PARTIES: z.string().optional(),
  ANTHROPIC_API_KEY: z.string().optional(),
  ANTHROPIC_MODEL: z.string().optional(),
});

export class ApiConfig {
  readonly databaseUrl: string;
  readonly port: number;
  readonly host: string;
  readonly logLevel: LogLevel;
  readonly nodeEnv: string;
  readonly clerkSecretKey: string | undefined;
  readonly clerkJwtKey: string | undefined;
  readonly clerkAuthorizedParties: readonly string[];
  readonly anthropicApiKey: string | undefined;
  readonly anthropicModel: string | undefined;

  private constructor(values: {
    databaseUrl: string;
    port: number;
    host: string;
    logLevel: LogLevel;
    nodeEnv: string;
    clerkSecretKey: string | undefined;
    clerkJwtKey: string | undefined;
    clerkAuthorizedParties: readonly string[];
    anthropicApiKey: string | undefined;
    anthropicModel: string | undefined;
  }) {
    this.databaseUrl = values.databaseUrl;
    this.port = values.port;
    this.host = values.host;
    this.logLevel = values.logLevel;
    this.nodeEnv = values.nodeEnv;
    this.clerkSecretKey = values.clerkSecretKey;
    this.clerkJwtKey = values.clerkJwtKey;
    this.clerkAuthorizedParties = values.clerkAuthorizedParties;
    this.anthropicApiKey = values.anthropicApiKey;
    this.anthropicModel = values.anthropicModel;
  }

  static fromEnv(env: NodeJS.ProcessEnv = process.env): ApiConfig {
    const parsed = envSchema.safeParse({
      DATABASE_URL: ApiConfig.blankToUndefined(env.DATABASE_URL),
      PORT: ApiConfig.blankToUndefined(env.PORT),
      HOST: ApiConfig.blankToUndefined(env.HOST),
      LOG_LEVEL: ApiConfig.blankToUndefined(env.LOG_LEVEL),
      NODE_ENV: ApiConfig.blankToUndefined(env.NODE_ENV),
      CLERK_SECRET_KEY: ApiConfig.blankToUndefined(env.CLERK_SECRET_KEY),
      CLERK_JWT_KEY: ApiConfig.blankToUndefined(env.CLERK_JWT_KEY),
      CLERK_AUTHORIZED_PARTIES: ApiConfig.blankToUndefined(env.CLERK_AUTHORIZED_PARTIES),
      ANTHROPIC_API_KEY: ApiConfig.blankToUndefined(env.ANTHROPIC_API_KEY),
      ANTHROPIC_MODEL: ApiConfig.blankToUndefined(env.ANTHROPIC_MODEL),
    });
    if (!parsed.success) {
      const fields = parsed.error.issues.map((issue) => issue.path.join(".")).join(", ");
      throw new Error(`Invalid environment: ${fields || "configuration"}`);
    }

    const databaseUrl = parsed.data.DATABASE_URL;
    if (!databaseUrl.startsWith("postgres://") && !databaseUrl.startsWith("postgresql://")) {
      throw new Error("Invalid environment: DATABASE_URL");
    }

    const anthropicApiKey = parsed.data.ANTHROPIC_API_KEY;
    const anthropicModel = parsed.data.ANTHROPIC_MODEL;
    if (anthropicApiKey && !anthropicModel) {
      throw new Error("Invalid environment: ANTHROPIC_MODEL");
    }

    const nodeEnv = parsed.data.NODE_ENV ?? "development";
    const clerkSecretKey = parsed.data.CLERK_SECRET_KEY;
    const clerkJwtKey = parsed.data.CLERK_JWT_KEY;
    ApiConfig.requireProductionSecrets({
      nodeEnv,
      anthropicApiKey,
      clerkSecretKey,
      clerkJwtKey,
    });

    return new ApiConfig({
      databaseUrl,
      port: ApiConfig.portFrom(parsed.data.PORT),
      host: parsed.data.HOST ?? "0.0.0.0",
      logLevel: parsed.data.LOG_LEVEL ?? "info",
      nodeEnv,
      clerkSecretKey,
      clerkJwtKey,
      clerkAuthorizedParties: ApiConfig.partiesFrom(parsed.data.CLERK_AUTHORIZED_PARTIES),
      anthropicApiKey,
      anthropicModel,
    });
  }

  private static requireProductionSecrets(values: {
    nodeEnv: string;
    anthropicApiKey: string | undefined;
    clerkSecretKey: string | undefined;
    clerkJwtKey: string | undefined;
  }): void {
    if (values.nodeEnv !== "production") {
      return;
    }
    const missing: string[] = [];
    if (!values.anthropicApiKey) {
      missing.push("ANTHROPIC_API_KEY");
    }
    if (!values.clerkSecretKey && !values.clerkJwtKey) {
      missing.push("CLERK_SECRET_KEY or CLERK_JWT_KEY");
    }
    if (missing.length > 0) {
      throw new Error(`Refusing to start in production. Missing ${missing.join(", ")}`);
    }
  }

  private static blankToUndefined(value: string | undefined): string | undefined {
    if (value === undefined) {
      return undefined;
    }
    const trimmed = value.trim();
    return trimmed.length === 0 ? undefined : trimmed;
  }

  private static portFrom(value: string | undefined): number {
    if (value === undefined) {
      return 4000;
    }
    const port = Number(value);
    if (!Number.isInteger(port) || port < 1 || port > 65535) {
      throw new Error("Invalid environment: PORT");
    }
    return port;
  }

  private static partiesFrom(value: string | undefined): string[] {
    if (value === undefined) {
      return [];
    }
    return value
      .split(",")
      .map((part) => part.trim())
      .filter((part) => part.length > 0);
  }
}
