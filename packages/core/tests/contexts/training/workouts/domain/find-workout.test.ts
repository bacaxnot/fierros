import { describe, it, expect, beforeEach } from "bun:test";
import { FindWorkout } from "../../../../../src/contexts/training/workouts/domain/find-workout.usecase";
import { WorkoutDoesNotExistError } from "../../../../../src/contexts/training/workouts/domain/workout-does-not-exist-error";
import { WorkoutMother } from "./workout-mother";
import { WorkoutIdMother } from "./workout-id-mother";
import { MockWorkoutRepository } from "./mock-workout-repository";

describe("FindWorkout", () => {
  let repository: MockWorkoutRepository;
  let usecase: FindWorkout;

  beforeEach(() => {
    repository = new MockWorkoutRepository();
    usecase = new FindWorkout(repository);
  });

  it("returns the workout when it exists", async () => {
    const workout = WorkoutMother.create();
    const workoutId = workout.toPrimitives().id;
    repository.returnOnSearch(workout);

    const result = await usecase.execute({ id: workoutId });

    expect(result.toPrimitives()).toEqual(workout.toPrimitives());
  });

  it("throws WorkoutDoesNotExistError when workout does not exist", async () => {
    const workoutId = WorkoutIdMother.random().value;
    repository.returnOnSearch(null);

    await expect(usecase.execute({ id: workoutId })).rejects.toThrow(
      WorkoutDoesNotExistError,
    );
  });
});
