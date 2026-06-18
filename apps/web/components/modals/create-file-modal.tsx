"use client";

import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createFileSchema, type CreateFileInput } from "@/lib/validators";
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

type CreateFileModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projectId: string;
};

type ApiErrorShape = {
  error?: {
    code?: string;
    message?: string;
  };
};

export function CreateFileModal({
  open,
  onOpenChange,
  projectId,
}: CreateFileModalProps) {
  const queryClient = useQueryClient();

  const form = useForm<CreateFileInput>({
    resolver: zodSafeResolver(createFileSchema),
    defaultValues: {
      name: "",
      projectId,
      template: "blank",
    },
    mode: "onSubmit",
  });

  const mutation = useMutation({
    mutationFn: async (values: CreateFileInput) => {
      const res = await fetch("/api/files", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw body ?? new Error("Não foi possível criar o arquivo");
      }

      return res.json();
    },

    onError: (err) => {
      const e = err as ApiErrorShape;
      const code = e?.error?.code;

      if (code === "FILE_ALREADY_EXISTS") {
        form.setError("name", {
          type: "server",
          message:
            e?.error?.message ??
            "Já existe um arquivo com esse nome neste projeto.",
        });
        return;
      }

      if (code === "INVALID_NAME") {
        form.setError("name", {
          type: "server",
          message: e?.error?.message ?? "Nome inválido",
        });
        return;
      }

      toast.error("Erro ao criar arquivo", {
        description:
          e?.error?.message ??
          "Tente novamente ou entre em contato com o suporte.",
      });
    },

    onSuccess: (_data, values) => {
      queryClient.invalidateQueries({
        queryKey: ["project-files", values.projectId],
      });

      toast.success("Arquivo criado com sucesso!");

      form.reset({ name: "", projectId, template: "blank" });
      onOpenChange(false);
    },
  });

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen) {
      form.reset({ name: "", projectId, template: "blank" });
      mutation.reset();
    }
    onOpenChange(nextOpen);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    form.handleSubmit((values) => mutation.mutate(values))(e);
  };

  const submitDisabled = mutation.isPending;
  const nameError = form.formState.errors.name?.message;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="border-white/10 shadow-2xl">
        <DialogHeader>
          <DialogTitle>Novo arquivo</DialogTitle>
          <DialogDescription>
            Crie um novo arquivo vazio para este projeto.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-5">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="file-name">Nome</FieldLabel>
              <FieldContent>
                <Input
                  id="file-name"
                  autoFocus
                  disabled={mutation.isPending}
                  aria-invalid={!!nameError}
                  maxLength={100}
                  className={[
                    "h-11",
                    nameError
                      ? "border-destructive focus-visible:ring-destructive"
                      : "",
                  ].join(" ")}
                  placeholder="Ex.: Tela de Login"
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
              {mutation.isPending ? "Criando..." : "Criar arquivo"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
