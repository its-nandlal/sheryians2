-- AlterTable
ALTER TABLE "course" ADD COLUMN     "bannerFileId" TEXT,
ADD COLUMN     "introVideoFileId" TEXT,
ADD COLUMN     "introVideoUrl" TEXT,
ADD COLUMN     "thumbnailFileId" TEXT;

-- CreateTable
CREATE TABLE "chapter" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "order" INTEGER NOT NULL,
    "videoUrl" TEXT,
    "videoFileId" TEXT,
    "duration" TEXT,
    "isFree" BOOLEAN NOT NULL DEFAULT false,
    "moduleId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "chapter_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "chapter" ADD CONSTRAINT "chapter_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "module"("id") ON DELETE CASCADE ON UPDATE CASCADE;
