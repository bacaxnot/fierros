import { describe, it, expect, beforeEach } from "bun:test";
import { faker } from "@faker-js/faker";
import { SearchExercisesByCriteria } from "../../../../../src/contexts/training/exercises/application/search-exercises-by-criteria.usecase";
import type { CriteriaPrimitives } from "../../../../../src/shared/domain/criteria/criteria";
import { ExerciseMother } from "../domain/exercise-mother";
import { MockExerciseRepository } from "../domain/mock-exercise-repository";

describe("SearchExercisesByCriteria", () => {
  let repository: MockExerciseRepository;
  let usecase: SearchExercisesByCriteria;

  beforeEach(() => {
    repository = new MockExerciseRepository();
    usecase = new SearchExercisesByCriteria(repository);
  });

  it("returns exercises matching criteria as primitives", async () => {
    const userId = faker.string.uuid();
    const exercises = [
      ExerciseMother.create({ userId }),
      ExerciseMother.create({ userId }),
    ];
    repository.returnOnSearchByCriteria(exercises);

    const criteria: CriteriaPrimitives = {
      filters: [{ field: "userId", operator: "eq", value: userId }],
      orderBy: null,
      orderType: null,
      pageSize: null,
      pageNumber: null,
    };

    const result = await usecase.execute({ criteria });

    expect(result).toEqual(exercises.map((e) => e.toPrimitives()));
  });

  it("returns empty list when no exercises match criteria", async () => {
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
