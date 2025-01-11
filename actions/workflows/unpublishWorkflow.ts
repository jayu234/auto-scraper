'use server';

import prisma from "@/lib/prisma";
import { WorkflowStatus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function UnpublishWorkflow(workflowId: string) {

  const { userId } = await auth();
  if(!userId) {
    throw new Error("Unauthenticated!");
  }

  const workflow = await prisma.workflow.findUnique({
    where: {
      id: workflowId,
      userId
    }
  });

  if(!workflow) {
    throw new Error("Workflow not found!");
  }

  if(workflow.status !== WorkflowStatus.PUBLISHED) {
    throw new Error("Workflow is not published!");
  }

  await prisma.workflow.update({
    data: {
      status: WorkflowStatus.DRAFT,
      executionPlan: null,
      creditsCost: 0
    },
    where: {
      id: workflowId
    }
  });

  revalidatePath(`/workflow/editor/${workflowId}`);
}