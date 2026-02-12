import {
  dateFromPrimitive,
  dateToPrimitive,
} from "../../../../shared/domain/primitives";
import { WorkoutSet, type WorkoutSetPrimitives } from "./workout-set";

export type WorkoutBlockPrimitives = {
  order: number;
  notes: string | null;
  startedAt: string | null;
  finishedAt: string | null;
  sets: WorkoutSetPrimitives[];
};

export class WorkoutBlock {
  private constructor(
    private readonly order: number,
    private readonly notes: string | null,
    private readonly startedAt: Date | null,
    private readonly finishedAt: Date | null,
    private readonly sets: WorkoutSet[],
  ) {}

  static fromPrimitives(p: WorkoutBlockPrimitives): WorkoutBlock {
    return new WorkoutBlock(
      p.order,
      p.notes,
      p.startedAt ? dateFromPrimitive(p.startedAt) : null,
      p.finishedAt ? dateFromPrimitive(p.finishedAt) : null,
      p.sets.map(WorkoutSet.fromPrimitives),
    );
  }

  toPrimitives(): WorkoutBlockPrimitives {
    return {
      order: this.order,
      notes: this.notes,
      startedAt: this.startedAt ? dateToPrimitive(this.startedAt) : null,
      finishedAt: this.finishedAt ? dateToPrimitive(this.finishedAt) : null,
      sets: this.sets.map((s) => s.toPrimitives()),
    };
  }
}
