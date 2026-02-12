import { faker } from "@faker-js/faker";
import {
  ExerciseMetric,
  type ExerciseMetricPrimitives,
} from "../../../../../src/contexts/training/exercise-metrics/domain/exercise-metric";
import { ExerciseMetricIdMother } from "./exercise-metric-id-mother";

export class ExerciseMetricMother {
  static create(params?: Partial<ExerciseMetricPrimitives>): ExerciseMetric {
    const primitives: ExerciseMetricPrimitives = {
      id: ExerciseMetricIdMother.random().value,
      name: faker.lorem.word(),
      type: faker.helpers.arrayElement([
        "count",
        "weight",
        "duration",
        "distance",
      ]),
      relation: faker.helpers.arrayElement(["direct", "inverse"]),
      ...params,
    };
    return ExerciseMetric.fromPrimitives(primitives);
  }
}
