import { InferDependencies } from "../../../../../di/autoregister";
import {
  Criteria,
  type CriteriaPrimitives,
} from "../../../../shared/domain/criteria/criteria";
import type { ExercisePrimitives } from "../domain/exercise";
import { ExerciseRepository } from "../domain/exercise-repository";

@InferDependencies()
export class SearchExercisesByCriteria {
  constructor(private readonly repository: ExerciseRepository) {}

  async execute(params: {
    criteria: CriteriaPrimitives;
  }): Promise<ExercisePrimitives[]> {
    const criteria = Criteria.fromPrimitives(
      params.criteria.filters,
      params.criteria.orderBy,
      params.criteria.orderType,
      params.criteria.pageSize,
      params.criteria.pageNumber,
    );
    const exercises = await this.repository.searchByCriteria(criteria);
    return exercises.map((exercise) => exercise.toPrimitives());
  }
}
