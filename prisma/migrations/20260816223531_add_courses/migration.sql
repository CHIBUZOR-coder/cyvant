-- CreateTable
CREATE TABLE "courses" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "academy" TEXT NOT NULL DEFAULT 'cybersecurity',
    "tier" INTEGER NOT NULL,
    "path" TEXT,
    "level" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "format" TEXT NOT NULL DEFAULT 'Online, cohort-based',
    "startingPrice" INTEGER NOT NULL DEFAULT 0,
    "isStartHere" BOOLEAN NOT NULL DEFAULT false,
    "isMostPopular" BOOLEAN NOT NULL DEFAULT false,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "description" TEXT,
    "prerequisites" JSONB NOT NULL DEFAULT '[]',
    "whatYouLearn" JSONB NOT NULL DEFAULT '[]',
    "capstone" TEXT,
    "advancedElective" TEXT,
    "certificationAlignment" JSONB NOT NULL DEFAULT '[]',
    "careerPaths" JSONB NOT NULL DEFAULT '[]',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "courses_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "courses_slug_key" ON "courses"("slug");
