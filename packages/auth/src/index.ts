import { generateUuid } from "@repo/core/utils";
import { db } from "@repo/db";
import {
  authAccount,
  authSession,
  authUser,
  authVerification,
} from "@repo/db/schema";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

export const auth = betterAuth({
  basePath: "/auth",
  trustedOrigins: [process.env.WEB_URL].filter(Boolean) as string[],
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: authUser,
      session: authSession,
      account: authAccount,
      verification: authVerification,
    },
  }),
  emailAndPassword: {
    enabled: true,
  },
  advanced: {
    database: {
      generateId: () => generateUuid(),
    },
  },
});

export type AuthAPI = typeof auth;
