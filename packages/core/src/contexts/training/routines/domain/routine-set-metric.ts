import { ExerciseMetricId } from "../../exercise-metrics/domain/exercise-metric-id";
import {
  MetricValue,
  type MetricValuePrimitives,
} from "../../shared/domain/metric-value";
import {
  MetricValueRange,
  type MetricValueRangePrimitives,
} from "../../shared/domain/metric-value-range";

export type RoutineSetMetricPrimitives = {
  metricId: string;
  targetRange: MetricValueRangePrimitives | null;
  targetValue: MetricValuePrimitives | null;
  lastValue: MetricValuePrimitives | null;
};

export class RoutineSetMetric {
  private constructor(
    private readonly metricId: ExerciseMetricId,
    private readonly targetRange: MetricValueRange | null,
    private readonly targetValue: MetricValue | null,
    private readonly lastValue: MetricValue | null,
  ) {}

  static fromPrimitives(p: RoutineSetMetricPrimitives): RoutineSetMetric {
    return new RoutineSetMetric(
      new ExerciseMetricId(p.metricId),
      p.targetRange ? MetricValueRange.fromPrimitives(p.targetRange) : null,
      p.targetValue ? MetricValue.fromPrimitives(p.targetValue) : null,
      p.lastValue ? MetricValue.fromPrimitives(p.lastValue) : null,
    );
  }

  toPrimitives(): RoutineSetMetricPrimitives {
    return {
      metricId: this.metricId.value,
      targetRange: this.targetRange?.toPrimitives() ?? null,
      targetValue: this.targetValue?.toPrimitives() ?? null,
      lastValue: this.lastValue?.toPrimitives() ?? null,
    };
  }
}
