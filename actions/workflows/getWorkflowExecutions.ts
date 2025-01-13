'use server';

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GetWorkflowExecutions(workflowId: string) {
  const { userId } = await auth();
  if(!userId) {
    throw new Error('Unaunthenticated!');
  }

  const executions = await prisma.workflowExecution.findMany({
    where: {
      userId,
      workflowId
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  return executions;
}