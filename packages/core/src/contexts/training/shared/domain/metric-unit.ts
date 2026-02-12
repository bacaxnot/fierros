import { InvalidArgumentError } from "../../../../shared/domain/domain-error";

const VALID_METRIC_UNITS = [
  "quantity",
  "seconds",
  "milliseconds",
  "kilograms",
  "pounds",
  "meters",
  "kilometers",
  "miles",
] as const;

type MetricUnitValue = (typeof VALID_METRIC_UNITS)[number];

export class MetricUnit {
  public readonly value: MetricUnitValue;

  constructor(value: string) {
    this.ensureIsValid(value);
    this.value = value as MetricUnitValue;
  }

  private ensureIsValid(value: string): void {
    if (!VALID_METRIC_UNITS.includes(value as MetricUnitValue)) {
      throw new InvalidArgumentError(
        `Invalid metric unit: ${value}. Valid units: ${VALID_METRIC_UNITS.join(", ")}`,
      );
    }
  }

  equals(other: MetricUnit): boolean {
    return this.value === other.value;
  }
}
