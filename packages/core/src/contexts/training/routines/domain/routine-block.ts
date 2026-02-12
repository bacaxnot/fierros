import { RoutineSet, type RoutineSetPrimitives } from "./routine-set";

export type RoutineBlockPrimitives = {
  order: number;
  notes: string | null;
  defaultRestTime: number | null;
  sets: RoutineSetPrimitives[];
};

export class RoutineBlock {
  private constructor(
    private readonly order: number,
    private readonly notes: string | null,
    private readonly defaultRestTime: number | null,
    private readonly sets: RoutineSet[],
  ) {}

  static fromPrimitives(p: RoutineBlockPrimitives): RoutineBlock {
    return new RoutineBlock(
      p.order,
      p.notes,
      p.defaultRestTime,
      p.sets.map(RoutineSet.fromPrimitives),
    );
  }

  toPrimitives(): RoutineBlockPrimitives {
    return {
      order: this.order,
      notes: this.notes,
      defaultRestTime: this.defaultRestTime,
      sets: this.sets.map((s) => s.toPrimitives()),
    };
  }
}
