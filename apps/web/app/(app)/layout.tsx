import { redirect } from "next/navigation";
import { ReactNode } from "react";

import { auth } from "@/lib/auth";
import { Sidebar } from "@/components/layout/Sidebar";

type Props = {
  children: ReactNode;
};

export default async function AppLayout({ children }: Props) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#0b0b0b] text-white">
      <Sidebar user={session.user} />
      <main className="flex-1 overflow-auto bg-[#0b0b0b] p-6">{children}</main>
    </div>
  );
}
