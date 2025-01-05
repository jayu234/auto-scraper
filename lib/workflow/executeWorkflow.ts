import "server-only";

import prisma from "../prisma";
import { ExecutionPhaseStatus, WorkflowExecutionStatus } from "@/types/workflow";
import { revalidatePath } from "next/cache";
import { ExecutionPhase, Prisma } from "@prisma/client";
import wait from "../wait";
import { TaskRegistry } from "./task/registry";
import { AppNode } from "@/types/appNode";
import { ExecutorRegistry } from "./executor/registry";

type ExecutionWithPhasesType = Prisma.WorkflowExecutionGetPayload<{
  include: { phases: true };
}>;

export async function ExecuteWorkflow(executionId: string) {
  const execution = await prisma.workflowExecution.findUnique({
    where: { id: executionId },
    include: { workflow: true, phases: true },
  });

  if (!execution) {
    throw new Error("Execution not found");
  }

  const environment = { phases: {} };

  await initializeWorkflowExecution(executionId, execution.workflowId);
  await initializePhaseStatuses(execution);

  let executionFailed = false;
  let creditsConsumed = 0;

  for (const phase of execution.phases) {
    const phaseExecution = await executeWorkflowPhase(phase);
    if (!phaseExecution) {
      executionFailed = true;
      break;
    }
  }

  await finalizeWorkflowExecution(
    executionId,
    execution.workflowId,
    executionFailed,
    creditsConsumed
  );

  revalidatePath("/workflow/runs");
}

async function initializeWorkflowExecution(
  executionId: string,
  workflowId: string
) {
  await prisma.workflowExecution.update({
    where: { id: executionId },
    data: {
      startedAt: new Date(),
      status: WorkflowExecutionStatus.RUNNING,
    },
  });
  
  await prisma.workflow.update({
    where: {
      id: workflowId,
    },
    data: {
      lastRunAt: new Date(),
      lastRunStatus: WorkflowExecutionStatus.RUNNING,
      lastRunId: executionId,
    },
  });
}

async function initializePhaseStatuses(execution: ExecutionWithPhasesType) {
  await prisma.executionPhase.updateMany({
    where: {
      id: {
        in: execution.phases.map((phase) => phase.id),
      },
    },
    data: {
      status: ExecutionPhaseStatus.PENDING,
    },
  });
}

async function finalizeWorkflowExecution(
  executionId: string,
  workflowId: string,
  executoinFailed: boolean,
  creditsConsumed: number
) {
  const finalStatus = executoinFailed
    ? WorkflowExecutionStatus.FAILED
    : WorkflowExecutionStatus.COMPLETED;

  await prisma.workflowExecution.update({
    where: {
      id: executionId,
      workflowId: workflowId,
    },
    data: {
      status: finalStatus,
      completedAt: new Date(),
      creditsConsumed,
    },
  });

  await prisma.workflow
    .update({
      where: {
        id: workflowId,
        lastRunId: executionId,
      },
      data: {
        lastRunStatus: finalStatus,
      },
    })
    .catch((e) => {
      console.log(
        "An execution triggered when an execution was already running: ",
        e
      );
    });

}

async function executeWorkflowPhase(phase: ExecutionPhase) {
  console.log('Started executing phase : ', phase.id);
  
  const startedAt = new Date();
  await prisma.executionPhase.update({
    where: { id: phase.id },
    data: {
      status: ExecutionPhaseStatus.RUNNING,
      startedAt,
    },
  });

  const node = JSON.parse(phase.node) as AppNode;
  const creditsRequired = TaskRegistry[node.data.type].credits;
  console.log("Credits required for phase : ", phase.id, creditsRequired);
  
  // Update user balance

  await wait(2000);
  const success = await executePhase(phase, node);
  await finalizePhase(phase.id, success);

  return { success };
}

async function finalizePhase(phaseId: string, success: boolean) {
  const finalStatus = success ? ExecutionPhaseStatus.COMPLETED : ExecutionPhaseStatus.FAILED;

  await prisma.executionPhase.update({
    where: { id: phaseId },
    data: {
      status: finalStatus,
      completedAt: new Date(),
    },
  });
}

async function executePhase(phase:ExecutionPhase, node: AppNode): Promise<boolean> {
  const runFn = ExecutorRegistry[node.data.type];
  if(!runFn) {
    return false;
  }
  return await runFn();
}