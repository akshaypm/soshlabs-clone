import type { FastifyInstance } from "fastify";
import { ApiIdentity } from "../identity.js";

export class RootRoutes {
  static async register(app: FastifyInstance): Promise<void> {
    app.get("/", async () => {
      return {
        status: "ok",
        service: ApiIdentity.service,
        health: ApiIdentity.healthPath,
      };
    });
  }
}
