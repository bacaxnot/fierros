import { InferDependencies } from "../../../../../di/autoregister";
import { Routine } from "../domain/routine";
import { RoutineRepository } from "../domain/routine-repository";
import type { RoutineBlockPrimitives } from "../domain/routine-block";

@InferDependencies()
export class CreateRoutine {
  constructor(private readonly repository: RoutineRepository) {}

  async execute(payload: {
    id: string;
    userId: string;
    name: string;
    description: string | null;
    blocks: RoutineBlockPrimitives[];
  }): Promise<void> {
    const routine = Routine.create({
      id: payload.id,
      userId: payload.userId,
      name: payload.name,
      description: payload.description,
      blocks: payload.blocks,
    });

    await this.repository.save(routine);
  }
}
