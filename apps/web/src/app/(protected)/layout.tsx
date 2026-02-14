import { redirect } from "next/navigation";
import { getSession } from "~/lib/session";
import { SettingsSheet } from "~/components/layout/settings-sheet";
import { UserMenu } from "~/components/layout/user-menu";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <>
      <div className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center">
        <div className="flex w-full max-w-3xl items-center justify-between pt-4">
          <SettingsSheet />
          <UserMenu userName={session.user.name || session.user.email} />
        </div>
      </div>
      <main className="flex min-h-screen flex-col">{children}</main>
    </>
  );
}
