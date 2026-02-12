import { container } from "@repo/core/container";
import { SearchExercisesByUser } from "@repo/core/training/exercises/application/search-exercises-by-user.usecase";
import { DomainError } from "@repo/core/shared/domain/domain-error";
import { factory } from "~/lib/factory";
import { domainError, internalServerError, json } from "~/lib/http-response";

export const getExercisesHandlers = factory.createHandlers(async (c) => {
  try {
    const useCase = container.get(SearchExercisesByUser);
    const user = c.get("user");
    const data = await useCase.execute({ userId: user.id });
    return json(c, { data });
  } catch (error: unknown) {
    if (error instanceof DomainError) {
      return domainError(c, error, 400);
    }
    return internalServerError(c);
  }
});
