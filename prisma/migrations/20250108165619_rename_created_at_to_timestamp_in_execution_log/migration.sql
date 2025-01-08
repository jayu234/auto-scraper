/*
  Warnings:

  - You are about to drop the column `createdAt` on the `ExecutionLog` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ExecutionPhase" DROP CONSTRAINT "ExecutionPhase_workflowExecutionId_fkey";

-- AlterTable
ALTER TABLE "ExecutionLog" DROP COLUMN "createdAt",
ADD COLUMN     "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AddForeignKey
ALTER TABLE "ExecutionPhase" ADD CONSTRAINT "ExecutionPhase_workflowExecutionId_fkey" FOREIGN KEY ("workflowExecutionId") REFERENCES "WorkflowExecution"("id") ON DELETE CASCADE ON UPDATE CASCADE;
