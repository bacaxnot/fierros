import { describe, it, expect, beforeEach } from "bun:test";
import { faker } from "@faker-js/faker";
import { SearchWorkoutsByUser } from "../../../../../src/contexts/training/workouts/application/search-workouts-by-user.usecase";
import { WorkoutMother } from "../domain/workout-mother";
import { MockWorkoutRepository } from "../domain/mock-workout-repository";

describe("SearchWorkoutsByUser", () => {
  let repository: MockWorkoutRepository;
  let usecase: SearchWorkoutsByUser;

  beforeEach(() => {
    repository = new MockWorkoutRepository();
    usecase = new SearchWorkoutsByUser(repository);
  });

  it("returns all workouts for the user as primitives", async () => {
    const userId = faker.string.uuid();
    const workouts = [
      WorkoutMother.create({ userId }),
      WorkoutMother.create({ userId }),
    ];
    repository.returnOnSearchByUserId(workouts);

    const result = await usecase.execute({ userId });

    expect(result).toEqual(workouts.map((w) => w.toPrimitives()));
  });

  it("returns empty list when user has no workouts", async () => {
    repository.returnOnSearchByUserId([]);

    const result = await usecase.execute({ userId: faker.string.uuid() });

    expect(result).toEqual([]);
  });
});
