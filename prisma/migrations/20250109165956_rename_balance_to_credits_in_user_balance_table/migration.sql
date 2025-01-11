/*
  Warnings:

  - You are about to drop the column `balance` on the `UserBalance` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserBalance" DROP COLUMN "balance",
ADD COLUMN     "credits" INTEGER NOT NULL DEFAULT 0;
