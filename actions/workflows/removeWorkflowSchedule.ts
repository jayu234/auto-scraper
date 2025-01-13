"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function RemoveWorkflowSchedule(workflowId: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthenticated!");
  }

  await prisma.workflow.update({
    where: {
      id: workflowId,
      userId,
    },
    data: {
      cron: null,
      nextRunAt: null,
    },
  });

  revalidatePath(`/dashboard/workflows`);
}
