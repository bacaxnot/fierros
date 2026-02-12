import { container } from "@repo/core/container";
import { SearchRoutinesByCriteria } from "@repo/core/training/routines/application/search-routines-by-criteria.usecase";
import { CriteriaFromUrlConverter } from "@repo/core/shared/infrastructure/criteria/criteria-from-url-converter";
import { DomainError } from "@repo/core/shared/domain/domain-error";
import { factory } from "~/lib/factory";
import { domainError, internalServerError, json } from "~/lib/http-response";

const criteriaConverter = new CriteriaFromUrlConverter();

export const getRoutinesHandlers = factory.createHandlers(async (c) => {
  try {
    const useCase = container.get(SearchRoutinesByCriteria);
    const user = c.get("user");
    const criteria = criteriaConverter.toPrimitives(
      new URL(c.req.url).searchParams,
    );
    criteria.filters.unshift({
      field: "userId",
      operator: "eq",
      value: user.id,
    });
    const data = await useCase.execute({ criteria });
    return json(c, { data });
  } catch (error: unknown) {
    if (error instanceof DomainError) {
      return domainError(c, error, 400);
    }
    return internalServerError(c);
  }
});
