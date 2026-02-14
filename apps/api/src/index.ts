import "reflect-metadata";

import { auth } from "@repo/auth";
import { Scalar } from "@scalar/hono-api-reference";
import { Hono } from "hono";
import { authMiddleware } from "~/middlewares/auth-middleware";
import { corsMiddleware } from "~/middlewares/cors-middleware";
import { exerciseMetricsApp } from "~/routes/exercise-metrics";
import { exercisesApp } from "~/routes/exercises";
import { routinesApp } from "~/routes/routines";
import { workoutsApp } from "~/routes/workouts";
import { aiApp } from "~/routes/ai";
import type { AppVariables } from "~/types/app";

export const app = new Hono<{ Variables: AppVariables }>()
  // CORS - must be before routes
  .use("*", corsMiddleware)
  // Auth middleware - adds user/session to context and enforces authentication
  .use("*", authMiddleware)
  // Better Auth routes (handles /auth/* including sign-up, sign-in, etc)
  .on(["POST", "GET", "OPTIONS"], "/auth/*", (c) => {
    return auth.handler(c.req.raw);
  })
  // API Documentation
  .get("/openapi.json", async (c) => {
    const file = Bun.file("./openapi.json");
    return c.json(await file.json());
  })
  .get("/docs", Scalar({ url: "/openapi.json" }))
  // Health check
  .get("/health", (c) => c.json({ status: "ok" }))
  // Domain routes
  .route("/exercises", exercisesApp)
  .route("/exercise-metrics", exerciseMetricsApp)
  .route("/routines", routinesApp)
  .route("/workouts", workoutsApp)
  .route("/ai", aiApp);

export default {
  port: 8000,
  fetch: app.fetch,
};
