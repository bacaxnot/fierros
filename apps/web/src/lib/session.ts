import { headers } from "next/headers";
import { api } from "./api";

export type SessionUser = {
  id: string;
  email: string;
  name: string | null;
};

export type Session = {
  user: SessionUser;
  session: {
    id: string;
    token: string;
    expiresAt: string;
  };
};

export async function getSession(): Promise<Session | null> {
  try {
    const headersList = await headers();
    const cookie = headersList.get("cookie");
    if (!cookie) return null;

    const res = await api("/auth/get-session", {
      headers: { cookie },
    });

    if (!res.ok) return null;

    const data = await res.json();
    if (!data?.user) return null;

    return data as Session;
  } catch {
    return null;
  }
}
