import { describe, it, expect, beforeEach } from "bun:test";
import { SearchAllExerciseMetrics } from "../../../../../src/contexts/training/exercise-metrics/application/search-all-exercise-metrics.usecase";
import { ExerciseMetricMother } from "../domain/exercise-metric-mother";
import { MockExerciseMetricRepository } from "../domain/mock-exercise-metric-repository";

describe("SearchAllExerciseMetrics", () => {
  let repository: MockExerciseMetricRepository;
  let usecase: SearchAllExerciseMetrics;

  beforeEach(() => {
    repository = new MockExerciseMetricRepository();
    usecase = new SearchAllExerciseMetrics(repository);
  });

  it("returns all exercise metrics as primitives", async () => {
    const metrics = [
      ExerciseMetricMother.create(),
      ExerciseMetricMother.create(),
    ];
    repository.returnOnSearchAll(metrics);

    const result = await usecase.execute();

    expect(result).toEqual(metrics.map((m) => m.toPrimitives()));
  });

  it("returns empty list when no metrics exist", async () => {
    repository.returnOnSearchAll([]);

    const result = await usecase.execute();

    expect(result).toEqual([]);
  });
});
