'use server';

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import parser from 'cron-parser';
import { revalidatePath } from "next/cache";

export async function UpdateWorkflowCron({ workflowId, cron }: { workflowId: string; cron: string }) {
  const { userId } = await auth();

  if(!userId) {
    throw new Error('Unauthenticated!');
  }

  try {
    const interval = parser.parseExpression(cron, { utc: true });
    await prisma.workflow.update({
      where: {
        id: workflowId,
        userId
      },
      data: {
        cron,
        nextRunAt: interval.next().toDate(),
      },
    });
  } catch (error: any) {
    console.error('Invalid cron expression: ', error?.message);
    throw new Error('Invalid cron expression');
  }

  revalidatePath(`/dashboard/workflows`);
}