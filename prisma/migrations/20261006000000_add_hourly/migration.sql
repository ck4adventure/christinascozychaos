-- CreateTable
CREATE TABLE "HourlyEntry" (
    "id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "tags" TEXT[],
    "loggedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HourlyEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HourlyEdit" (
    "id" TEXT NOT NULL,
    "entryId" TEXT NOT NULL,
    "prevMessage" TEXT NOT NULL,
    "prevTags" TEXT[],
    "prevLoggedAt" TIMESTAMP(3) NOT NULL,
    "editedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HourlyEdit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HourlyQuickAdd" (
    "id" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "tags" TEXT[],
    "sortOrder" INTEGER NOT NULL,

    CONSTRAINT "HourlyQuickAdd_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "HourlyEntry_loggedAt_idx" ON "HourlyEntry"("loggedAt");

-- CreateIndex
CREATE INDEX "HourlyEdit_entryId_editedAt_idx" ON "HourlyEdit"("entryId", "editedAt");

-- CreateIndex
CREATE UNIQUE INDEX "HourlyQuickAdd_label_key" ON "HourlyQuickAdd"("label");

-- AddForeignKey
ALTER TABLE "HourlyEdit" ADD CONSTRAINT "HourlyEdit_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "HourlyEntry"("id") ON DELETE CASCADE ON UPDATE CASCADE;
