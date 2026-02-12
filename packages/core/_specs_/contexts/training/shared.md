# Shared Value Objects

Shared value objects used across multiple modules in the training context.

---

MetricUnit vo
  values: quantity | seconds | milliseconds | kilograms | pounds | meters | kilometers | miles

MetricValue vo
  - value: number
  - unit: MetricUnit

MetricValueRange vo
  - min: MetricValue | null
  - max: MetricValue | null

---

## Design Decisions

1. **MetricUnit is extensible**: New units can be added without breaking existing data.
2. **MetricValue is always paired with a unit**: No raw numbers without context.
3. **MetricValueRange uses nullable bounds**: Either min, max, or both can be set (e.g., "at least 8 reps" = min only).
