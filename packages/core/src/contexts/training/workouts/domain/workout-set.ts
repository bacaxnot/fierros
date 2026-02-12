import {
  dateFromPrimitive,
  dateToPrimitive,
} from "../../../../shared/domain/primitives";
import { ExerciseId } from "../../exercises/domain/exercise-id";
import {
  WorkoutSetMetric,
  type WorkoutSetMetricPrimitives,
} from "./workout-set-metric";

export type WorkoutSetPrimitives = {
  order: number;
  exerciseId: string;
  notes: string | null;
  startedAt: string | null;
  finishedAt: string | null;
  restTime: number | null;
  metrics: WorkoutSetMetricPrimitives[];
};

export class WorkoutSet {
  private constructor(
    private readonly order: number,
    private readonly exerciseId: ExerciseId,
    private readonly notes: string | null,
    private readonly startedAt: Date | null,
    private readonly finishedAt: Date | null,
    private readonly restTime: number | null,
    private readonly metrics: WorkoutSetMetric[],
  ) {}

  static fromPrimitives(p: WorkoutSetPrimitives): WorkoutSet {
    return new WorkoutSet(
      p.order,
      new ExerciseId(p.exerciseId),
      p.notes,
      p.startedAt ? dateFromPrimitive(p.startedAt) : null,
      p.finishedAt ? dateFromPrimitive(p.finishedAt) : null,
      p.restTime,
      p.metrics.map(WorkoutSetMetric.fromPrimitives),
    );
  }

  toPrimitives(): WorkoutSetPrimitives {
    return {
      order: this.order,
      exerciseId: this.exerciseId.value,
      notes: this.notes,
      startedAt: this.startedAt ? dateToPrimitive(this.startedAt) : null,
      finishedAt: this.finishedAt ? dateToPrimitive(this.finishedAt) : null,
      restTime: this.restTime,
      metrics: this.metrics.map((m) => m.toPrimitives()),
    };
  }
}
