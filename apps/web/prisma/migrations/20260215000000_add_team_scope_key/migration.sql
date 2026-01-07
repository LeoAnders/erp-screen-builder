-- CreateExtension
CREATE EXTENSION IF NOT EXISTS unaccent;

-- DropIndex
DROP INDEX IF EXISTS "Team_name_key";

-- AlterTable
ALTER TABLE "Team" ADD COLUMN "name_normalized" VARCHAR(50);
ALTER TABLE "Team" ADD COLUMN "scope_key" VARCHAR(80);
ALTER TABLE "Team" ADD COLUMN "created_by_id" TEXT;

-- Backfill normalized name
UPDATE "Team"
SET "name_normalized" = lower(regexp_replace(unaccent(trim("name")), '\\s+', ' ', 'g'))
WHERE "name_normalized" IS NULL;

-- Backfill scope key
UPDATE "Team"
SET "scope_key" = CASE
  WHEN "visibility" = 'public' THEN 'public'
  WHEN "visibility" = 'private' AND "owner_id" IS NOT NULL THEN 'private:' || "owner_id"
  WHEN "visibility" = 'private' AND "owner_id" IS NULL THEN 'private:unknown:' || "id"
  ELSE 'public'
END
WHERE "scope_key" IS NULL;

-- Backfill created_by_id from owner_id when available
UPDATE "Team"
SET "created_by_id" = "owner_id"
WHERE "created_by_id" IS NULL AND "owner_id" IS NOT NULL;

-- Public teams should not have owner scope
UPDATE "Team"
SET "owner_id" = NULL
WHERE "visibility" = 'public';

-- Enforce not-null for scope key + name normalized
ALTER TABLE "Team" ALTER COLUMN "name_normalized" SET NOT NULL;
ALTER TABLE "Team" ALTER COLUMN "scope_key" SET NOT NULL;

-- CreateIndex
CREATE INDEX "Team_scope_key_idx" ON "Team"("scope_key");
CREATE INDEX "Team_created_by_id_idx" ON "Team"("created_by_id");
CREATE UNIQUE INDEX "Team_scope_key_name_normalized_key" ON "Team"("scope_key", "name_normalized");

-- AddForeignKey
ALTER TABLE "Team" ADD CONSTRAINT "Team_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
