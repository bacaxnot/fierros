import { InvalidArgumentError } from "../../../../shared/domain/domain-error";

const VALID_METRIC_TYPES = ["count", "weight", "duration", "distance"] as const;

type MetricTypeValue = (typeof VALID_METRIC_TYPES)[number];

export class MetricType {
  public readonly value: MetricTypeValue;

  constructor(value: string) {
    this.ensureIsValid(value);
    this.value = value as MetricTypeValue;
  }

  private ensureIsValid(value: string): void {
    if (!VALID_METRIC_TYPES.includes(value as MetricTypeValue)) {
      throw new InvalidArgumentError(
        `Invalid metric type: ${value}. Valid types: ${VALID_METRIC_TYPES.join(", ")}`,
      );
    }
  }

  equals(other: MetricType): boolean {
    return this.value === other.value;
  }
}
