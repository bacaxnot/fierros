import { createFactory } from "hono/factory";
import type { ProtectedVariables } from "~/types/app";

export const factory = createFactory<{ Variables: ProtectedVariables }>();
