import { describe, it, expect, beforeEach } from "bun:test";
import { faker } from "@faker-js/faker";
import { SearchWorkoutsByCriteria } from "../../../../../src/contexts/training/workouts/application/search-workouts-by-criteria.usecase";
import type { CriteriaPrimitives } from "../../../../../src/shared/domain/criteria/criteria";
import { WorkoutMother } from "../domain/workout-mother";
import { MockWorkoutRepository } from "../domain/mock-workout-repository";

describe("SearchWorkoutsByCriteria", () => {
  let repository: MockWorkoutRepository;
  let usecase: SearchWorkoutsByCriteria;

  beforeEach(() => {
    repository = new MockWorkoutRepository();
    usecase = new SearchWorkoutsByCriteria(repository);
  });

  it("returns workouts matching criteria as primitives", async () => {
    const userId = faker.string.uuid();
    const workouts = [
      WorkoutMother.create({ userId }),
      WorkoutMother.create({ userId }),
    ];
    repository.returnOnSearchByCriteria(workouts);

    const criteria: CriteriaPrimitives = {
      filters: [{ field: "userId", operator: "eq", value: userId }],
      orderBy: null,
      orderType: null,
      pageSize: null,
      pageNumber: null,
    };

    const result = await usecase.execute({ criteria });

    expect(result).toEqual(workouts.map((w) => w.toPrimitives()));
  });

  it("returns empty list when no workouts match criteria", async () => {
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
