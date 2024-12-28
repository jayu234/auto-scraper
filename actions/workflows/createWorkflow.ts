'use server';

import prisma from "@/lib/prisma";
import { CreateFlowNode } from "@/lib/workflow/createFlowNode";
import { createWorkflowSchema, createWorkflowSchemaType } from "@/schema/workflow";
import { AppNode } from "@/types/appNode";
import { TaskType } from "@/types/task";
import { WorkflowStatus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";
import { Edge } from "@xyflow/react";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function CreateWorkflow (form: createWorkflowSchemaType) {
  const { success, data } = createWorkflowSchema.safeParse(form);
  if(!success) {
    throw new Error('Invalid form data');
  }

  const { userId } = await auth();

  if(!userId) {
    throw new Error('Anauthenticated');
  }

  const initialFlow: { nodes: AppNode[], edges: Edge[] } = {
    nodes: [],
    edges: [],
  };
  
  initialFlow.nodes.push(CreateFlowNode(TaskType.LAUNCH_BROWSER));
  
  const workflow = await prisma.workflow.create({
    data: {
      userId,
      status: WorkflowStatus.DRAFT,
      defination: JSON.stringify(initialFlow),
      ...data,
    }
  });

  if(!workflow) {
    throw new Error('Failed to create workflow');
  }

  revalidatePath('/workflows');
  redirect(`/workflow/editor/${workflow.id}`);
}