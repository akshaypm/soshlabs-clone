import type { FastifyInstance } from "fastify";
import type { DatabasePing } from "../db.js";
import { HttpError } from "../errors.js";
import { ApiIdentity } from "../identity.js";

export class HealthRoutes {
  static async register(app: FastifyInstance, database: DatabasePing): Promise<void> {
    app.get("/api/v1/health", async (request) => {
      try {
        await database.ping();
      } catch (error) {
        request.log.error({ err: error }, "database ping failed");
        throw HttpError.serviceUnavailable("Database unreachable");
      }
      return {
        status: "ok",
        service: ApiIdentity.service,
        database: "ok",
      };
    });
  }
}
