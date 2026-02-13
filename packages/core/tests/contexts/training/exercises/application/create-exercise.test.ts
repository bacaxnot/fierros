import { describe, it, expect, beforeEach } from "bun:test";
import { CreateExercise } from "../../../../../src/contexts/training/exercises/application/create-exercise.usecase";
import { ExerciseIdMother } from "../domain/exercise-id-mother";
import { MockExerciseRepository } from "../domain/mock-exercise-repository";
import { faker } from "@faker-js/faker";

describe("CreateExercise", () => {
  const userId = faker.string.uuid();

  let repository: MockExerciseRepository;
  let usecase: CreateExercise;

  beforeEach(() => {
    repository = new MockExerciseRepository();
    usecase = new CreateExercise(repository);
  });

  it("creates and persists a new exercise", async () => {
    const id = ExerciseIdMother.random().value;
    const targetMuscles = [
      { muscleGroup: "chest", involvement: "primary" },
      { muscleGroup: "triceps", involvement: "secondary" },
    ];
    const defaultMetrics = [faker.string.uuid(), faker.string.uuid()];

    await usecase.execute({
      id,
      userId,
      name: "Bench Press",
      description: "Flat barbell bench press",
      targetMuscles,
      defaultMetrics,
    });

    expect(repository.save).toHaveBeenCalledTimes(1);
    const savedExercise = repository.save.mock.calls[0][0];
    const primitives = savedExercise.toPrimitives();
    expect(primitives.id).toBe(id);
    expect(primitives.userId).toBe(userId);
    expect(primitives.name).toBe("Bench Press");
    expect(primitives.description).toBe("Flat barbell bench press");
    expect(primitives.targetMuscles).toEqual(targetMuscles);
    expect(primitives.defaultMetrics).toEqual(defaultMetrics);
  });

  it("creates exercise with null description and empty arrays", async () => {
    const id = ExerciseIdMother.random().value;

    await usecase.execute({
      id,
      userId,
      name: "Pull Up",
      description: null,
      targetMuscles: [],
      defaultMetrics: [],
    });

    expect(repository.save).toHaveBeenCalledTimes(1);
    const savedExercise = repository.save.mock.calls[0][0];
    const primitives = savedExercise.toPrimitives();
    expect(primitives.description).toBeNull();
    expect(primitives.targetMuscles).toEqual([]);
    expect(primitives.defaultMetrics).toEqual([]);
  });
});
