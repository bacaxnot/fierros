import type { DomainError } from "@repo/core/shared/domain/domain-error";
import type { Context } from "hono";
import type { ContentfulStatusCode } from "hono/utils/http-status";

export function domainError<StatusCode extends ContentfulStatusCode>(
  c: Context,
  error: DomainError,
  statusCode: StatusCode,
) {
  return c.json(
    {
      error: error.toPrimitives(),
    },
    statusCode,
  );
}

export function badRequest(c: Context, message: string) {
  return c.json(
    {
      error: {
        type: "InvalidRequest",
        description: message,
        data: {},
      },
    },
    400,
  );
}

export function internalServerError(c: Context) {
  return c.json(
    {
      error: {
        type: "InternalServerError",
        description: "Internal server error",
        data: {},
      },
    },
    500,
  );
}

export function created(c: Context) {
  return c.body(null, 201);
}

export function noContent(c: Context) {
  return c.body(null, 204);
}

export function json<JsonBody>(c: Context, data: JsonBody) {
  return c.json(data, 200);
}

export function unauthorized(c: Context) {
  return c.json(
    {
      error: {
        type: "Unauthorized",
        description: "Unauthorized",
        data: {},
      },
    },
    401,
  );
}
