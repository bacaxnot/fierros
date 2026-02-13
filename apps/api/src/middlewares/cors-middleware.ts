import { cors } from "hono/cors";

export const corsMiddleware = cors({
  origin: [process.env.WEB_URL].filter(Boolean) as string[],
  allowHeaders: ["Content-Type", "Authorization"],
  allowMethods: ["GET", "OPTIONS", "POST", "PUT", "PATCH", "DELETE"],
  credentials: true,
});
