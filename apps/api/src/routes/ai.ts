import { Hono } from "hono";
import { getSystemPromptHandlers } from "~/controllers/ai/get-system-prompt";
import { putSystemPromptHandlers } from "~/controllers/ai/put-system-prompt";

export const aiApp = new Hono()
  .get("/system-prompt", ...getSystemPromptHandlers)
  .put("/system-prompt", ...putSystemPromptHandlers);

export type AiAppType = typeof aiApp;
