"use server";

import prisma from "@/lib/prisma";
import { FlowToExecutionPlan } from "@/lib/workflow/executionPlan";
import { CalculateCreditsCost } from "@/lib/workflow/helpers";
import { WorkflowStatus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function PublishWorkflow({
  workflowId,
  flowDefinition,
}: {
  workflowId: string;
  flowDefinition: string;
}) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthenticated");
  }

  const workflow = await prisma.workflow.findUnique({
    where: {
      id: workflowId,
      userId,
    },
  });

  if (!workflow) {
    throw new Error("Workflow not found");
  }

  if (workflow.status !== WorkflowStatus.DRAFT) {
    throw new Error("Workflow is not in draft");
  }

  const flow = JSON.parse(flowDefinition);

  const result = FlowToExecutionPlan(flow.nodes, flow.edges);

  if (result.errors) {
    throw new Error("Flow definition is invalid");
  }

  if (!result.executionPlan) {
    throw new Error("Failed to generate execution plan");
  }

  const creditsCost = CalculateCreditsCost(flow.nodes);
  await prisma.workflow.update({
    where: {
      id: workflowId,
    },
    data: {
      status: WorkflowStatus.PUBLISHED,
      defination: flowDefinition,
      executionPlan: JSON.stringify(result.executionPlan),
      creditsCost,
    },
  });

  revalidatePath(`/workflow/editor/${workflowId}`);
}
