'use server';

import prisma from "@/lib/prisma";
import { createWorkflowSchema, createWorkflowSchemaType } from "@/schema/workflow";
import { WorkflowStatus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export const CreateWorkflow = async (form: createWorkflowSchemaType) => {
  const { success, data } = createWorkflowSchema.safeParse(form);
  if(!success) {
    throw new Error('Invalid form data');
  }

  const { userId } = await auth();

  if(!userId) {
    throw new Error('Anauthenticated');
  }

  const workflow = await prisma.workflow.create({
    data: {
      ...data,
      userId,
      defination: "TODO",
      status: WorkflowStatus.DRAFT,
    }
  });

  if(!workflow) {
    throw new Error('Failed to create workflow');
  }

  redirect(`/workflow/editor/${workflow.id}`);
}