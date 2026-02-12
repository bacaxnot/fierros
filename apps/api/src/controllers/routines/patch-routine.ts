import { zValidator } from "@hono/zod-validator";
import { container } from "@repo/core/container";
import { UpdateRoutine } from "@repo/core/training/routines/application/update-routine.usecase";
import { DomainError } from "@repo/core/shared/domain/domain-error";
import { z } from "zod";
import { factory } from "~/lib/factory";
import {
  domainError,
  internalServerError,
  noContent,
} from "~/lib/http-response";
import { routineBlockSchema } from "./schemas";

export const patchRoutineParamsSchema = z.object({
  id: z.string().uuid(),
});

export const patchRoutineBodySchema = z.object({
  name: z.string().optional(),
  description: z.string().nullable().optional(),
  blocks: z.array(routineBlockSchema).optional(),
});

export const patchRoutineHandlers = factory.createHandlers(
  zValidator("param", patchRoutineParamsSchema),
  zValidator("json", patchRoutineBodySchema),
  async (c) => {
    try {
      const useCase = container.get(UpdateRoutine);
      const params = c.req.valid("param");
      const body = c.req.valid("json");
      const user = c.get("user");
      await useCase.execute({ userId: user.id, routineId: params.id }, body);
      return noContent(c);
    } catch (error: unknown) {
      if (error instanceof DomainError) {
        return domainError(c, error, 400);
      }
      return internalServerError(c);
    }
  },
);
