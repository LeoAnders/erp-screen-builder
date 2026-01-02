# ERP Screen Builder

[![Next.js](https://img.shields.io/badge/Next.js-16.1-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-7.2-2D3748?logo=prisma)](https://www.prisma.io/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-Private-red)]()

Uma ferramenta visual focada em produtividade para a criacao de interfaces de ERP. Este projeto permite gerenciar times, projetos e arquivos de interface, garantindo integridade de dados e versionamento.

---

## Stack

| Camada               | Tecnologias                                              |
| -------------------- | -------------------------------------------------------- |
| **Frontend**         | Next.js 16, React 19, TailwindCSS 4, Shadcn/UI, Radix UI |
| **State Management** | TanStack Query (server state), Zustand (client state)    |
| **Backend**          | Next.js Route Handlers, Zod validation                   |
| **Auth**             | NextAuth v5 (Auth.js)                                    |
| **Database**         | PostgreSQL 16, Prisma ORM 7.2                            |
| **API Docs**         | OpenAPI 3.1, Scalar                                      |
| **Testing**          | Vitest                                                   |

---

## Requisitos

- Docker / Docker Compose
- Node.js 20+ (NVM recomendado)
- npm 10+

---

## Setup Rapido

### TL;DR (setup completo em um comando)

> Antes, copie os arquivos de ambiente conforme a seção **"3. Configure o ambiente"**.

```bash
cd apps/web && npm install && npm run dev:setup && npm run dev
```

### 1. Clone o repositorio

```bash
git clone <repo-url>
cd erp-screen-builder
```

### 2. Inicie a infraestrutura

```bash
npm run services:up
```

### 3. Configure o ambiente

Este repo usa **dois arquivos de ambiente**:

1. **Root**: `.env` (baseado em `env.example.txt`)
2. **App Web**: `apps/web/.env` (baseado em `apps/web/env.example`)

Copie os exemplos:

```bash
cp env.example.txt .env
cp apps/web/env.example apps/web/.env
```

> Importante: o app exige `DATABASE_URL` em runtime. Garanta que `apps/web/.env` tenha `DATABASE_URL` (pode copiar o mesmo valor do `.env` da raiz).

Exemplo mínimo para `apps/web/.env`:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/erpscreenbuilder"
AUTH_SECRET="generate-with-openssl-rand-base64-32"
```

### 4. Instale dependencias e configure o banco

```bash
cd apps/web
npm install
npm run db:migrate
npm run db:seed
```

### 5. Inicie a aplicacao

```bash
npm run dev
```

Acesse: [http://localhost:3000](http://localhost:3000)

---

## Scripts Disponiveis

### Root (monorepo)

| Script                  | Descricao                   |
| ----------------------- | --------------------------- |
| `npm run services:up`   | Inicia container PostgreSQL |
| `npm run services:stop` | Para o container            |
| `npm run services:down` | Remove o container          |

### Apps/Web

| Script               | Descricao                                  |
| -------------------- | ------------------------------------------ |
| `npm run dev`        | Inicia servidor de desenvolvimento         |
| `npm run dev:setup`  | Setup completo (services + migrate + seed) |
| `npm run build`      | Build de producao                          |
| `npm run lint`       | Executa ESLint + Prettier                  |
| `npm run test:watch` | Executa testes em watch mode               |
| `npm run db:migrate` | Executa migrations do Prisma               |
| `npm run db:seed`    | Popula banco com dados iniciais            |
| `npm run db:studio`  | Abre Prisma Studio                         |
| `npm run db:reset`   | Reset completo do banco                    |

---

## Estrutura do Projeto

```
erp-screen-builder/
├── apps/
│   └── web/
│       ├── app/                 # Rotas e layouts (App Router)
│       │   ├── not-found.tsx    # 404 global (full screen)
│       │   ├── (public)/        # Rotas publicas (sem auth)
│       │   │   └── login/       # Pagina de login
│       │   ├── (app)/           # Rotas autenticadas (providers + auth)
│       │   │   ├── layout.tsx   # Auth + Providers (sem AppShell)
│       │   │   ├── not-found.tsx# 404 autenticado (full screen, sem Sidebar/Header)
│       │   │   └── (shell)/     # AppShell (Sidebar/Header)
│       │   │       ├── dashboard/  # Pagina inicial
│       │   │       └── projects/   # Gestao de projetos e arquivos
│       │   ├── api/             # Route Handlers
│       │   │   ├── auth/        # NextAuth endpoints
│       │   │   ├── teams/       # API de times
│       │   │   ├── projects/    # API de projetos
│       │   │   └── files/       # API de arquivos
│       ├── components/          # Componentes React
│       │   ├── ui/              # Componentes base (Shadcn)
│       │   ├── layout/          # Header, containers
│       │   ├── sidebar/         # Navegacao lateral
│       │   └── projects/        # Componentes de projetos
│       ├── hooks/               # Custom hooks
│       │   ├── use-teams.ts     # Hook de times
│       │   ├── use-projects.ts  # Hook de projetos
│       │   └── use-project-files.ts
│       ├── lib/                 # Utilitarios e configs
│       │   ├── stores/          # Zustand stores
│       │   ├── openapi/         # Schemas OpenAPI
│       │   └── prisma.ts        # Cliente Prisma
│       └── prisma/              # Schema e migrations
│           ├── schema.prisma
│           ├── seed.ts
│           └── migrations/
└── docker/
    └── docker-compose.yml
```

### Not Found (404) no App Router

- O projeto usa o mecanismo oficial do Next.js App Router (`notFound()`), garantindo **status 404 real**.
- Para rotas autenticadas, o `not-found.tsx` em `apps/web/app/(app)/not-found.tsx` renderiza **full screen** sem Sidebar/Header, pois o AppShell fica em `apps/web/app/(app)/(shell)/layout.tsx`.

---

## Arquitetura

### Modelo de Dados

```
User (NextAuth)
  └── Team (1:N)
        └── Project (1:N)
              └── File (1:N)
```

### Sistema de Times

| Tipo        | Visibilidade | Permissoes                       |
| ----------- | ------------ | -------------------------------- |
| **Pessoal** | Privado      | Somente o dono pode ler/escrever |
| **Publico** | Publico      | Qualquer usuario autenticado     |

- Times pessoais sao criados automaticamente no primeiro acesso
- Partial unique index garante 1 time pessoal por usuario

### State Management

- **Server State**: TanStack Query com cache inteligente
- **Client State**: Zustand para estado local (activeTeamId, pageContext)
- **Persistencia**: Zustand persist para preferencias do usuario

---

## Dados de Seed

O seed popula o banco com dados realistas para desenvolvimento:

- **6 times publicos**: Comercial, Financeiro, RH, Entradas, Contabil Fiscal, Custos
- **~35 projetos** com descricoes
- **~150 arquivos** com templates e editores variados

---

## Documentacao da API

Acesse a documentacao interativa em:

> Dísponivel apenas em desenvolvimento

- **OpenAPI JSON**: [http://localhost:3000/docs](http://localhost:3000/docs)

---

## Desenvolvimento

### Convencoes de Codigo

- ESLint + Prettier para formatacao
- Conventional Commits em portugues
- TypeScript strict mode

### Exemplo de Commit

```bash
git commit -m "feat: implementar listagem de projetos por time"
```
