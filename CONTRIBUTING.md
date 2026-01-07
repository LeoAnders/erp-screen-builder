# Contribuindo com o ERP Screen Builder

Este guia descreve o fluxo esperado para manter consistência e qualidade.

---

## 1) Organização de branches

Crie branches com prefixos padronizados:

- `feat/` para novas funcionalidades
- `fix/` para correções de bugs
- `refactor/` para melhorias sem mudança de comportamento
- `chore/` para ajustes de tooling/config

Exemplo:

```
feat/modal-criar-time
```

---

## 2) Padrão de commits

Use Conventional Commits em PT-BR:

```
feat: criar modal de times publicos
fix: corrigir validacao de nome do time
```

---

## 3) Checklist antes do PR

Dentro de `apps/web`:

```
npm run lint
npm run test:watch
```

---

## 4) Padrões do projeto (obrigatórios)

### Estado e UI

- **Server state**: TanStack Query
- **Client state**: Zustand (evite usar para dados de servidor)
- **UI**: shadcn/ui em `apps/web/components/ui`

### API (Route Handlers)

- Use `jsonError()` e o formato `{ error: { code, message, details? } }`
- Para validação, prefira `parseBody()` / `parseQuery()` com Zod
- Para rotas autenticadas por cookie que alteram estado, aplique `requireSameOrigin()`

### Prisma / Banco

- Prisma apenas via `apps/web/lib/prisma.ts`
- Migrations devem ser pequenas e revisáveis

---

## 5) Mudanças em API e OpenAPI

Se alterar endpoints, payloads ou response shape:

- Atualize o contrato em `apps/web/lib/openapi/index.ts`
- Ajuste schemas em `apps/web/lib/openapi/schemas.ts` quando necessário

---

## 6) Seed e dados locais

Se alterar o schema de times/projetos/arquivos:

- Atualize o seed em `apps/web/prisma/seed.ts`
- Garanta que o seed continue idempotente
