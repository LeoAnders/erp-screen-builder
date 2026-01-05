"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createProjectSchema, type CreateProjectInput } from "@/lib/validators";
import { useTeamStore } from "@/lib/stores/team-store";
import { zodSafeResolver } from "@/lib/rhf-zod-resolver";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { toast } from "sonner";

type CreateProjectModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type ApiErrorShape = {
  error?: {
    code?: string;
    message?: string;
  };
};

export function CreateProjectModal({
  open,
  onOpenChange,
}: CreateProjectModalProps) {
  const { activeTeamId } = useTeamStore();
  const queryClient = useQueryClient();
  const router = useRouter();

  const form = useForm<CreateProjectInput>({
    resolver: zodSafeResolver(createProjectSchema),
    defaultValues: {
      name: "",
      teamId: activeTeamId ?? "",
    },
    mode: "onSubmit",
  });

  useEffect(() => {
    form.setValue("teamId", activeTeamId ?? "", {
      shouldValidate: form.formState.isSubmitted,
    });
  }, [activeTeamId, form]);

  const mutation = useMutation({
    mutationFn: async (values: CreateProjectInput) => {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw body ?? new Error("Não foi possível criar o projeto");
      }

      return res.json();
    },

    onError: (err) => {
      const e = err as ApiErrorShape;
      const code = e?.error?.code;

      // Erros de campo (acionáveis pelo usuário)
      if (code === "PROJECT_ALREADY_EXISTS") {
        form.setError("name", {
          type: "server",
          message:
            e?.error?.message ??
            "Já existe um projeto com esse nome nesse time.",
        });
        return;
      }

      if (code === "INVALID_NAME") {
        form.setError("name", {
          type: "server",
          message: e?.error?.message ?? "Nome é obrigatório",
        });
        return;
      }

      // Erros globais (não acionáveis diretamente) - exibir toast
      const globalErrors = [
        "UNAUTHORIZED",
        "FORBIDDEN",
        "INTERNAL_ERROR",
        "TEAM_NOT_FOUND",
      ] as const;

      if (
        code &&
        globalErrors.includes(code as (typeof globalErrors)[number])
      ) {
        toast.error("Erro ao criar projeto", {
          description: e?.error?.message,
        });
        return;
      }

      // Erro genérico/desconhecido
      toast.error("Não foi possível criar o projeto", {
        description:
          e?.error?.message ??
          "Tente novamente ou entre em contato com o suporte.",
      });
    },

    onSuccess: (data, values) => {
      queryClient.invalidateQueries({ queryKey: ["projects", values.teamId] });

      toast.success("Projeto criado com sucesso!", {
        description: values.name,
      });

      form.reset({
        name: "",
        teamId: values.teamId,
      });

      onOpenChange(false);

      const projectId = data?.project?.id as string | undefined;
      if (projectId) {
        router.push(`/projects/${projectId}/files`);
      }
    },
  });

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      form.reset({ name: "", teamId: activeTeamId ?? "" });
      mutation.reset();
    }
    onOpenChange(nextOpen);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!activeTeamId) {
      toast.warning("Selecione um time", {
        id: "team-missing",
        description: "Escolha um time antes de criar um projeto.",
      });
      return;
    }

    form.handleSubmit((values) => mutation.mutate(values))(e);
  };

  const submitDisabled = mutation.isPending;
  const nameError = form.formState.errors.name?.message;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="border-white/10 shadow-2xl">
        <DialogHeader>
          <DialogTitle>Novo projeto</DialogTitle>
          <DialogDescription>
            Crie um novo projeto para organizar os arquivos da equipe.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-5">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="project-name">Nome</FieldLabel>
              <FieldContent>
                <Input
                  id="project-name"
                  autoFocus
                  disabled={mutation.isPending}
                  aria-invalid={!!nameError}
                  className={[
                    "h-11",
                    nameError
                      ? "border-destructive focus-visible:ring-destructive"
                      : "",
                  ].join(" ")}
                  placeholder="Ex.: Gestão Tributária"
                  {...form.register("name", {
                    onChange: () => form.clearErrors("name"),
                  })}
                />
                <FieldError errors={[form.formState.errors.name]} />
              </FieldContent>
            </Field>
          </FieldGroup>

          <DialogFooter>
            <DialogClose asChild>
              <Button
                type="button"
                variant="outline"
                disabled={mutation.isPending}
                className={
                  mutation.isPending ? "cursor-not-allowed" : "cursor-pointer"
                }
              >
                Cancelar
              </Button>
            </DialogClose>

            <Button
              type="submit"
              disabled={submitDisabled}
              className={
                submitDisabled ? "cursor-not-allowed" : "cursor-pointer"
              }
            >
              {mutation.isPending ? "Criando..." : "Criar projeto"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
