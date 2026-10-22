import type { FastifyServerOptions } from "fastify";
import type { DestinationStream } from "pino";

export class RequestLogger {
  static options(level: string, stream?: DestinationStream): FastifyServerOptions["logger"] {
    return {
      level,
      redact: {
        paths: ["req.headers.authorization", "req.headers.cookie"],
        censor: "[redacted]",
      },
      ...(stream ? { stream } : {}),
    };
  }
}
