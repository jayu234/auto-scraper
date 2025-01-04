"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GetWorkflowExecutionWithPhases(
  executionId: string
) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("Anauthenticated");
  }

  const executionWithPhases = await prisma.workflowExecution.findUnique({
    where: {
      id: executionId,
      userId
    },
    include: {
      phases: {
        orderBy: {
          number: "asc",
        },
      },
    },
  });

  if(!executionWithPhases) {
    throw new Error("Execution not found");
  }
  
  return executionWithPhases;
}
