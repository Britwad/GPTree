/*
  Warnings:

  - Added the required column `userId` to the `Node` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable: Add userId column as nullable first
ALTER TABLE "Node" ADD COLUMN "userId" TEXT;

-- Update existing rows: Set userId from the tree's userId
UPDATE "Node" 
SET "userId" = "Tree"."userId" 
FROM "Tree" 
WHERE "Node"."treeId" = "Tree"."id";

-- AlterTable: Make userId required now that all rows have values
ALTER TABLE "Node" ALTER COLUMN "userId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "Node" ADD CONSTRAINT "Node_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
