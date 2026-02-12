import { container } from "@repo/core/container";
import { SearchRoutinesByUser } from "@repo/core/training/routines/application/search-routines-by-user.usecase";
import { DomainError } from "@repo/core/shared/domain/domain-error";
import { factory } from "~/lib/factory";
import { domainError, internalServerError, json } from "~/lib/http-response";

export const getRoutinesHandlers = factory.createHandlers(async (c) => {
  try {
    const useCase = container.get(SearchRoutinesByUser);
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
