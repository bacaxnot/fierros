"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "~/lib/auth-client";
import { Button } from "~/components/ui/button";

export function Header({ userName }: { userName: string }) {
  const router = useRouter();

  async function handleSignOut() {
    await authClient.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="border-b">
      <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/chat" className="font-semibold">
            Fierros
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <Link href="/chat" className="text-muted-foreground hover:text-foreground">
              Chat
            </Link>
            <Link href="/settings" className="text-muted-foreground hover:text-foreground">
              Settings
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">{userName}</span>
          <Button variant="ghost" size="sm" onClick={handleSignOut}>
            Sign Out
          </Button>
        </div>
      </div>
    </header>
  );
}
