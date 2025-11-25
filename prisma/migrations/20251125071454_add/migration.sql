-- DropForeignKey
ALTER TABLE "public"."Node" DROP CONSTRAINT "Node_treeId_fkey";

-- AddForeignKey
ALTER TABLE "Node" ADD CONSTRAINT "Node_treeId_fkey" FOREIGN KEY ("treeId") REFERENCES "Tree"("id") ON DELETE CASCADE ON UPDATE CASCADE;
