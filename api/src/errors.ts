import type { FastifyInstance } from "fastify";
import { ZodError } from "zod";

export type FieldIssue = {
  path: string;
  message: string;
};

export type ErrorBody = {
  statusCode: number;
  error: string;
  code: string;
  message: string;
  details?: FieldIssue[];
};

export class HttpError extends Error {
  readonly statusCode: number;
  readonly code: string;
  readonly details: FieldIssue[] | undefined;

  constructor(statusCode: number, code: string, message: string, details?: FieldIssue[]) {
    super(message);
    this.name = "HttpError";
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }

  static unauthorized(message: string): HttpError {
    return new HttpError(401, "unauthorized", message);
  }

  static forbidden(message: string): HttpError {
    return new HttpError(403, "forbidden", message);
  }

  static serviceUnavailable(message: string): HttpError {
    return new HttpError(503, "service_unavailable", message);
  }
}

export class ApiErrors {
  static install(app: FastifyInstance): void {
    app.setErrorHandler((error, request, reply) => {
      const body = ApiErrors.toBody(error);
      if (body.statusCode >= 500) {
        request.log.error({ err: error }, "request failed");
      }
      reply.status(body.statusCode).send(body);
    });

    app.setNotFoundHandler((request, reply) => {
      reply.status(404).send({
        statusCode: 404,
        error: "Not Found",
        code: "not_found",
        message: `Route ${request.method} ${request.url} not found`,
      });
    });
  }

  static toBody(error: unknown): ErrorBody {
    if (error instanceof HttpError) {
      return {
        statusCode: error.statusCode,
        error: ApiErrors.statusText(error.statusCode),
        code: error.code,
        message: error.message,
        ...(error.details ? { details: error.details } : {}),
      };
    }

    if (error instanceof ZodError) {
      return {
        statusCode: 400,
        error: "Bad Request",
        code: "validation_error",
        message: "Invalid request body",
        details: error.issues.map((issue) => ({
          path: issue.path.map((part) => String(part)).join("."),
          message: issue.message,
        })),
      };
    }

    const code = ApiErrors.codeOf(error);
    if (code === "FST_ERR_CTP_INVALID_JSON_BODY" || code === "FST_ERR_CTP_EMPTY_JSON_BODY") {
      return {
        statusCode: 400,
        error: "Bad Request",
        code: "invalid_json",
        message: "Request body must be valid JSON",
      };
    }

    const statusCode = ApiErrors.statusCodeOf(error);
    if (statusCode >= 500) {
      return {
        statusCode: 500,
        error: "Internal Server Error",
        code: "internal_error",
        message: "Internal Server Error",
      };
    }

    return {
      statusCode,
      error: ApiErrors.statusText(statusCode),
      code: code ?? "request_error",
      message: error instanceof Error && error.message ? error.message : "Request failed",
    };
  }

  private static statusText(statusCode: number): string {
    switch (statusCode) {
      case 400:
        return "Bad Request";
      case 401:
        return "Unauthorized";
      case 403:
        return "Forbidden";
      case 404:
        return "Not Found";
      case 503:
        return "Service Unavailable";
      default:
        return statusCode >= 500 ? "Internal Server Error" : "Bad Request";
    }
  }

  private static statusCodeOf(error: unknown): number {
    if (
      error !== null &&
      typeof error === "object" &&
      "statusCode" in error &&
      typeof error.statusCode === "number" &&
      error.statusCode >= 400 &&
      error.statusCode <= 599
    ) {
      return error.statusCode;
    }
    return 500;
  }

  private static codeOf(error: unknown): string | undefined {
    if (error !== null && typeof error === "object" && "code" in error && typeof error.code === "string") {
      return error.code;
    }
    return undefined;
  }
}
