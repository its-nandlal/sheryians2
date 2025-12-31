-- AlterTable
ALTER TABLE "instructor" ADD COLUMN     "avatarFileId" TEXT;

-- CreateTable
CREATE TABLE "media_file" (
    "id" TEXT NOT NULL,
    "fileId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileType" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "thumbnailUrl" TEXT,
    "size" INTEGER NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT,
    "uploadedBy" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "media_file_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "media_file_fileId_key" ON "media_file"("fileId");

-- CreateIndex
CREATE INDEX "media_file_entityType_entityId_idx" ON "media_file"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "media_file_uploadedBy_idx" ON "media_file"("uploadedBy");
