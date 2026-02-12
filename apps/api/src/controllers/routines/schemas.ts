import { z } from "zod";

export const metricValueSchema = z.object({
  value: z.number(),
  unit: z.string(),
});

export const metricValueRangeSchema = z.object({
  min: metricValueSchema.nullable(),
  max: metricValueSchema.nullable(),
});

export const routineSetMetricSchema = z.object({
  metricId: z.string().uuid(),
  targetRange: metricValueRangeSchema.nullable(),
  targetValue: metricValueSchema.nullable(),
  lastValue: metricValueSchema.nullable(),
});

export const routineSetSchema = z.object({
  order: z.number(),
  exerciseId: z.string().uuid(),
  notes: z.string().nullable(),
  restTime: z.number().nullable(),
  metrics: z.array(routineSetMetricSchema),
});

export const routineBlockSchema = z.object({
  order: z.number(),
  notes: z.string().nullable(),
  defaultRestTime: z.number().nullable(),
  sets: z.array(routineSetSchema),
});
