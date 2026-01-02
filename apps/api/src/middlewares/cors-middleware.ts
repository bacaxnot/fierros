import { cors } from "hono/cors";

export const corsMiddleware = cors({
  origin: "*",
  allowHeaders: ["Content-Type", "Authorization"],
  allowMethods: ["GET", "OPTIONS", "PUT", "PATCH", "DELETE"],
  credentials: true,
});
