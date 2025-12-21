## ERP Screen Builder

O **ERP Screen Builder** \u00e9 uma ferramenta para criar e manter telas de ERP com uma experi\u00eancia imersiva (inspirada em Figma), com persist\u00eancia no PostgreSQL e um editor evolutivo (Parte 1: UI + persist\u00eancia + editor skeleton).

### Stack (Parte 1)

- **Frontend**: Next.js (App Router) + React + TypeScript + TailwindCSS + shadcn/ui
- **Server state**: TanStack Query (React Query)
- **Client state (Editor)**: Zustand
- **Valida\u00e7\u00e3o**: Zod
- **DB/ORM**: PostgreSQL (Docker) + Prisma v7 (Driver Adapter `@prisma/adapter-pg`)
- **Auth**: NextAuth (Google)

### Como rodar (dev)

#### Pr\u00e9-requisitos

- **Node.js**: 20+
- **Docker**: Docker Desktop / Docker Engine

#### Passo a passo

1) **Suba o Postgres**

```bash
docker compose -f docker/docker-compose.yml up -d
```

2) **Crie o `.env`** (na raiz e em `apps/web/` quando estiver rodando comandos dentro do app)

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/erpscreenbuilder"
```

3) **Instale deps e gere o Prisma Client**

```bash
cd apps/web
npm install
npx prisma generate
```

4) **Rode o app**

```bash
npm run dev
```

Abra `http://localhost:3000`.

### Estrutura do reposit\u00f3rio

```text
/
\u251c\u2500\u2500 apps/web/                # app Next.js (UI + API + Prisma)
\u2502   \u251c\u2500\u2500 app/                 # rotas (App Router)
\u2502   \u251c\u2500\u2500 components/          # UI reutiliz\u00e1vel (shadcn/ui + features)
\u2502   \u251c\u2500\u2500 lib/                 # infra do app (ex: prisma)
\u2502   \u251c\u2500\u2500 prisma/              # schema e migrations
\u2502   \u2514\u2500\u2500 prisma.config.ts     # config Prisma v7 (datasource via env)
\u251c\u2500\u2500 docker/                  # docker-compose do Postgres
\u2514\u2500\u2500 .taskmaster/             # tasks + specs (fonte de verdade do projeto)
```

### Fluxo de desenvolvimento (Taskmaster)

- **Backlog**: `.taskmaster/tasks/tasks.json`
- **Especifica\u00e7\u00e3o**: `.taskmaster/docs/espec-de-Implementacao\u2013parte_1.md` (leia antes de codar)
- **Regra de arquitetura**: DB acessado apenas via `apps/web/lib/prisma.ts`
- **Padr\u00e3o de commits**: Conventional Commits (PT-BR) no formato `tipo: descri\u00e7\u00e3o curta no imperativo` (`feat|fix|chore|refactor|style|docs`)

### Licen\u00e7a

MIT. Veja [LICENSE](LICENSE).
