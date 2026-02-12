import { describe, it, expect, beforeEach } from "bun:test";
import { faker } from "@faker-js/faker";
import { SearchExercisesByUser } from "../../../../../src/contexts/training/exercises/application/search-exercises-by-user.usecase";
import { ExerciseMother } from "../domain/exercise-mother";
import { MockExerciseRepository } from "../domain/mock-exercise-repository";

describe("SearchExercisesByUser", () => {
  const userId = faker.string.uuid();

  let repository: MockExerciseRepository;
  let usecase: SearchExercisesByUser;

  beforeEach(() => {
    repository = new MockExerciseRepository();
    usecase = new SearchExercisesByUser(repository);
  });

  it("returns user exercises and system exercises as primitives", async () => {
    const userExercise = ExerciseMother.create({ userId });
    const systemExercise = ExerciseMother.create({ userId: null });
    repository.returnOnSearchByUserId([userExercise, systemExercise]);

    const result = await usecase.execute({ userId });

    expect(result).toEqual([
      userExercise.toPrimitives(),
      systemExercise.toPrimitives(),
    ]);
  });

  it("returns only system exercises when user has no exercises", async () => {
    const systemExercise = ExerciseMother.create({ userId: null });
    repository.returnOnSearchByUserId([systemExercise]);

    const result = await usecase.execute({ userId });

    expect(result).toEqual([systemExercise.toPrimitives()]);
  });
});
