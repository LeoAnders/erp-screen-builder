import { config as loadEnv } from "dotenv";
import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { getSchemaDefaults } from "../lib/schemaDefaults";
import { EDITORS, TEAM_SEEDS } from "./seed/data";

loadEnv();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const now = new Date();
  const defaultSchema = getSchemaDefaults("blank");

  for (const [teamIndex, teamSeed] of TEAM_SEEDS.entries()) {
    await prisma.$transaction(async (tx) => {
      const existingTeam = await tx.team.findFirst({
        where: { name: teamSeed.name },
      });

      const team =
        existingTeam ??
        (await tx.team.create({
          data: {
            name: teamSeed.name,
            visibility: "public",
            type: "normal",
            isFavorite: teamSeed.isFavorite ?? teamIndex % 2 === 0,
          },
        }));

      for (const [projectIndex, projectSeed] of teamSeed.projects.entries()) {
        const createdAt = buildProjectCreatedAt(now, teamIndex, projectIndex);
        const updatedAt = buildProjectUpdatedAt(now, teamIndex, projectIndex);

        const existingProject = await tx.project.findFirst({
          where: { teamId: team.id, name: projectSeed.name },
        });

        const project =
          existingProject ??
          (await tx.project.create({
            data: {
              teamId: team.id,
              name: projectSeed.name,
              description:
                projectSeed.description ??
                `Projeto ${projectSeed.name.toLowerCase()} do time ${team.name}.`,
              createdAt,
              updatedAt,
            },
          }));

        const fileLabels = projectSeed.files;

        const files = fileLabels.map((label, fileIndex) => {
          const editor = EDITORS[(projectIndex + fileIndex) % EDITORS.length];
          const fileUpdatedAt = buildFileUpdatedAt(
            now,
            teamIndex,
            projectIndex,
            fileIndex,
          );

          return {
            projectId: project.id,
            name: label,
            template: "blank" as const,
            schemaJson: defaultSchema,
            schemaVersion: defaultSchema.schemaVersion,
            updatedBy: editor,
            createdAt: new Date(fileUpdatedAt.getTime() - 2 * 60 * 60 * 1000),
            updatedAt: fileUpdatedAt,
            revision: 1 + (fileIndex % 3),
          };
        });

        await tx.file.createMany({
          data: files,
          skipDuplicates: true,
        });
      }
    });
  }
}

function buildProjectCreatedAt(
  now: Date,
  teamIndex: number,
  projectIndex: number,
) {
  const daysOffset = teamIndex * 4 + projectIndex + 2;
  return new Date(now.getTime() - daysOffset * 86400000);
}

function buildProjectUpdatedAt(
  now: Date,
  teamIndex: number,
  projectIndex: number,
) {
  const hoursOffset = teamIndex * 12 + projectIndex * 6 + 3;
  return new Date(now.getTime() - hoursOffset * 3600000);
}

function buildFileUpdatedAt(
  now: Date,
  teamIndex: number,
  projectIndex: number,
  fileIndex: number,
) {
  const hoursOffset = teamIndex * 18 + projectIndex * 6 + fileIndex + 1;
  return new Date(now.getTime() - hoursOffset * 3600000);
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
