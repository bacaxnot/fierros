import { InferDependencies } from "../../../../../di/autoregister";
import {
  Criteria,
  type CriteriaPrimitives,
} from "../../../../shared/domain/criteria/criteria";
import type { WorkoutPrimitives } from "../domain/workout";
import { WorkoutRepository } from "../domain/workout-repository";

@InferDependencies()
export class SearchWorkoutsByCriteria {
  constructor(private readonly repository: WorkoutRepository) {}

  async execute(params: {
    criteria: CriteriaPrimitives;
  }): Promise<WorkoutPrimitives[]> {
    const criteria = Criteria.fromPrimitives(
      params.criteria.filters,
      params.criteria.orderBy,
      params.criteria.orderType,
      params.criteria.pageSize,
      params.criteria.pageNumber,
    );
    const workouts = await this.repository.searchByCriteria(criteria);
    return workouts.map((workout) => workout.toPrimitives());
  }
}
