import type { FieldErrors, FieldValues, Resolver } from "react-hook-form";
import type { ZodType } from "zod";

function zodFlattenToRhfErrors(flattened: {
  formErrors: string[];
  fieldErrors: Record<string, string[] | undefined>;
}) {
  const errors: Record<string, { type: string; message: string }> = {};

  for (const [field, messages] of Object.entries(flattened.fieldErrors)) {
    const message = messages?.[0];
    if (!message) continue;
    errors[field] = { type: "validation", message };
  }

  const formMessage = flattened.formErrors?.[0];
  if (formMessage) {
    // RHF v7: `errors.root` é o slot recomendado para erro de formulário
    errors.root = { type: "validation", message: formMessage };
  }

  return errors;
}

/**
 * Resolver do RHF baseado em `safeParse` para garantir que um `ZodError`
 * nunca vaze como runtime error (sempre vira `formState.errors`).
 */
export function zodSafeResolver<TFieldValues extends FieldValues>(
  schema: ZodType<TFieldValues>,
): Resolver<TFieldValues> {
  return async (values) => {
    const result = schema.safeParse(values);
    if (result.success) {
      return { values: result.data, errors: {} };
    }

    return {
      values: {},
      // RHF espera FieldErrors; para nosso caso (campos planos) basta esse shape.
      errors: zodFlattenToRhfErrors(
        result.error.flatten((issue) => issue.message),
      ) as unknown as FieldErrors<TFieldValues>,
    };
  };
}
