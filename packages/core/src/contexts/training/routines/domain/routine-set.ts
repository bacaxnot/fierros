import { ExerciseId } from "../../exercises/domain/exercise-id";
import {
  RoutineSetMetric,
  type RoutineSetMetricPrimitives,
} from "./routine-set-metric";

export type RoutineSetPrimitives = {
  order: number;
  exerciseId: string;
  notes: string | null;
  restTime: number | null;
  metrics: RoutineSetMetricPrimitives[];
};

export class RoutineSet {
  private constructor(
    private readonly order: number,
    private readonly exerciseId: ExerciseId,
    private readonly notes: string | null,
    private readonly restTime: number | null,
    private readonly metrics: RoutineSetMetric[],
  ) {}

  static fromPrimitives(p: RoutineSetPrimitives): RoutineSet {
    return new RoutineSet(
      p.order,
      new ExerciseId(p.exerciseId),
      p.notes,
      p.restTime,
      p.metrics.map(RoutineSetMetric.fromPrimitives),
    );
  }

  toPrimitives(): RoutineSetPrimitives {
    return {
      order: this.order,
      exerciseId: this.exerciseId.value,
      notes: this.notes,
      restTime: this.restTime,
      metrics: this.metrics.map((m) => m.toPrimitives()),
    };
  }
}
