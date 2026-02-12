import { Hono } from "hono";
import { deleteRoutineHandlers } from "~/controllers/routines/delete-routine";
import { getRoutinesHandlers } from "~/controllers/routines/get-routines";
import { patchRoutineHandlers } from "~/controllers/routines/patch-routine";
import { putRoutineHandlers } from "~/controllers/routines/put-routine";

export const routinesApp = new Hono()
  .get("/", ...getRoutinesHandlers)
  .put("/:id", ...putRoutineHandlers)
  .patch("/:id", ...patchRoutineHandlers)
  .delete("/:id", ...deleteRoutineHandlers);

export type RoutinesAppType = typeof routinesApp;
