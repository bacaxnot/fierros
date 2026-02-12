import { ExerciseMetricId } from "../../exercise-metrics/domain/exercise-metric-id";
import {
  MetricValue,
  type MetricValuePrimitives,
} from "../../shared/domain/metric-value";
import {
  MetricValueRange,
  type MetricValueRangePrimitives,
} from "../../shared/domain/metric-value-range";

export type WorkoutSetMetricPrimitives = {
  metricId: string;
  value: MetricValuePrimitives;
  targetRange: MetricValueRangePrimitives | null;
  targetValue: MetricValuePrimitives | null;
};

export class WorkoutSetMetric {
  private constructor(
    private readonly metricId: ExerciseMetricId,
    private readonly value: MetricValue,
    private readonly targetRange: MetricValueRange | null,
    private readonly targetValue: MetricValue | null,
  ) {}

  static fromPrimitives(p: WorkoutSetMetricPrimitives): WorkoutSetMetric {
    return new WorkoutSetMetric(
      new ExerciseMetricId(p.metricId),
      MetricValue.fromPrimitives(p.value),
      p.targetRange ? MetricValueRange.fromPrimitives(p.targetRange) : null,
      p.targetValue ? MetricValue.fromPrimitives(p.targetValue) : null,
    );
  }

  toPrimitives(): WorkoutSetMetricPrimitives {
    return {
      metricId: this.metricId.value,
      value: this.value.toPrimitives(),
      targetRange: this.targetRange?.toPrimitives() ?? null,
      targetValue: this.targetValue?.toPrimitives() ?? null,
    };
  }
}
