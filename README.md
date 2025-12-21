## ERP Screen Builder (Web)

Uma ferramenta visual focada em produtividade para a criação de interfaces de ERP. Este projeto permite gerenciar times, projetos e arquivos de interface, garantindo integridade de dados e versionamento.

Construído com **Next.js (App Router)**, **PostgreSQL** e **Prisma**, focado em performance e escalabilidade.

### Requisitos

- Docker / Docker Compose (Postgres)
- Node 20+ (NVM recomendado)

### Setup rápido

1. Inicie a Infraestrutura Suba o container do banco de dados PostgreSQL:
   ```bash
   npm run services:up
   ```
2. Configure o Ambiente Certifique-se de que o arquivo .env na pasta apps/web esteja configurado:
   ```env
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/erpscreenbuilder"
   ```
3. Instale e Configure o Banco Instale as dependências, gere o cliente do banco e popule com dados iniciais:
   ```bash
   npm install
   npm run db:setup
   ```
4. Rode a Aplicação:
   ```bash
   npm run dev
   ```
   App: http://localhost:3000

### Estrutura do Projeto

- /`app`: Rotas e layouts da aplicação (Next.js App Router).
- `/components`: Biblioteca de componentes de UI e blocos do editor visual.
- `/lib`: Configurações de infraestrutura (Prisma Client, Auth, Validadores).
- `/prisma`: Definições do esquema do banco de dados e scripts de seed.

### Detalhes Técnicos

#### Stack

- Frontend: Next.js 14+, TailwindCSS, ShadcnUI.
- Backend: Next.js Route Handlers.
- Database: PostgreSQL com Prisma ORM.

#### Banco de Dados (Schema)

O projeto utiliza um modelo relacional estrito para garantir a consistência:

- Times & Projetos: Relação protegida (Restrict) para evitar exclusão acidental de histórico.
- Arquivos: Armazenam a estrutura visual em JSONB versionado. Ao deletar um projeto, seus arquivos são removidos em cascata (Cascade).
- Dados Iniciais (Seed): O sistema já nasce com times padrão ("Squad Financeiro", "Core Team", etc) para facilitar o desenvolvimento.

### Estrutura do Projeto

```
apps/web
├── app/            # Rotas, layouts e páginas (Next.js)
├── components/     # Componentes de UI
├── lib/            # Prisma, configs globais
├── prisma/         # schema.prisma, seed.ts
├── public/         # Assets estáticos
└── eslint.config.mjs
```
