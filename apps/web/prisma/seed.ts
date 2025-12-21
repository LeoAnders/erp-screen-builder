import { config as loadEnv } from "dotenv";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

loadEnv();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const teams = [
    { name: "Entradas" },
    { name: "Contábil/Fiscal" },
    { name: "Comercial" },
  ];

  await prisma.team.createMany({
    data: teams,
    skipDuplicates: true,
  });
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
