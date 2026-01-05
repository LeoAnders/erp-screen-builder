export function sanitizeName(input: string) {
  return input.trim().replace(/\s+/g, " ");
}

export function normalizeName(input: string) {
  return sanitizeName(input)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR");
}
