-- CreateEnum
CREATE TYPE "TeamVisibility" AS ENUM ('private', 'public');

-- CreateEnum
CREATE TYPE "TeamType" AS ENUM ('personal', 'normal');

-- DropIndex
DROP INDEX "Team_name_key";

-- AlterTable
ALTER TABLE "Team" ADD COLUMN     "owner_id" TEXT,
ADD COLUMN     "type" "TeamType" NOT NULL DEFAULT 'normal',
ADD COLUMN     "visibility" "TeamVisibility" NOT NULL DEFAULT 'public';

-- CreateIndex
CREATE INDEX "Team_owner_id_idx" ON "Team"("owner_id");

-- CreateIndex
CREATE INDEX "Team_visibility_idx" ON "Team"("visibility");

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
