import { container } from "@repo/core/container";
import { SearchAllExerciseMetrics } from "@repo/core/training/exercise-metrics/application/search-all-exercise-metrics.usecase";
import { DomainError } from "@repo/core/shared/domain/domain-error";
import { factory } from "~/lib/factory";
import { domainError, internalServerError, json } from "~/lib/http-response";

export const getExerciseMetricsHandlers = factory.createHandlers(async (c) => {
  try {
    const useCase = container.get(SearchAllExerciseMetrics);
    const data = await useCase.execute();
    return json(c, { data });
  } catch (error: unknown) {
    if (error instanceof DomainError) {
      return domainError(c, error, 400);
    }
    return internalServerError(c);
  }
});
