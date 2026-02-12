import { ExerciseMetricId } from "./exercise-metric-id";
import { ExerciseMetricName } from "./exercise-metric-name";
import { ExerciseMetricRelation } from "./exercise-metric-relation";
import { MetricType } from "./metric-type";

export type ExerciseMetricPrimitives = {
  id: string;
  name: string;
  type: string;
  relation: string;
};

export class ExerciseMetric {
  private constructor(
    private readonly id: ExerciseMetricId,
    private readonly name: ExerciseMetricName,
    private readonly type: MetricType,
    private readonly relation: ExerciseMetricRelation,
  ) {}

  static create(params: {
    id: string;
    name: string;
    type: string;
    relation: string;
  }): ExerciseMetric {
    return new ExerciseMetric(
      new ExerciseMetricId(params.id),
      new ExerciseMetricName(params.name),
      new MetricType(params.type),
      new ExerciseMetricRelation(params.relation),
    );
  }

  static fromPrimitives(p: ExerciseMetricPrimitives): ExerciseMetric {
    return new ExerciseMetric(
      new ExerciseMetricId(p.id),
      new ExerciseMetricName(p.name),
      new MetricType(p.type),
      new ExerciseMetricRelation(p.relation),
    );
  }

  toPrimitives(): ExerciseMetricPrimitives {
    return {
      id: this.id.value,
      name: this.name.value,
      type: this.type.value,
      relation: this.relation.value,
    };
  }
}
