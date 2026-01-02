"use client";

import * as React from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/page-header";
import { FileCard } from "@/components/projects/file-card";
import type { ProjectFile } from "@/components/projects/project-types";

const recentFiles: ProjectFile[] = [
  {
    id: "f1a2b3c4-d5e6-7890-abcd-ef1234567890",
    name: "GCO",
    projectId: "p1a2b3c4-d5e6-7890-abcd-ef1234567890",
    createdAt: "2024-12-20T10:00:00Z",
    updatedAt: "2024-12-20T14:30:00Z",
    editedBy: { name: "Carlos", avatarSrc: "/avatars/01.png" },
  },
  {
    id: "f2b3c4d5-e6f7-8901-bcde-f12345678901",
    name: "Screen Builder de Interfaces",
    projectId: "p1a2b3c4-d5e6-7890-abcd-ef1234567890",
    createdAt: "2024-12-23T09:00:00Z",
    updatedAt: "2024-12-25T16:45:00Z",
    editedBy: { name: "Ana", avatarSrc: "/avatars/02.png" },
  },
  {
    id: "f3c4d5e6-f7a8-9012-cdef-123456789012",
    name: "@December 10, 2025 2:31 PM",
    projectId: "p2b3c4d5-e6f7-8901-bcde-f12345678901",
    createdAt: "2024-12-10T14:31:00Z",
    updatedAt: "2024-12-13T11:20:00Z",
    editedBy: { name: "Roberto", avatarSrc: "/avatars/03.png" },
  },
  {
    id: "f4d5e6f7-a8b9-0123-def0-234567890123",
    name: "Especificação Principal do Projeto",
    projectId: "p2b3c4d5-e6f7-8901-bcde-f12345678901",
    createdAt: "2024-12-22T08:00:00Z",
    updatedAt: "2024-12-25T10:15:00Z",
    editedBy: { name: "Ana", avatarSrc: "/avatars/02.png" },
  },
  {
    id: "f5e6f7a8-b9c0-1234-ef01-345678901234",
    name: "Configurações do Sistema",
    projectId: "p3c4d5e6-f7a8-9012-cdef-123456789012",
    createdAt: "2024-09-09T10:00:00Z",
    updatedAt: "2024-09-09T15:30:00Z",
    editedBy: { name: "Carlos", avatarSrc: "/avatars/01.png" },
  },
  {
    id: "f6f7a8b9-c0d1-2345-f012-456789012345",
    name: "Layout Principal",
    projectId: "p3c4d5e6-f7a8-9012-cdef-123456789012",
    createdAt: "2024-09-08T14:00:00Z",
    updatedAt: "2024-09-09T09:45:00Z",
    editedBy: { name: "Carlos", avatarSrc: "/avatars/01.png" },
  },
  {
    id: "f7a8b9c0-d1e2-3456-0123-567890123456",
    name: "Dashboard Overview",
    projectId: "p4d5e6f7-a8b9-0123-def0-234567890123",
    createdAt: "2024-09-07T11:00:00Z",
    updatedAt: "2024-09-09T08:20:00Z",
    editedBy: { name: "Carlos", avatarSrc: "/avatars/01.png" },
  },
  {
    id: "f8b9c0d1-e2f3-4567-1234-678901234567",
    name: "Formulário de Cadastro",
    projectId: "p4d5e6f7-a8b9-0123-def0-234567890123",
    createdAt: "2024-09-06T16:00:00Z",
    updatedAt: "2024-09-09T12:10:00Z",
    editedBy: { name: "Carlos", avatarSrc: "/avatars/01.png" },
  },
  {
    id: "f9c0d1e2-f3a4-5678-2345-789012345678",
    name: "Relatórios Financeiros",
    projectId: "p5e6f7a8-b9c0-1234-ef01-345678901234",
    createdAt: "2024-09-05T09:00:00Z",
    updatedAt: "2024-09-09T14:55:00Z",
    editedBy: { name: "Carlos", avatarSrc: "/avatars/01.png" },
  },
  {
    id: "f0d1e2f3-a4b5-6789-3456-890123456789",
    name: "Gestão de Usuários",
    projectId: "p5e6f7a8-b9c0-1234-ef01-345678901234",
    createdAt: "2024-09-04T13:00:00Z",
    updatedAt: "2024-09-09T16:40:00Z",
    editedBy: { name: "Carlos", avatarSrc: "/avatars/01.png" },
  },
  {
    id: "f1e2f3a4-b5c6-7890-4567-901234567890",
    name: "Painel de Controle",
    projectId: "p6f7a8b9-c0d1-2345-f012-456789012345",
    createdAt: "2024-09-03T10:30:00Z",
    updatedAt: "2024-09-09T11:25:00Z",
    editedBy: { name: "Carlos", avatarSrc: "/avatars/01.png" },
  },
];

function CarouselArrows({
  api,
  canPrev,
  canNext,
}: {
  api: CarouselApi | null;
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

export default function Page() {
  const [api, setApi] = React.useState<CarouselApi | null>(null);
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
    <PageContainer className="flex h-full flex-col gap-6">
      <PageHeader title="Início" description="Visão geral do workspace" />

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
          {recentFiles.map((file) => (
            <CarouselItem
              key={file.id}
              className="pl-3 shrink-0 basis-[200px] sm:basis-[220px] lg:basis-[240px]"
            >
              <FileCard file={file} />
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
              Últimas atualizações feitas pelo time.
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
    </PageContainer>
  );
}
