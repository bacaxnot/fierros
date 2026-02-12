import { faker } from "@faker-js/faker";
import {
  Exercise,
  type ExercisePrimitives,
} from "../../../../../src/contexts/training/exercises/domain/exercise";
import { ExerciseIdMother } from "./exercise-id-mother";
import { TimestampMother } from "../../../../shared/domain/timestamp-mother";

export class ExerciseMother {
  static create(params?: Partial<ExercisePrimitives>): Exercise {
    const primitives: ExercisePrimitives = {
      id: ExerciseIdMother.random().value,
      name: faker.lorem.words(2),
      description: faker.lorem.sentence(),
      userId: null,
      targetMuscles: [],
      defaultMetrics: [],
      createdAt: TimestampMother.random().value,
      updatedAt: TimestampMother.random().value,
      ...params,
    };
    return Exercise.fromPrimitives(primitives);
  }
}
