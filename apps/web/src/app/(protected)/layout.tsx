import { redirect } from "next/navigation";
import { getSession } from "~/lib/session";
import { Header } from "~/components/layout/header";

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
    <div className="flex min-h-screen flex-col">
      <Header userName={session.user.name || session.user.email} />
      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  );
}
