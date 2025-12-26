"use client";

import * as React from "react";
import type { ReactNode } from "react";
import Link from "next/link";
import {
  MoreHorizontal,
  Plus,
  Folder,
  FileText,
  LayoutGrid,
  GitBranch,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import WheelGesturesPlugin from "embla-carousel-wheel-gestures";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

type RecentItem = {
  id: string;
  title: string;
  subtitle: string;
  href: string;
  icon: ReactNode;
  color: string;
  editedBy: { name: string; avatarSrc?: string };
};

const recentlyVisited: RecentItem[] = [
  {
    id: "1",
    title: "GCO",
    subtitle: "1w ago",
    href: "/projects/gco",
    icon: <GitBranch className="h-4 w-4" />,
    color: "#2B2F36",
    editedBy: { name: "Carlos", avatarSrc: "/avatars/01.png" },
  },
  {
    id: "2",
    title: "Screen Builder de Interfaces",
    subtitle: "2d ago",
    href: "/projects/screen-builder",
    icon: <LayoutGrid className="h-4 w-4" />,
    color: "#2A2A2A",
    editedBy: { name: "Ana", avatarSrc: "/avatars/02.png" },
  },
  {
    id: "3",
    title: "@December 10, 2025 2:31 PM",
    subtitle: "2w ago",
    href: "/docs/dec-10",
    icon: <FileText className="h-4 w-4" />,
    color: "#30343B",
    editedBy: { name: "Roberto", avatarSrc: "/avatars/03.png" },
  },
  {
    id: "4",
    title: "Especificação Principal do ...",
    subtitle: "2d ago",
    href: "/docs/spec",
    icon: <FileText className="h-4 w-4" />,
    color: "#2C3138",
    editedBy: { name: "Ana", avatarSrc: "/avatars/02.png" },
  },
  {
    id: "5",
    title: "Consistem Workspace",
    subtitle: "Sep 9",
    href: "/workspaces/consistem",
    icon: <Folder className="h-4 w-4" />,
    color: "#2E2B3A",
    editedBy: { name: "Carlos", avatarSrc: "/avatars/01.png" },
  },
  {
    id: "6",
    title: "Consistem Workspace",
    subtitle: "Sep 9",
    href: "/workspaces/consistem",
    icon: <Folder className="h-4 w-4" />,
    color: "#2E2B3A",
    editedBy: { name: "Carlos", avatarSrc: "/avatars/01.png" },
  },
  {
    id: "7",
    title: "Consistem Workspace",
    subtitle: "Sep 9",
    href: "/workspaces/consistem",
    icon: <Folder className="h-4 w-4" />,
    color: "#2E2B3A",
    editedBy: { name: "Carlos", avatarSrc: "/avatars/01.png" },
  },

  {
    id: "8",
    title: "Consistem Workspace",
    subtitle: "Sep 9",
    href: "/workspaces/consistem",
    icon: <Folder className="h-4 w-4" />,
    color: "#2E2B3A",
    editedBy: { name: "Carlos", avatarSrc: "/avatars/01.png" },
  },

  {
    id: "9",
    title: "Consistem Workspace",
    subtitle: "Sep 9",
    href: "/workspaces/consistem",
    icon: <Folder className="h-4 w-4" />,
    color: "#2E2B3A",
    editedBy: { name: "Carlos", avatarSrc: "/avatars/01.png" },
  },

  {
    id: "10",
    title: "Consistem Workspace",
    subtitle: "Sep 9",
    href: "/workspaces/consistem",
    icon: <Folder className="h-4 w-4" />,
    color: "#2E2B3A",
    editedBy: { name: "Carlos", avatarSrc: "/avatars/01.png" },
  },

  {
    id: "11",
    title: "Consistem Workspace",
    subtitle: "Sep 9",
    href: "/workspaces/consistem",
    icon: <Folder className="h-4 w-4" />,
    color: "#2E2B3A",
    editedBy: { name: "Carlos", avatarSrc: "/avatars/01.png" },
  },
];

function CarouselArrows({
  api,
  canPrev,
  canNext,
}: {
  api: any;
  canPrev: boolean;
  canNext: boolean;
}) {
  return (
    <>
      {canPrev && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => api?.scrollPrev()}
          className="hidden md:flex absolute -left-1 top-1/2 -translate-y-1/2 z-20 h-9 w-9 rounded-full bg-background/80 backdrop-blur border shadow hover:bg-background"
          aria-label="Anterior"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
      )}

      {canNext && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={() => api?.scrollNext()}
          className="hidden md:flex absolute -right-1 top-1/2 -translate-y-1/2 z-20 h-9 w-9 rounded-full bg-background/80 backdrop-blur border shadow hover:bg-background"
          aria-label="Próximo"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      )}
    </>
  );
}

