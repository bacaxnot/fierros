import { zValidator } from "@hono/zod-validator";
import { container } from "@repo/core/container";
import { StartWorkoutFromRoutine } from "@repo/core/training/workouts/application/start-workout-from-routine.usecase";
import { DomainError } from "@repo/core/shared/domain/domain-error";
import { z } from "zod";
import { factory } from "~/lib/factory";
import { created, domainError, internalServerError } from "~/lib/http-response";

export const putWorkoutParamsSchema = z.object({
  id: z.string().uuid(),
});

export const putWorkoutBodySchema = z.object({
  routineId: z.string().uuid(),
});

export const putWorkoutHandlers = factory.createHandlers(
  zValidator("param", putWorkoutParamsSchema),
  zValidator("json", putWorkoutBodySchema),
  async (c) => {
    try {
      const params = c.req.valid("param");
      const body = c.req.valid("json");
      const user = c.get("user");
      const useCase = container.get(StartWorkoutFromRoutine);
      await useCase.execute({
        workoutId: params.id,
        userId: user.id,
        routineId: body.routineId,
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
