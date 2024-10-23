-- CreateIndex
CREATE INDEX "DailyLogs_ownerId_createdAt_idx" ON "DailyLogs"("ownerId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "DailySurveys_ownerId_createdAt_idx" ON "DailySurveys"("ownerId", "createdAt" DESC);
