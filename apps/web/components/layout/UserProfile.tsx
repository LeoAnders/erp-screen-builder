"use client";

import { signOut } from "next-auth/react";
import { ChevronsUpDown, LogOut } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type UserProps = {
  user:
    | {
        name?: string | null;
        email?: string | null;
        image?: string | null;
      }
    | null
    | undefined;
};

const getInitials = (name?: string | null, email?: string | null) => {
  const source = name || email || "";
  if (!source) return "U";
  const [first = "", second = ""] = source.split(" ");
  return `${first.charAt(0)}${second?.charAt(0) || ""}`.toUpperCase();
};

export function UserProfile({ user }: UserProps) {
  const displayName = user?.name ?? "Usuário";
  const displayEmail = user?.email ?? "";

  const handleSignOut = async () => {
    await signOut({ redirectTo: "/login" });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="group flex w-full items-center gap-2 rounded-md p-1.5 text-left transition-colors hover:bg-white/5 data-[state=open]:bg-white/10 outline-none focus-visible:ring-1 focus-visible:ring-white/20">
          <Avatar className="h-6 w-6 rounded-full border border-white/10 bg-[#1e1e1e]">
            <AvatarImage src={user?.image ?? undefined} alt={displayName} />
            <AvatarFallback className="text-[9px] font-medium text-white bg-[#1e1e1e]">
              {getInitials(user?.name, user?.email)}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-1 items-center justify-between overflow-hidden">
            <span className="truncate pl-1 text-[13px] font-medium text-white/90 group-hover:text-white">
              {displayName}
            </span>
            <ChevronsUpDown className="size-3 text-white/40 transition-colors group-hover:text-white/70" />
          </div>
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        className="w-[240px] rounded-md border border-white/10 bg-[#222222] p-1 text-white shadow-2xl"
        align="start"
        side="top"
        sideOffset={8}
      >
        <div className="flex items-center gap-2 px-2 py-2 mb-1">
          <Avatar className="h-8 w-8 rounded-full border border-white/10">
            <AvatarImage
              src={user?.image ?? undefined}
              className="opacity-80"
            />
            <AvatarFallback className="text-xs font-medium text-white/80 bg-black/20">
              {getInitials(user?.name, user?.email)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-[13px] font-medium text-white leading-tight">
              {displayName}
            </span>
            <span className="text-[11px] text-white/50 leading-tight truncate w-[160px]">
              {displayEmail}
            </span>
          </div>
        </div>

        <DropdownMenuSeparator className="bg-white/10 my-1" />

        <DropdownMenuItem
          onClick={handleSignOut}
          className="flex cursor-default items-center gap-2 rounded px-2 py-1.5 text-[13px] text-white/80 hover:bg-red-500/20 hover:text-red-200 focus:bg-red-500/20 focus:text-red-200 outline-none transition-colors"
        >
          <LogOut className="size-3.5 stroke-[1.5]" />
          <span>Sair</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
