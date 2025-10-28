/*
  Warnings:

  - A unique constraint covering the columns `[hash]` on the table `Tree` will be added. If there are existing duplicate values, this will fail.
  - The required column `hash` was added to the `Tree` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "Tree" ADD COLUMN     "hash" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Tree_hash_key" ON "Tree"("hash");
