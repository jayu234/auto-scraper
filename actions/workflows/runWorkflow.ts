'use server';

import prisma from "@/lib/prisma";
import { FlowToExecutionPlan } from "@/lib/workflow/executionPlan";
import { TaskRegistry } from "@/lib/workflow/task/registry";
import { ExecutionPhaseStatus, WorkflowExecutionPlan, WorkflowExecutionStatus, WorkflowTrigger } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";

export async function RunWorkflow(form: {
  workflowId: string;
  flowDefinition: string;
}) {
  const { userId } = await auth();
  if(!userId) {
    throw new Error("Unauthenticated");
  }

  const { workflowId, flowDefinition } = form;
  if(!workflowId) {
    throw new Error("Workflow ID is required");
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

  if(!flowDefinition) {
    throw new Error("Flow definition is not defined!");
  }

  const flow = JSON.parse(flowDefinition);

  const result = FlowToExecutionPlan(flow.nodes, flow.edges);
  if(result.errors) {
    throw new Error('Flow definition is invalid');
  }

  if(!result.executionPlan) {
    throw new Error("Failed to generate execution plan");
  }

  const executionPlan: WorkflowExecutionPlan = result.executionPlan;

  const execution = await prisma.workflowExecution.create({
    data: {
      workflowId,
      userId,
      status: WorkflowExecutionStatus.PENDING,
      trigger: WorkflowTrigger.MANUAL,
      phases: {
        create: executionPlan.flatMap((phase) => {
          return phase.nodes.flatMap((node) => {
            return {
              userId,
              status: ExecutionPhaseStatus.CREATED,
              number: phase.phase,
              node: JSON.stringify(node),
              name: TaskRegistry[node.data.type].label,
            }
          })
        })
      }
    },
    select: {
      id: true,
      phases: true,
    }
  });

  if(!execution) {
    throw new Error("Failed to create execution");
  }
}
