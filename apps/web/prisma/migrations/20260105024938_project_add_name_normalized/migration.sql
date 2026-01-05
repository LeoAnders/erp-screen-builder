/*
  Warnings:

  - You are about to drop the column `description` on the `Project` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[team_id,name_normalized]` on the table `Project` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name_normalized` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "File_project_id_name_key";

-- DropIndex
DROP INDEX "Project_team_id_name_key";

-- AlterTable
ALTER TABLE "File" ALTER COLUMN "name" SET DEFAULT 'Untitled';

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "description",
ADD COLUMN     "name_normalized" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Project_team_id_name_normalized_key" ON "Project"("team_id", "name_normalized");
