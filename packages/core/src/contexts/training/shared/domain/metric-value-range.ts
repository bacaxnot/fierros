import { MetricValue, type MetricValuePrimitives } from "./metric-value";

export type MetricValueRangePrimitives = {
  min: MetricValuePrimitives | null;
  max: MetricValuePrimitives | null;
};

export class MetricValueRange {
  constructor(
    public readonly min: MetricValue | null,
    public readonly max: MetricValue | null,
  ) {}

  static fromPrimitives(p: MetricValueRangePrimitives): MetricValueRange {
    return new MetricValueRange(
      p.min ? MetricValue.fromPrimitives(p.min) : null,
      p.max ? MetricValue.fromPrimitives(p.max) : null,
    );
  }

  toPrimitives(): MetricValueRangePrimitives {
    return {
      min: this.min?.toPrimitives() ?? null,
      max: this.max?.toPrimitives() ?? null,
    };
  }

  equals(other: MetricValueRange): boolean {
    const minEquals =
      this.min === null && other.min === null
        ? true
        : this.min !== null && other.min !== null
          ? this.min.equals(other.min)
          : false;

    const maxEquals =
      this.max === null && other.max === null
        ? true
        : this.max !== null && other.max !== null
          ? this.max.equals(other.max)
          : false;

    return minEquals && maxEquals;
  }
}
