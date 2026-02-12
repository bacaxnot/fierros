import { InferDependencies } from "../../../../../di/autoregister";
import { UnauthorizedResourceAccessError } from "../../../../shared/domain/unauthorized-resource-access-error";
import { Routine } from "../domain/routine";
import { RoutineId } from "../domain/routine-id";
import { RoutineRepository } from "../domain/routine-repository";
import { FindRoutine } from "../domain/find-routine.usecase";

@InferDependencies()
export class DeleteRoutine {
  constructor(
    private readonly repository: RoutineRepository,
    private readonly findRoutine: FindRoutine,
  ) {}

  async execute(params: { userId: string; routineId: string }): Promise<void> {
    const routine = await this.findRoutine.execute({ id: params.routineId });

    this.ensureRoutineBelongsToUser(routine, params.routineId, params.userId);

    await this.repository.delete(new RoutineId(params.routineId));
  }

  private ensureRoutineBelongsToUser(
    routine: Routine,
    routineId: string,
    userId: string,
  ): void {
    if (routine.belongsTo(userId)) return;
    throw new UnauthorizedResourceAccessError(Routine, routineId);
  }
}
