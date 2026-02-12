import { Hono } from "hono";
import { getExercisesHandlers } from "~/controllers/exercises/get-exercises";

export const exercisesApp = new Hono().get("/", ...getExercisesHandlers);

export type ExercisesAppType = typeof exercisesApp;
