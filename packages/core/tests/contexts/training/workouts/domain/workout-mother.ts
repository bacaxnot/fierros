import { faker } from "@faker-js/faker";
import {
  Workout,
  type WorkoutPrimitives,
} from "../../../../../src/contexts/training/workouts/domain/workout";
import type { WorkoutBlockPrimitives } from "../../../../../src/contexts/training/workouts/domain/workout-block";
import { WorkoutIdMother } from "./workout-id-mother";
import { TimestampMother } from "../../../../shared/domain/timestamp-mother";

export class WorkoutMother {
  static create(params?: Partial<WorkoutPrimitives>): Workout {
    const primitives: WorkoutPrimitives = {
      id: WorkoutIdMother.random().value,
      userId: WorkoutIdMother.random().value,
      routineId: null,
      name: faker.lorem.words(3),
      startedAt: TimestampMother.random().value,
      finishedAt: null,
      notes: null,
      blocks: [],
      createdAt: TimestampMother.random().value,
      updatedAt: TimestampMother.random().value,
      ...params,
    };
    return Workout.fromPrimitives(primitives);
  }

  static createFinished(params?: Partial<WorkoutPrimitives>): Workout {
    return WorkoutMother.create({
      finishedAt: TimestampMother.random().value,
      ...params,
    });
  }

  static createWithBlocks(
    blocks: WorkoutBlockPrimitives[],
    params?: Partial<WorkoutPrimitives>,
  ): Workout {
    return WorkoutMother.create({
      blocks,
      ...params,
    });
  }
}
