import { zValidator } from "@hono/zod-validator";
import { container } from "@repo/core/container";
import { CreateRoutine } from "@repo/core/training/routines/application/create-routine.usecase";
import { DomainError } from "@repo/core/shared/domain/domain-error";
import { z } from "zod";
import { factory } from "~/lib/factory";
import { created, domainError, internalServerError } from "~/lib/http-response";
import { routineBlockSchema } from "./schemas";

export const putRoutineParamsSchema = z.object({
  id: z.string().uuid(),
});

export const putRoutineBodySchema = z.object({
  name: z.string(),
  description: z.string().nullable(),
  blocks: z.array(routineBlockSchema),
});

export const putRoutineHandlers = factory.createHandlers(
  zValidator("param", putRoutineParamsSchema),
  zValidator("json", putRoutineBodySchema),
  async (c) => {
    try {
      const params = c.req.valid("param");
      const body = c.req.valid("json");
      const user = c.get("user");
      const useCase = container.get(CreateRoutine);
      await useCase.execute({
        id: params.id,
        userId: user.id,
        name: body.name,
        description: body.description,
        blocks: body.blocks,
      });
      return created(c);
    } catch (error: unknown) {
      if (error instanceof DomainError) {
        return domainError(c, error, 400);
      }
      return internalServerError(c);
    }
  },
);
