import { Hono } from "hono";
import { getExerciseMetricsHandlers } from "~/controllers/exercise-metrics/get-exercise-metrics";

export const exerciseMetricsApp = new Hono().get(
  "/",
  ...getExerciseMetricsHandlers,
);

export type ExerciseMetricsAppType = typeof exerciseMetricsApp;
