import { UserProfile } from "./UserProfile";

type SidebarProps = {
  user:
    | {
        name?: string | null;
        email?: string | null;
        image?: string | null;
      }
    | null
    | undefined;
};

export function Sidebar({ user }: SidebarProps) {
  return (
    <aside className="flex h-screen w-[260px] flex-col border-r border-white/5 bg-[#121212]">
      <div className="flex-1" />
      <div className="border-t border-white/5 p-2">
        <UserProfile user={user} />
      </div>
    </aside>
  );
}