function RecentCard({ item }: { item: RecentItem }) {
  return (
    <Card className="group relative overflow-hidden rounded-2xl border bg-card/50 hover:bg-card transition-colors h-[180px]">
      <Link
        href={item.href}
        className="block h-full p-4 rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 select-none"
      >
        <div className="flex h-full flex-col">
          <div className="flex items-start justify-between">
            <div
              className="flex h-9 w-9 items-center justify-center rounded-xl border"
              style={{ backgroundColor: item.color }}
            >
              {item.icon}
            </div>

            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                console.log("open menu", item.id);
              }}
              aria-label="Abrir menu"
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>

          <div className="mt-3">
            <p className="text-[15px] font-semibold leading-snug line-clamp-2">
              {item.title}
            </p>
          </div>

          <div className="mt-auto pt-3">
            <div className="flex items-center gap-2 min-w-0">
              <Avatar className="h-5 w-5 shrink-0">
                {item.editedBy.avatarSrc ? (
                  <AvatarImage
                    src={item.editedBy.avatarSrc}
                    alt={item.editedBy.name}
                  />
                ) : null}
                <AvatarFallback>
                  {item.editedBy.name.slice(0, 1).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <p className="text-xs text-muted-foreground truncate">
                {item.subtitle} • {item.editedBy.name}
              </p>
            </div>
          </div>
        </div>
      </Link>
    </Card>
  );
}

export default function Page() {
  const [api, setApi] = React.useState<any>(null);
  const [canPrev, setCanPrev] = React.useState(false);
  const [canNext, setCanNext] = React.useState(false);

  const updateArrows = React.useCallback(() => {
    if (!api) return;
    setCanPrev(api.canScrollPrev());
    setCanNext(api.canScrollNext());
  }, [api]);

  React.useEffect(() => {
    if (!api) return;

    updateArrows();
    api.on("select", updateArrows);
    api.on("reInit", updateArrows);

    return () => {
      api.off("select", updateArrows);
      api.off("reInit", updateArrows);
    };
  }, [api, updateArrows]);

  return (
    <div className="w-full">
      <div className="mx-auto flex flex-col gap-8 px-8 pt-6 max-w-6xl">
        <div className="flex items-center justify-between space-y-2">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Início</h2>
            <p className="text-muted-foreground">
              Visão geral do workspace{" "}
              <span className="text-primary font-medium">
                Nome do Workspace
              </span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button>
              <Plus className="mr-2 h-4 w-4" /> Novo Projeto
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Continuar de onde parou</h3>
            <Button
              asChild
              variant="link"
              className="text-muted-foreground cursor-pointer transition-colors hover:text-primary hover:underline underline-offset-4"
            >
              <Link href="/projects">Ver todos os projetos &rarr;</Link>
            </Button>
          </div>
        </div>

        <Carousel
          className="relative w-full"
          setApi={setApi}
          opts={{
            align: "start",
            dragFree: true,
            containScroll: "trimSnaps",
          }}
          plugins={[
            WheelGesturesPlugin({
              forceWheelAxis: "x",
            }),
          ]}
        >
          {canPrev && (
            <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-14 bg-linear-to-r from-background to-transparent" />
          )}

          {canNext && (
            <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-14 bg-linear-to-l from-background to-transparent" />
          )}

          <CarouselContent className="-ml-3">
            {recentlyVisited.map((item) => (
              <CarouselItem
                key={item.id}
                className="pl-3 shrink-0 basis-[200px] sm:basis-[220px] lg:basis-[240px]"
              >
                <RecentCard item={item} />
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselArrows api={api} canPrev={canPrev} canNext={canNext} />
        </Carousel>

        <Separator className="my-4" />

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4 border-none shadow-none bg-transparent">
            <CardHeader className="px-0 pt-0">
              <CardTitle>Atividade Recente</CardTitle>
              <CardDescription>
                O que o time produziu nas últimas 24 horas.
              </CardDescription>
            </CardHeader>

            <CardContent className="px-0">
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <div className="flex items-start gap-4" key={i}>
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={`/avatars/0${i}.png`} alt="Avatar" />
                      <AvatarFallback>U{i}</AvatarFallback>
                    </Avatar>

                    <div className="grid gap-1">
                      <p className="text-sm font-medium leading-none">
                        {i === 1
                          ? "Carlos Silva"
                          : i === 2
                            ? "Ana Julia"
                            : "Roberto"}
                        <span className="text-muted-foreground font-normal">
                          {" "}
                          editou o arquivo{" "}
                        </span>
                        <span className="font-medium">User_Profile_Page</span>
                      </p>

                      <p className="text-xs text-muted-foreground">
                        {i === 1
                          ? "Há 10 minutos"
                          : i === 2
                            ? "Há 2 horas"
                            : "Há 5 horas"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
