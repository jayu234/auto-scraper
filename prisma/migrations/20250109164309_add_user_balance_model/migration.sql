-- CreateTable
CREATE TABLE "UserBalance" (
    "userId" TEXT NOT NULL,
    "balance" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "UserBalance_pkey" PRIMARY KEY ("userId")
);
