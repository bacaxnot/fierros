import type { auth } from "@repo/auth";

/**
 * Global app variables (includes null for public/auth routes)
 */
export type AppVariables = {
  user: typeof auth.$Infer.Session.user | null;
  session: typeof auth.$Infer.Session.session | null;
};

/**
 * Protected route variables (user/session guaranteed to exist)
 * Use this in controllers for protected routes
 */
export type ProtectedVariables = {
  user: typeof auth.$Infer.Session.user;
  session: typeof auth.$Infer.Session.session;
};
