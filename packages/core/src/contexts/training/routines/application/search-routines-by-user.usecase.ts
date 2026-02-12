import { InferDependencies } from "../../../../../di/autoregister";
import { UserId } from "../../users/domain/user-id";
import type { RoutinePrimitives } from "../domain/routine";
import { RoutineRepository } from "../domain/routine-repository";

@InferDependencies()
export class SearchRoutinesByUser {
  constructor(private readonly repository: RoutineRepository) {}

  async execute(params: { userId: string }): Promise<RoutinePrimitives[]> {
    const userId = new UserId(params.userId);
    const routines = await this.repository.searchByUserId(userId);
    return routines.map((routine) => routine.toPrimitives());
  }
}
