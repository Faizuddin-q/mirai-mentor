-- AlterTable
-- Add title column (nullable first to handle existing rows)
ALTER TABLE "Resume" ADD COLUMN "title" TEXT;

-- Update existing rows with default title
UPDATE "Resume" SET "title" = 'My Resume' WHERE "title" IS NULL;

-- Make title NOT NULL
ALTER TABLE "Resume" ALTER COLUMN "title" SET NOT NULL;

