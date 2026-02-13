import { zValidator } from "@hono/zod-validator";
import { container } from "@repo/core/container";
import { DomainError } from "@repo/core/shared/domain/domain-error";
import { CreateExercise } from "@repo/core/training/exercises/application/create-exercise.usecase";
import { z } from "zod";
import { factory } from "~/lib/factory";
import { created, domainError, internalServerError } from "~/lib/http-response";

const targetMuscleSchema = z.object({
  muscleGroup: z.string(),
  involvement: z.string(),
});

export const putExerciseParamsSchema = z.object({
  id: z.string().uuid(),
});

export const putExerciseBodySchema = z.object({
  name: z.string(),
  description: z.string().nullable(),
  targetMuscles: z.array(targetMuscleSchema),
  defaultMetrics: z.array(z.string().uuid()),
});

export const putExerciseHandlers = factory.createHandlers(
  zValidator("param", putExerciseParamsSchema),
  zValidator("json", putExerciseBodySchema),
  async (c) => {
    try {
      const params = c.req.valid("param");
      const body = c.req.valid("json");
      const user = c.get("user");
      const useCase = container.get(CreateExercise);
      await useCase.execute({
        id: params.id,
        userId: user.id,
        name: body.name,
        description: body.description,
        targetMuscles: body.targetMuscles,
        defaultMetrics: body.defaultMetrics,
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
