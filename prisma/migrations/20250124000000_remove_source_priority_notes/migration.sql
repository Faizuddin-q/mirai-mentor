-- AlterTable
-- Drop columns from Application table
ALTER TABLE "Application" DROP COLUMN IF EXISTS "source";
ALTER TABLE "Application" DROP COLUMN IF EXISTS "priority";
ALTER TABLE "Application" DROP COLUMN IF EXISTS "notes";

-- DropEnum (only if not used elsewhere)
-- Note: Drop enum types after dropping columns that use them
DROP TYPE IF EXISTS "ApplicationSource";
DROP TYPE IF EXISTS "Priority";

