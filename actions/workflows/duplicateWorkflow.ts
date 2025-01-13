'use server';

import prisma from "@/lib/prisma";
import { duplicateWorkflowSchema } from "@/schema/workflow";
import { WorkflowStatus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export default async function DuplicateWorkflow(form: {
  workflowId: string,
  name: string,
  description?: string
}) {
  const { success, data } = duplicateWorkflowSchema.safeParse(form);
  if(!success) {
    throw new Error('Invalid form data');
  }

  const { userId } = await auth();

  if(!userId) {
    throw new Error('Unauthenticated');
  }

  const sourceWorkflow = await prisma.workflow.findUnique({
    where: {
      id: data.workflowId
    }
  });

  if(!sourceWorkflow) {
    throw new Error('Workflow not found');
  };

  const result = await prisma.workflow.create({
    data: {
      userId,
      name: data.name,
      description: data.description,
      defination: sourceWorkflow.defination,
      status: WorkflowStatus.DRAFT,
    }
  });

  if(!result) {
    throw new Error('Failed to duplicate workflow');
  }

  revalidatePath('/dashboard/workflows');
}