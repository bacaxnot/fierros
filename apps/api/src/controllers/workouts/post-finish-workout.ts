import { zValidator } from "@hono/zod-validator";
import { container } from "@repo/core/container";
import { FinishWorkout } from "@repo/core/training/workouts/application/finish-workout.usecase";
import { DomainError } from "@repo/core/shared/domain/domain-error";
import { z } from "zod";
import { factory } from "~/lib/factory";
import {
  domainError,
  internalServerError,
  noContent,
} from "~/lib/http-response";

export const postFinishWorkoutParamsSchema = z.object({
  id: z.string().uuid(),
});

export const postFinishWorkoutHandlers = factory.createHandlers(
  zValidator("param", postFinishWorkoutParamsSchema),
  async (c) => {
    try {
      const useCase = container.get(FinishWorkout);
      const params = c.req.valid("param");
      const user = c.get("user");
      await useCase.execute({ userId: user.id, workoutId: params.id });
      return noContent(c);
    } catch (error: unknown) {
      if (error instanceof DomainError) {
        return domainError(c, error, 400);
      }
      return internalServerError(c);
    }
  },
);
