import Fastify, { type FastifyInstance, type FastifyServerOptions } from "fastify";
import { AiProvider } from "./ai/ai-provider.js";
import { ClerkTokenVerifier, type TokenVerifier } from "./auth/token-verifier.js";
import { SessionAuth } from "./auth/session-auth.js";
import { ApiConfig } from "./config.js";
import { PrismaDatabase, type DatabasePing } from "./db.js";
import { ApiErrors } from "./errors.js";
import { RequestLogger } from "./logging.js";
import { AiRoutes } from "./routes/ai.js";
import { HealthRoutes } from "./routes/health.js";
import { RootRoutes } from "./routes/root.js";
import type { PrismaClient } from "./generated/prisma/client.js";

export type BuildOptions = {
  config?: ApiConfig;
  prisma?: PrismaClient;
  verifier?: TokenVerifier;
  ai?: AiProvider;
  database?: DatabasePing;
  logger?: FastifyServerOptions["logger"];
};

export class ApiServer {
  static async build(options: BuildOptions = {}): Promise<FastifyInstance> {
    const config = options.config ?? ApiConfig.fromEnv();
    const prisma = options.prisma ?? PrismaDatabase.connect(config.databaseUrl);
    const ownsPrisma = options.prisma === undefined;
    const verifier = options.verifier ?? ClerkTokenVerifier.fromConfig(config);
    const ai = options.ai ?? AiProvider.create(config);
    const database = options.database ?? new PrismaDatabase(prisma);

    const app = Fastify({
      logger: options.logger ?? RequestLogger.options(config.logLevel),
    });

    app.decorate("ai", ai);
    ApiErrors.install(app);
    SessionAuth.install(app, { verifier, prisma });
    await RootRoutes.register(app);
    await HealthRoutes.register(app, database);
    await AiRoutes.register(app);

    app.addHook("onClose", async () => {
      if (ownsPrisma) {
        await prisma.$disconnect();
      }
    });

    return app;
  }
}
