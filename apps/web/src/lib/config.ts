const env = {
  apiUrl: process.env.API_URL,
  betterAuthUrl: process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
} as const;

type ConfigKey = keyof typeof env;

export function config(key: ConfigKey): string {
  const value = env[key];
  if (!value) {
    throw new Error(`Environment variable for "${key}" is not set`);
  }
  return value;
}
