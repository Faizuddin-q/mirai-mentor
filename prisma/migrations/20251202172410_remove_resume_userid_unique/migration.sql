-- DropIndex
DROP INDEX "Resume_userId_key";

-- CreateIndex
CREATE INDEX "Resume_userId_idx" ON "Resume"("userId");
