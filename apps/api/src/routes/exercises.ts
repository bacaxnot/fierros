import { Hono } from "hono";
import { getExercisesHandlers } from "~/controllers/exercises/get-exercises";
import { putExerciseHandlers } from "~/controllers/exercises/put-exercise";

export const exercisesApp = new Hono()
  .get("/", ...getExercisesHandlers)
  .put("/:id", ...putExerciseHandlers);

export type ExercisesAppType = typeof exercisesApp;
