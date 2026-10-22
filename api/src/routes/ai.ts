import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { RequestAuth } from "../auth/session-auth.js";
import { HttpError, type FieldIssue } from "../errors.js";

const pingBodySchema = z.object({
  message: z.string().min(1).max(500).optional(),
});

export class PingBody {
  static issues(error: z.ZodError): FieldIssue[] {
    return error.issues.map((issue) => ({
      path: issue.path.map((part) => String(part)).join("."),
      message: issue.message,
    }));
  }
}

declare module "fastify" {
  interface FastifyInstance {
    ai: import("../ai/ai-provider.js").AiProvider;
  }
}

export class AiRoutes {
  static async register(app: FastifyInstance): Promise<void> {
    app.post("/api/v1/ai/ping", { preHandler: app.requireAuth }, async (request) => {
      const parsed = pingBodySchema.safeParse(request.body ?? {});
      if (!parsed.success) {
        throw new HttpError(400, "validation_error", "Invalid request body", PingBody.issues(parsed.error));
      }
      const auth = RequestAuth.require(request);
      const result = await app.ai.ping({ message: parsed.data.message });
      return {
        provider: result.provider,
        model: result.model,
        reply: result.reply,
        brandSpaceId: auth.brandSpaceId,
      };
    });
  }
}
