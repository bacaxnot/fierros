import { InferDependencies } from "../../../../../di/autoregister";
import {
  Criteria,
  type CriteriaPrimitives,
} from "../../../../shared/domain/criteria/criteria";
import type { RoutinePrimitives } from "../domain/routine";
import { RoutineRepository } from "../domain/routine-repository";

@InferDependencies()
export class SearchRoutinesByCriteria {
  constructor(private readonly repository: RoutineRepository) {}

  async execute(params: {
    criteria: CriteriaPrimitives;
  }): Promise<RoutinePrimitives[]> {
    const criteria = Criteria.fromPrimitives(
      params.criteria.filters,
      params.criteria.orderBy,
      params.criteria.orderType,
      params.criteria.pageSize,
      params.criteria.pageNumber,
    );
    const routines = await this.repository.searchByCriteria(criteria);
    return routines.map((routine) => routine.toPrimitives());
  }
}
