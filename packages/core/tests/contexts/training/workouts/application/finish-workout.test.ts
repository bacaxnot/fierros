import { describe, it, expect, beforeEach } from "bun:test";
import { faker } from "@faker-js/faker";
import { FinishWorkout } from "../../../../../src/contexts/training/workouts/application/finish-workout.usecase";
import { FindWorkout } from "../../../../../src/contexts/training/workouts/domain/find-workout.usecase";
import { WorkoutDoesNotExistError } from "../../../../../src/contexts/training/workouts/domain/workout-does-not-exist-error";
import { WorkoutAlreadyFinishedError } from "../../../../../src/contexts/training/workouts/domain/workout-already-finished-error";
import { UnauthorizedResourceAccessError } from "../../../../../src/shared/domain/unauthorized-resource-access-error";
import { WorkoutMother } from "../domain/workout-mother";
import { WorkoutIdMother } from "../domain/workout-id-mother";
import { MockWorkoutRepository } from "../domain/mock-workout-repository";

describe("FinishWorkout", () => {
  const userId = faker.string.uuid();
  const otherUserId = faker.string.uuid();

  let repository: MockWorkoutRepository;
  let findWorkout: FindWorkout;
  let usecase: FinishWorkout;

  beforeEach(() => {
    repository = new MockWorkoutRepository();
    findWorkout = new FindWorkout(repository);
    usecase = new FinishWorkout(repository, findWorkout);
  });

  it("finishes an ongoing workout owned by the user", async () => {
    const workout = WorkoutMother.create({ userId });
    const workoutId = workout.toPrimitives().id;
    repository.returnOnSearch(workout);

    await usecase.execute({ userId, workoutId });

    expect(repository.save).toHaveBeenCalledTimes(1);
    const savedWorkout = repository.save.mock.calls[0][0];
    const savedPrimitives = savedWorkout.toPrimitives();
    expect(savedPrimitives.finishedAt).not.toBeNull();
  });

  it("throws WorkoutDoesNotExistError when workout does not exist", async () => {
    const workoutId = WorkoutIdMother.random().value;
    repository.returnOnSearch(null);

    await expect(
      usecase.execute({ userId, workoutId }),
    ).rejects.toThrow(WorkoutDoesNotExistError);
  });

  it("throws UnauthorizedResourceAccessError when workout does not belong to user", async () => {
    const workout = WorkoutMother.create({ userId: otherUserId });
    const workoutId = workout.toPrimitives().id;
    repository.returnOnSearch(workout);

    await expect(
      usecase.execute({ userId, workoutId }),
    ).rejects.toThrow(UnauthorizedResourceAccessError);
  });

  it("throws WorkoutAlreadyFinishedError when workout is already finished", async () => {
    const workout = WorkoutMother.createFinished({ userId });
    const workoutId = workout.toPrimitives().id;
    repository.returnOnSearch(workout);

    await expect(
      usecase.execute({ userId, workoutId }),
    ).rejects.toThrow(WorkoutAlreadyFinishedError);
  });
});
