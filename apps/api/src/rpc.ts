import { hc } from "hono/client";
import type { app } from ".";

export type AppType = typeof app;

export const client = hc<AppType>("http://localhost:8000");
