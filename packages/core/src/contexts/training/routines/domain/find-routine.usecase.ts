import { InferDependencies } from "../../../../../di/autoregister";
import type { Routine } from "./routine";
import { RoutineDoesNotExistError } from "./routine-does-not-exist-error";
import { RoutineId } from "./routine-id";
import { RoutineRepository } from "./routine-repository";

@InferDependencies()
export class FindRoutine {
  constructor(private readonly repository: RoutineRepository) {}

  async execute(params: { id: string }): Promise<Routine> {
    const routineId = new RoutineId(params.id);
    const routine = await this.repository.search(routineId);

    if (!routine) {
      throw new RoutineDoesNotExistError(params.id);
    }

    return routine;
  }
}
