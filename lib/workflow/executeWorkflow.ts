import "server-only";

import prisma from "../prisma";
import {
  ExecutionPhaseStatus,
  WorkflowExecutionStatus,
} from "@/types/workflow";
import { revalidatePath } from "next/cache";
import { ExecutionPhase, Prisma } from "@prisma/client";
import { TaskRegistry } from "./task/registry";
import { AppNode } from "@/types/appNode";
import { ExecutorRegistry } from "./executor/registry";
import { Environment, ExecutionEnvironment } from "@/types/executor";
import { Browser, Page } from "puppeteer";
import { TaskParamTypes } from "@/types/task";
import { Edge } from "@xyflow/react";
import { LogCollector } from "@/types/log";
import { createLogCollector } from "../log";

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

  const edges = JSON.parse(execution.workflow.defination).edges as Edge[];
  const environment: Environment = { phases: {} };

  /* 
    [UPDATE]
    - WorkflowExecution.startedAt -> NOW()
    - WorkflowExecution.status -> RUNNING
    - Workflow tables -> lastRunAt, lastRunStatus, lastRunId
  */
  await initializeWorkflowExecution(executionId, execution.workflowId);

  /* 
    [UPDATE]
    - ExecutionPhase.status -> PENDING
  */
  await initializePhaseStatuses(execution);

  let executionFailed = false;
  let creditsConsumed = 0;

  for (const phase of execution.phases) {
    const phaseExecution = await executeWorkflowPhase(
      phase,
      environment,
      edges,
      execution.userId
    );
    creditsConsumed += phaseExecution.creditsConsumed;
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

  await cleanupEnvironment(environment);
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

async function executeWorkflowPhase(
  phase: ExecutionPhase,
  environment: Environment,
  edges: Edge[],
  userId: string
) {
  const logCollector = createLogCollector();
  const startedAt = new Date();
  const node = JSON.parse(phase.node) as AppNode;
  setUpPhasesForEnvironment(node, environment, edges);

  await prisma.executionPhase.update({
    where: { id: phase.id },
    data: {
      status: ExecutionPhaseStatus.RUNNING,
      startedAt,
      inputs: JSON.stringify(environment.phases[node.id].inputs),
      outputs: JSON.stringify(environment.phases[node.id].outputs),
    },
  });

  const creditsRequired = TaskRegistry[node.data.type].credits;

  let success = await decrementCredits(userId, creditsRequired, logCollector);
  const creditsConsumed = success ? creditsRequired : 0;

  if(success) {
    success = await executePhase(phase, node, environment, logCollector);
  }

  const outputs = environment.phases[node.id].outputs;
  await finalizePhase(phase.id, success, outputs, logCollector, creditsConsumed);

  return { success, creditsConsumed };
}

async function finalizePhase(
  phaseId: string,
  success: boolean,
  outputs: any,
  logCollector: LogCollector,
  creditsConsumed: number
) {
  const finalStatus = success
    ? ExecutionPhaseStatus.COMPLETED
    : ExecutionPhaseStatus.FAILED;

  await prisma.executionPhase.update({
    where: { id: phaseId },
    data: {
      status: finalStatus,
      completedAt: new Date(),
      outputs: JSON.stringify(outputs),
      creditsConsumed,
      logs: {
        createMany: {
          data: logCollector.getAll().map((log) => ({
            message: log.message,
            logLevel: log.level,
            timestamp: log.timesamp,
          })),
        },
      },
    },
  });
}

async function executePhase(
  phase: ExecutionPhase,
  node: AppNode,
  environment: Environment,
  logCollector: LogCollector
): Promise<boolean> {
  const runFn = ExecutorRegistry[node.data.type];
  if (!runFn) {
    return false;
  }

  const executionEnvironment = createExecutionEnvironment(
    node,
    environment,
    logCollector
  );
  return await runFn(executionEnvironment);
}

function setUpPhasesForEnvironment(
  node: AppNode,
  environment: Environment,
  edges: Edge[]
) {
  environment.phases[node.id] = { inputs: {}, outputs: {} };
  const inputs = TaskRegistry[node.data.type].inputs;

  for (const input of inputs) {
    if (input.type === TaskParamTypes.BROWSER_INSTANCE) continue;
    const inputValue = node.data.inputs[input.name];
    if (inputValue) {
      environment.phases[node.id].inputs[input.name] = inputValue;
      continue;
    }

    // Get input from other nodes output
    const connectedEdge = edges.find(
      (edge) => edge.target === node.id && edge.targetHandle === input.name
    );

    if (!connectedEdge) {
      console.log(
        "Missing connected edge for input ",
        input.name,
        " in node ",
        node.id
      );
      continue;
    }

    const outputValue =
      environment.phases[connectedEdge.source].outputs[
        connectedEdge.sourceHandle!
      ];
    environment.phases[node.id].inputs[input.name] = outputValue;
  }
}

function createExecutionEnvironment(
  node: AppNode,
  environment: Environment,
  logCollector: LogCollector
): ExecutionEnvironment<any> {
  return {
    getInput: (key: string) => environment.phases[node.id]?.inputs[key],
    setOutput: (key: string, value: string) => {
      environment.phases[node.id].outputs[key] = value;
    },
    getBrowser: () => environment.browser,
    setBrowser: (browser: Browser) => (environment.browser = browser),
    getPage: () => environment.page,
    setPage: (page: Page) => (environment.page = page),
    log: logCollector,
  };
}

async function cleanupEnvironment(environment: Environment) {
  if (environment.browser) {
    await environment.browser
      .close()
      .catch((error) => console.error("Error closing browser: ", error));
  }
}

async function decrementCredits(
  userId: string,
  amount: number,
  logCollector: LogCollector
) {
  try {
    await prisma.userBalance.update({
      where: { userId, credits: { gte: amount } },
      data: { credits: { decrement: amount } },
    });
    return true;
  } catch (error: any) {
    console.error(error?.message);
    logCollector.error("Insufficient balance");
    return false;
  }
}
