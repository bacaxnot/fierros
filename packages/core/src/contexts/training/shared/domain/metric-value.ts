import { MetricUnit } from "./metric-unit";

export type MetricValuePrimitives = {
  value: number;
  unit: string;
};

export class MetricValue {
  constructor(
    public readonly value: number,
    public readonly unit: MetricUnit,
  ) {}

  static fromPrimitives(p: MetricValuePrimitives): MetricValue {
    return new MetricValue(p.value, new MetricUnit(p.unit));
  }

  toPrimitives(): MetricValuePrimitives {
    return {
      value: this.value,
      unit: this.unit.value,
    };
  }

  equals(other: MetricValue): boolean {
    return this.value === other.value && this.unit.equals(other.unit);
  }
}
