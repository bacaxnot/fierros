import { zValidator } from "@hono/zod-validator";
import { container } from "@repo/core/container";
import { DeleteRoutine } from "@repo/core/training/routines/application/delete-routine.usecase";
import { DomainError } from "@repo/core/shared/domain/domain-error";
import { z } from "zod";
import { factory } from "~/lib/factory";
import {
  domainError,
  internalServerError,
  noContent,
} from "~/lib/http-response";

export const deleteRoutineParamsSchema = z.object({
  id: z.string().uuid(),
});

export const deleteRoutineHandlers = factory.createHandlers(
  zValidator("param", deleteRoutineParamsSchema),
  async (c) => {
    try {
      const useCase = container.get(DeleteRoutine);
      const params = c.req.valid("param");
      const user = c.get("user");
      await useCase.execute({ userId: user.id, routineId: params.id });
      return noContent(c);
    } catch (error: unknown) {
      if (error instanceof DomainError) {
        return domainError(c, error, 400);
      }
      return internalServerError(c);
    }
  },
);
