import { InferDependencies } from "../../../../../di/autoregister";
import { UnauthorizedResourceAccessError } from "../../../../shared/domain/unauthorized-resource-access-error";
import { Routine } from "../domain/routine";
import { RoutineRepository } from "../domain/routine-repository";
import { FindRoutine } from "../domain/find-routine.usecase";
import type { RoutineBlockPrimitives } from "../domain/routine-block";

export type UpdateRoutineParams = {
  userId: string;
  routineId: string;
};

export type UpdateRoutinePayload = {
  name?: string;
  description?: string | null;
  blocks?: RoutineBlockPrimitives[];
};

@InferDependencies()
export class UpdateRoutine {
  constructor(
    private readonly repository: RoutineRepository,
    private readonly findRoutine: FindRoutine,
  ) {}

  async execute(
    params: UpdateRoutineParams,
    payload: UpdateRoutinePayload,
  ): Promise<void> {
    const routine = await this.findRoutine.execute({ id: params.routineId });

    this.ensureRoutineBelongsToUser(routine, params.routineId, params.userId);
    this.applyUpdates(routine, payload);

    await this.repository.save(routine);
  }

  private applyUpdates(
    routine: Routine,
    payload: UpdateRoutinePayload,
  ): void {
    type PayloadHandlers = {
      [K in keyof Required<UpdateRoutinePayload>]: (
        value: Exclude<UpdateRoutinePayload[K], undefined>,
      ) => void;
    };

    const handlers = {
      name: (v) => routine.updateName(v),
      description: (v) => routine.updateDescription(v),
      blocks: (v) => routine.updateBlocks(v),
    } satisfies PayloadHandlers;

    for (const [key, handler] of Object.entries(handlers)) {
      const value = payload[key as keyof UpdateRoutinePayload];
      if (value !== undefined) {
        handler(value as never);
      }
    }
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
