-- CreateTable
CREATE TABLE "webinars" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "date" TIMESTAMP(3) NOT NULL,
    "time" TEXT NOT NULL,
    "description" TEXT,
    "formatSummary" TEXT,
    "speakers" JSONB NOT NULL DEFAULT '[]',
    "registrationOpen" BOOLEAN NOT NULL DEFAULT true,
    "qualifyingQuestion" TEXT NOT NULL DEFAULT 'What''s pulling you toward cybersecurity or AI?',
    "thumbnailImage" TEXT,
    "recordingUrl" TEXT,
    "recordingPermissionConfirmed" BOOLEAN NOT NULL DEFAULT false,
    "recapContent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "webinars_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "webinars_slug_key" ON "webinars"("slug");
