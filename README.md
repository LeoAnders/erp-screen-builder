# ERP Screen Builder

[![Next.js](https://img.shields.io/badge/Next.js-16.1-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Prisma](https://img.shields.io/badge/Prisma-7.2-2D3748?logo=prisma)](https://www.prisma.io/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-Private-red)]()

Uma ferramenta visual focada em produtividade para a criação de interfaces de ERP. Este projeto permite gerenciar times, projetos e arquivos de interface, garantindo integridade de dados e versionamento.

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

## Setup Rápido

### TL;DR (setup completo em um comando)

> Primeiro configure os arquivos `.env` conforme a seção **"3. Configure o ambiente"**.

```bash
npm run setup && cd apps/web && npm run dev
```

### 1. Clone o repositório

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

### 4. Instale dependências e configure o banco

```bash
cd apps/web
npm install
npm run db:migrate
npm run db:seed
```

Ou use o setup completo no root:

```bash
npm run setup
```

### 5. Inicie a aplicação

```bash
npm run dev
```

Acesse: [http://localhost:3000](http://localhost:3000)

---

## Comandos mais usados

### Desenvolvimento

| Script               | Descrição                                  |
| -------------------- | ------------------------------------------ |
| `npm run setup`      | Setup completo (app + DB)                  |
| `npm run dev`        | Inicia servidor de desenvolvimento         |
| `npm run dev:setup`  | Setup completo (services + migrate + seed) |

### Qualidade

| Script               | Descrição                         |
| -------------------- | --------------------------------- |
| `npm run lint`       | Executa ESLint + Prettier         |
| `npm run test:watch` | Executa testes em watch mode      |

### Banco

| Script               | Descrição                                  |
| -------------------- | ------------------------------------------ |
| `npm run db:migrate` | Executa migrations do Prisma               |
| `npm run db:seed`    | Popula banco com dados iniciais            |
| `npm run db:reset`   | Reset completo do banco                    |
| `npm run healthcheck`| Verifica `DATABASE_URL` e conexão com o DB |

---

## Estrutura do Projeto

```
erp-screen-builder/
├── apps/
│   └── web/
│       ├── app/                 # Rotas e layouts (App Router)
│       │   ├── not-found.tsx    # 404 global (full screen)
│       │   ├── (public)/        # Rotas públicas (sem auth)
│       │   │   └── login/       # Página de login
│       │   ├── (app)/           # Rotas autenticadas (providers + auth)
│       │   │   ├── layout.tsx   # Auth + Providers (sem AppShell)
│       │   │   ├── not-found.tsx# 404 autenticado (full screen, sem Sidebar/Header)
│       │   │   └── (shell)/     # AppShell (Sidebar/Header)
│       │   │       ├── dashboard/  # Pagina inicial
│       │   │       └── projects/   # Gestão de projetos e arquivos
│       │   ├── api/             # Route Handlers
│       │   │   ├── auth/        # NextAuth endpoints
│       │   │   ├── teams/       # API de times
│       │   │   ├── projects/    # API de projetos
│       │   │   └── files/       # API de arquivos
│       ├── components/          # Componentes React
│       │   ├── ui/              # Componentes base (Shadcn)
│       │   ├── layout/          # Header, containers
│       │   ├── sidebar/         # Navegação lateral
│       │   └── projects/        # Componentes de projetos
│       ├── hooks/               # Custom hooks
│       │   ├── use-teams.ts     # Hook de times
│       │   ├── use-projects.ts  # Hook de projetos
│       │   └── use-project-files.ts
│       ├── lib/                 # Utilitários e configs
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

## Decisões de Arquitetura

### Not Found (404) no App Router

- O projeto usa o mecanismo oficial do Next.js App Router (`notFound()`), garantindo status 404 real em rotas inválidas.

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

- **Times pessoais** são criados automaticamente no primeiro acesso
- **Times públicos** são globais por `nameNormalized` (sem vínculo de owner)
- **Unicidade por escopo** é garantida via `scopeKey + nameNormalized`

### State Management

- **Server State**: TanStack Query com cache inteligente
- **Client State**: Zustand para estado local (activeTeamId, pageContext)
- **Persistencia**: Zustand persist para preferencias do usuario

---

## Dados de Seed

O seed popula o banco com dados realistas para desenvolvimento:

- **6 times públicos**: Comercial, Financeiro, RH, Entradas, Contábil Fiscal, Custos
- **~35 projetos** com nomes representativos
- **~150 arquivos** com templates e editores variados

---

## Documentação da API

Acesse a documentacao interativa em:

> Dísponivel apenas em desenvolvimento

- **UI (Scalar)**: [http://localhost:3000/docs](http://localhost:3000/docs)
- **OpenAPI JSON**: [http://localhost:3000/api/openapi](http://localhost:3000/api/openapi)

---

## Healthcheck

Para validar `DATABASE_URL` e conexão com o banco:

```bash
cd apps/web
npm run healthcheck
```

---

## Contribuição

Este projeto possui padrões de código, commits e fluxo de PR definidos.

- Consulte o guia completo em `CONTRIBUTING.md`
