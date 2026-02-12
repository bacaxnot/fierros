import { describe, it, expect, beforeEach } from "bun:test";
import { faker } from "@faker-js/faker";
import { SearchRoutinesByCriteria } from "../../../../../src/contexts/training/routines/application/search-routines-by-criteria.usecase";
import type { CriteriaPrimitives } from "../../../../../src/shared/domain/criteria/criteria";
import { RoutineMother } from "../domain/routine-mother";
import { MockRoutineRepository } from "../domain/mock-routine-repository";

describe("SearchRoutinesByCriteria", () => {
  let repository: MockRoutineRepository;
  let usecase: SearchRoutinesByCriteria;

  beforeEach(() => {
    repository = new MockRoutineRepository();
    usecase = new SearchRoutinesByCriteria(repository);
  });

  it("returns routines matching criteria as primitives", async () => {
    const userId = faker.string.uuid();
    const routines = [
      RoutineMother.create({ userId }),
      RoutineMother.create({ userId }),
    ];
    repository.returnOnSearchByCriteria(routines);

    const criteria: CriteriaPrimitives = {
      filters: [{ field: "userId", operator: "eq", value: userId }],
      orderBy: null,
      orderType: null,
      pageSize: null,
      pageNumber: null,
    };

    const result = await usecase.execute({ criteria });

    expect(result).toEqual(routines.map((r) => r.toPrimitives()));
  });

  it("returns empty list when no routines match criteria", async () => {
    repository.returnOnSearchByCriteria([]);

    const criteria: CriteriaPrimitives = {
      filters: [{ field: "userId", operator: "eq", value: faker.string.uuid() }],
      orderBy: null,
      orderType: null,
      pageSize: null,
      pageNumber: null,
    };

    const result = await usecase.execute({ criteria });

    expect(result).toEqual([]);
  });
});
