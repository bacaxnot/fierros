import { Hono } from "hono";
import { deleteWorkoutHandlers } from "~/controllers/workouts/delete-workout";
import { getWorkoutsHandlers } from "~/controllers/workouts/get-workouts";
import { postFinishWorkoutHandlers } from "~/controllers/workouts/post-finish-workout";
import { putWorkoutHandlers } from "~/controllers/workouts/put-workout";

export const workoutsApp = new Hono()
  .get("/", ...getWorkoutsHandlers)
  .put("/:id", ...putWorkoutHandlers)
  .post("/:id/finish", ...postFinishWorkoutHandlers)
  .delete("/:id", ...deleteWorkoutHandlers);

export type WorkoutsAppType = typeof workoutsApp;
