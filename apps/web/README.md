## ERP Screen Builder (Web)

Esta é a aplicação frontend principal do **ERP Screen Builder**, construída com Next.js 15.

### Desenvolvimento

Para rodar o app localmente:

1. **Suba o Postgres** (na raiz do repo):

```bash
docker compose -f docker/docker-compose.yml up -d
```

2. **Configure o `.env`** (este app espera `DATABASE_URL`):

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/erpscreenbuilder"
```

3. **Instale deps e gere o Prisma Client**:

```bash
npm install
npx prisma generate
```

4. **Inicie o servidor**:

```bash
npm run dev
```

O app estará disponível em [http://localhost:3000](http://localhost:3000).

### Scripts úteis

- **Dev**: `npm run dev`
- **Lint**: `npm run lint`
- **Prisma**:
  - `npx prisma validate`
  - `npx prisma generate`
  - `npx prisma migrate dev`

### Design System

- **Tema:** Dark Mode por padrão.
- **Cores Base:** Canvas `#1e1e1e`, Painéis `#2c2c2c`.
- **Componentes:** Baseados em shadcn/ui.

### Organização

- `app/`: Rotas, layouts e páginas.
- `components/`: Componentes React (UI, layouts de seção, editor).
- `lib/`: Configurações globais (Prisma, Auth, Query Client).
- `hooks/`: Hooks customizados para lógica reutilizável.

### Notas (Prisma v7)

- O Prisma v7 usa **Driver Adapter** com Postgres; a conex\u00e3o \u00e9 criada via `pg` (`Pool`) e injetada no client em `lib/prisma.ts`.
- A configura\u00e7\u00e3o de datasource/migrations roda via `prisma.config.ts` (carrega `.env`).
