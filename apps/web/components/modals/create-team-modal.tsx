"use client";

import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createTeamSchema, type CreateTeamInput } from "@/lib/validators";
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
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

type CreateTeamModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: (teamId: string) => void;
};

type ApiErrorShape = {
  error?: {
    code?: string;
    message?: string;
    details?: Record<string, unknown>;
  };
};

export function CreateTeamModal({
  open,
  onOpenChange,
  onCreated,
}: CreateTeamModalProps) {
  const queryClient = useQueryClient();

  const form = useForm<CreateTeamInput>({
    resolver: zodSafeResolver(createTeamSchema),
    defaultValues: {
      name: "",
    },
    mode: "onSubmit",
  });

  const mutation = useMutation({
    mutationFn: async (values: CreateTeamInput) => {
      const res = await fetch("/api/teams", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw body ?? new Error("Não foi possível criar o time");
      }

      return res.json();
    },

    onError: (err) => {
      const e = err as ApiErrorShape;
      const code = e?.error?.code;
      const field =
        e?.error?.details && (e.error.details as { field?: string }).field;

      if (
        code === "TEAM_ALREADY_EXISTS" ||
        code === "INVALID_NAME" ||
        field === "name"
      ) {
        form.setError("name", {
          type: "server",
          message:
            e?.error?.message ??
            "Já existe um time com este nome neste escopo.",
        });
        return;
      }

      const globalErrors = ["UNAUTHORIZED", "FORBIDDEN", "INTERNAL_ERROR"];

      if (code && globalErrors.includes(code)) {
        toast.error("Erro ao criar time", {
          description: e?.error?.message,
        });
        return;
      }

      toast.error("Não foi possível criar o time", {
        description:
          e?.error?.message ??
          "Tente novamente ou entre em contato com o suporte.",
      });
    },

    onSuccess: (data, values) => {
      queryClient.invalidateQueries({ queryKey: ["teams"] });

      toast.success("Time criado com sucesso!", {
        description: values.name,
      });

      form.reset({ name: "" });
      onOpenChange(false);

      const teamId = data?.team?.id as string | undefined;
      if (teamId) onCreated(teamId);
    },
  });

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      form.reset({ name: "" });
      mutation.reset();
    }
    onOpenChange(nextOpen);
  };

  const submitDisabled = mutation.isPending;
  const nameError = form.formState.errors.name?.message;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="border-white/10 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span>Criar um Novo Time</span>
            <Badge variant="success">Público</Badge>
          </DialogTitle>

          <DialogDescription>
            Crie um time para colaborar com outras pessoas na sua organização.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit((values) => mutation.mutate(values))}
          className="space-y-5"
        >
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="team-name">Nome</FieldLabel>
              <FieldContent>
                <Input
                  id="team-name"
                  autoFocus
                  disabled={mutation.isPending}
                  aria-invalid={!!nameError}
                  maxLength={50}
                  className={[
                    "h-11",
                    nameError
                      ? "border-destructive focus-visible:ring-destructive"
                      : "",
                  ].join(" ")}
                  placeholder="Ex: Squad Contábil Fiscal"
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
              {mutation.isPending ? "Criando..." : "Criar time"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
