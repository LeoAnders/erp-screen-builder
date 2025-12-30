/*
  Warnings:

  - A unique constraint covering the columns `[project_id,name]` on the table `File` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[team_id,name]` on the table `Project` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Team` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "File_project_id_name_key" ON "File"("project_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Project_team_id_name_key" ON "Project"("team_id", "name");

-- CreateIndex
CREATE UNIQUE INDEX "Team_name_key" ON "Team"("name");
