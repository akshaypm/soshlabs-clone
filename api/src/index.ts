import { ApiConfig } from "./config.js";
import { EnvFiles } from "./env.js";
import { ApiServer } from "./server.js";

export class ApiProcess {
  static async main(): Promise<void> {
    EnvFiles.load();
    const config = ApiConfig.fromEnv();
    const app = await ApiServer.build({ config });

    const shutdown = async (signal: string): Promise<void> => {
      app.log.info({ signal }, "shutting down");
      await app.close();
    };

    process.once("SIGINT", () => {
      void shutdown("SIGINT").then(
        () => process.exit(0),
        () => process.exit(1),
      );
    });
    process.once("SIGTERM", () => {
      void shutdown("SIGTERM").then(
        () => process.exit(0),
        () => process.exit(1),
      );
    });

    await app.listen({ port: config.port, host: config.host });
  }
}

ApiProcess.main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : "Failed to start API";
  console.error(message);
  process.exit(1);
});
